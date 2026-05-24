import { defineEventHandler, readBody } from 'h3'

interface ContactBody {
  name?: string
  company?: string
  email?: string
  product?: string
  message?: string
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  const name = (body.name || '').trim().slice(0, 200)
  const company = (body.company || '').trim().slice(0, 200)
  const email = (body.email || '').trim().slice(0, 254)
  const product = (body.product || '').trim().slice(0, 100)
  const message = (body.message || '').trim().slice(0, 2000)

  if (!name || !email) {
    throw createError({ statusCode: 400, statusMessage: 'name and email are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'invalid email' })
  }

  const config = useRuntimeConfig()

  // Log in development; send email in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[contact form]', { name, company, email, product, message: message.slice(0, 80) })
    return { ok: true }
  }

  try {
    const nodemailer = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: false,
      auth: { user: config.smtpUser, pass: config.smtpPass },
    })

    await transport.sendMail({
      from: `"Pesaba Website" <${config.smtpUser}>`,
      to: config.smtpTo || 'admin@pesaba.com',
      replyTo: email,
      subject: `[Quote Request] ${product || 'General'} — ${escapeHtml(name)}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Product:</strong> ${escapeHtml(product)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    })
  } catch (err) {
    console.error('[contact] email send failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }

  return { ok: true }
})
