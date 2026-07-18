import { createError, defineEventHandler, getHeader, getRequestIP, getRequestURL, readRawBody, setResponseHeader } from 'h3'

type ContactPayload = {
  department?: 'sales' | 'support' | 'partnership'
  name: string
  company?: string
  email: string
  phone?: string
  product?: string
  message: string
  consent: true
  website?: string
}

/**
 * Keeps the public form same-origin while making the CMS the sole source of
 * lead validation, rate limiting, persistence, and delivery attempts.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const requestId = crypto.randomUUID()
  const contentType = getHeader(event, 'content-type') || ''
  const origin = getHeader(event, 'origin')
  const requestOrigin = getRequestURL(event).origin
  const declaredLength = Number(getHeader(event, 'content-length') || 0)

  setResponseHeader(event, 'cache-control', 'no-store, max-age=0')
  setResponseHeader(event, 'x-request-id', requestId)
  if (!/^application\/(?:[\w.+-]*\+)?json(?:\s*;|$)/i.test(contentType)) {
    throw createError({ statusCode: 415, statusMessage: 'Content-Type must be application/json' })
  }
  if (origin && origin !== requestOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Origin is not allowed' })
  }
  if (Number.isFinite(declaredLength) && declaredLength > 16_384) {
    throw createError({ statusCode: 413, statusMessage: 'Request body is too large' })
  }
  const raw = await readRawBody(event, 'utf8')
  if (!raw || Buffer.byteLength(raw, 'utf8') > 16_384) {
    throw createError({ statusCode: raw ? 413 : 400, statusMessage: raw ? 'Request body is too large' : 'Request body is required' })
  }
  let body: ContactPayload
  try {
    body = JSON.parse(raw) as ContactPayload
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Request body must be valid JSON' })
  }
  const base = String(config.cmsApiInternalUrl).replace(/\/$/, '')

  try {
    const response = await $fetch.raw(`${base}/contact`, {
      method: 'POST',
      body,
      headers: {
        'x-forwarded-for': getRequestIP(event, { xForwardedFor: true }) || 'unknown',
      },
    })
    return response._data
  } catch (cause: any) {
    const statusCode = Number(cause?.response?.status || cause?.statusCode || 502)
    const payload = cause?.data || cause?.response?._data
    throw createError({
      statusCode,
      statusMessage: typeof payload?.message === 'string' ? payload.message : 'Unable to submit the contact request.',
      data: payload,
    })
  }
})
