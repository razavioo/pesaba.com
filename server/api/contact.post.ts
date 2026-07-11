import { createHmac, randomBytes, randomUUID } from 'node:crypto'
import {
  createError,
  defineEventHandler,
  getHeader,
  getRequestIP,
  getRequestURL,
  readRawBody,
  setResponseHeader,
} from 'h3'

type Department = 'sales' | 'support' | 'partnership'

interface ContactBody {
  name: string
  company: string
  email: string
  product: string
  message: string
  department: Department
  consent: boolean
  website: string
}

interface RateBucket {
  count: number
  resetAt: number
}

const WINDOW_MS = 10 * 60 * 1000
const MAX_RATE_BUCKETS = 10_000
const RATE_LIMIT_SALT = randomBytes(32)
const recentRequests = new Map<string, RateBucket>()
let lastRateLimitSweep = 0

const departments = new Set<Department>(['sales', 'support', 'partnership'])
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function asPositiveInteger(value: unknown, fallback: number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

function asBoolean(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

function requestError(requestId: string, statusCode: number, statusMessage: string) {
  return createError({ statusCode, statusMessage, data: { requestId } })
}

function normalizeString(
  source: Record<string, unknown>,
  key: string,
  maxLength: number,
  requestId: string,
  required = false,
) {
  const raw = source[key]
  if (raw === undefined || raw === null) {
    if (required) throw requestError(requestId, 400, `${key} is required`)
    return ''
  }
  if (typeof raw !== 'string') {
    throw requestError(requestId, 400, `${key} must be a string`)
  }

  const value = raw.trim().normalize('NFC')
  if (required && !value) throw requestError(requestId, 400, `${key} is required`)
  if (value.length > maxLength) throw requestError(requestId, 400, `${key} is too long`)
  return value
}

function hasForbiddenControls(value: string, allowNewlines = false) {
  return [...value].some((char) => {
    const code = char.charCodeAt(0)
    if (code === 127 || (code >= 0 && code <= 8) || code === 11 || code === 12) return true
    if (allowNewlines && (code === 9 || code === 10 || code === 13)) return false
    return code >= 14 && code <= 31
  })
}

function parseAllowedOrigins(raw: unknown) {
  const origins = new Set<string>()
  if (typeof raw !== 'string') return origins

  for (const candidate of raw.split(',')) {
    try {
      if (candidate.trim()) origins.add(new URL(candidate.trim()).origin)
    }
    catch {
      // Invalid configured origins are ignored and cannot broaden access.
    }
  }
  return origins
}

function enforceOrigin(event: Parameters<typeof getRequestURL>[0], config: ReturnType<typeof useRuntimeConfig>, requestId: string) {
  const trustProxy = asBoolean(config.contactTrustProxy)
  const requestOrigin = getRequestURL(event, {
    xForwardedHost: trustProxy,
    xForwardedProto: trustProxy,
  }).origin
  const allowedOrigins = parseAllowedOrigins(config.contactAllowedOrigins)
  allowedOrigins.add(requestOrigin)

  try {
    allowedOrigins.add(new URL(String(config.public.siteUrl)).origin)
  }
  catch {
    // A malformed site URL must not disable the same-origin check.
  }

  const origin = getHeader(event, 'origin')
  const fetchSite = getHeader(event, 'sec-fetch-site')
  if (fetchSite === 'cross-site' || (origin && !allowedOrigins.has(origin))) {
    throw requestError(requestId, 403, 'Origin is not allowed')
  }
}

function enforceRateLimit(
  event: Parameters<typeof getRequestIP>[0],
  config: ReturnType<typeof useRuntimeConfig>,
  requestId: string,
) {
  const now = Date.now()
  if (now - lastRateLimitSweep > WINDOW_MS || recentRequests.size >= MAX_RATE_BUCKETS) {
    for (const [key, bucket] of recentRequests) {
      if (bucket.resetAt <= now) recentRequests.delete(key)
    }
    lastRateLimitSweep = now
  }

  if (recentRequests.size >= MAX_RATE_BUCKETS) {
    const oldestKey = recentRequests.keys().next().value
    if (typeof oldestKey === 'string') recentRequests.delete(oldestKey)
  }

  const ip = getRequestIP(event, { xForwardedFor: asBoolean(config.contactTrustProxy) }) || 'unknown'
  const fingerprint = createHmac('sha256', RATE_LIMIT_SALT).update(ip).digest('base64url')
  const maxRequests = asPositiveInteger(config.contactRateLimitMax, 5)
  const existing = recentRequests.get(fingerprint)
  const bucket = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + WINDOW_MS }
    : existing

  if (bucket.count >= maxRequests) {
    setResponseHeader(event, 'retry-after', Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)))
    throw requestError(requestId, 429, 'Too many requests')
  }

  bucket.count++
  recentRequests.set(fingerprint, bucket)
}

function parseBody(source: Record<string, unknown>, requestId: string): ContactBody {
  const name = normalizeString(source, 'name', 120, requestId, true)
  const company = normalizeString(source, 'company', 160, requestId)
  const email = normalizeString(source, 'email', 254, requestId, true).toLowerCase()
  const product = normalizeString(source, 'product', 160, requestId)
  const message = normalizeString(source, 'message', 4_000, requestId, true)
  const website = normalizeString(source, 'website', 200, requestId)
  const department = source.department === undefined ? 'sales' : source.department

  if (!departments.has(department as Department)) {
    throw requestError(requestId, 400, 'Invalid department')
  }
  if (!emailPattern.test(email)) throw requestError(requestId, 400, 'Invalid email')
  if (message.length < 10) throw requestError(requestId, 400, 'Message is too short')
  if (source.consent !== true) throw requestError(requestId, 400, 'Consent is required')
  if ([name, company, email, product].some(value => hasForbiddenControls(value)) || hasForbiddenControls(message, true)) {
    throw requestError(requestId, 400, 'Invalid control characters')
  }

  return {
    name,
    company,
    email,
    product,
    message,
    website,
    department: department as Department,
    consent: true,
  }
}

function parseRecipients(value: unknown) {
  if (typeof value !== 'string') return []
  return value
    .split(/[;,]/)
    .map(address => address.trim().toLowerCase())
    .filter(address => emailPattern.test(address))
}

export default defineEventHandler(async (event) => {
  const requestId = randomUUID()
  const config = useRuntimeConfig(event)
  const maxBodyBytes = asPositiveInteger(config.contactMaxBodyBytes, 16_384)

  setResponseHeader(event, 'cache-control', 'no-store, max-age=0')
  setResponseHeader(event, 'x-request-id', requestId)

  enforceOrigin(event, config, requestId)

  const contentType = getHeader(event, 'content-type') || ''
  if (!/^application\/(?:[\w.+-]*\+)?json(?:\s*;|$)/i.test(contentType)) {
    throw requestError(requestId, 415, 'Content-Type must be application/json')
  }
  if ((getHeader(event, 'content-encoding') || 'identity') !== 'identity') {
    throw requestError(requestId, 415, 'Compressed request bodies are not supported')
  }

  const declaredLength = Number(getHeader(event, 'content-length') || 0)
  if (Number.isFinite(declaredLength) && declaredLength > maxBodyBytes) {
    throw requestError(requestId, 413, 'Request body is too large')
  }

  enforceRateLimit(event, config, requestId)

  const rawBody = await readRawBody(event, 'utf8')
  if (!rawBody || Buffer.byteLength(rawBody, 'utf8') > maxBodyBytes) {
    throw requestError(requestId, rawBody ? 413 : 400, rawBody ? 'Request body is too large' : 'Request body is required')
  }

  let source: unknown
  try {
    source = JSON.parse(rawBody)
  }
  catch {
    throw requestError(requestId, 400, 'Invalid JSON')
  }
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    throw requestError(requestId, 400, 'Request body must be an object')
  }

  const body = parseBody(source as Record<string, unknown>, requestId)

  // Silently accept honeypot submissions without sending email.
  if (body.website) return { ok: true, requestId }

  if (process.env.NODE_ENV !== 'production') {
    return { ok: true, requestId }
  }

  const port = asPositiveInteger(config.smtpPort, 587)
  const secure = asBoolean(config.smtpSecure) || port === 465
  const host = String(config.smtpHost || '').trim()
  const user = String(config.smtpUser || '').trim()
  const pass = String(config.smtpPass || '')
  const fromAddress = String(config.smtpFrom || user).trim()
  const departmentRecipient = {
    sales: config.smtpSalesTo,
    support: config.smtpSupportTo,
    partnership: config.smtpPartnershipTo,
  }[body.department]
  const recipients = parseRecipients(departmentRecipient || config.smtpTo)

  if (!host || !user || !pass || !emailPattern.test(fromAddress) || recipients.length === 0) {
    console.error('[contact] SMTP configuration is incomplete', { requestId })
    throw requestError(requestId, 503, 'Contact service is temporarily unavailable')
  }

  try {
    const nodemailer = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass },
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    })

    const subjectProduct = body.product ? ` - ${body.product}` : ''
    const plainText = [
      `Request ID: ${requestId}`,
      `Department: ${body.department}`,
      `Name: ${body.name}`,
      `Company: ${body.company || '-'}`,
      `Email: ${body.email}`,
      `Product: ${body.product || '-'}`,
      '',
      body.message,
    ].join('\n')

    await transport.sendMail({
      from: { name: 'Pesaba Website', address: fromAddress },
      to: recipients,
      replyTo: { name: body.name, address: body.email },
      subject: `[Website / ${body.department}] ${body.name}${subjectProduct}`,
      text: plainText,
      html: `
        <p><strong>Request ID:</strong> ${requestId}</p>
        <p><strong>Department:</strong> ${escapeHtml(body.department)}</p>
        <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(body.company || '-')}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p><strong>Product:</strong> ${escapeHtml(body.product || '-')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(body.message).replace(/\r?\n/g, '<br>')}</p>
      `,
      disableFileAccess: true,
      disableUrlAccess: true,
    })
  }
  catch (error) {
    const code = error && typeof error === 'object' && 'code' in error
      ? String(error.code).replace(/[^A-Z0-9_-]/gi, '').slice(0, 40)
      : 'UNKNOWN'
    console.error('[contact] email delivery failed', { requestId, code })
    throw requestError(requestId, 502, 'Failed to deliver message')
  }

  return { ok: true, requestId }
})
