import argon2 from 'argon2'
import { PrismaClient, UserRole } from '@prisma/client'
import { loadConfig } from './config'

async function seed() {
  loadConfig()
  const email = process.env.CMS_BOOTSTRAP_EMAIL?.trim().toLowerCase()
  const password = process.env.CMS_BOOTSTRAP_PASSWORD
  const name = process.env.CMS_BOOTSTRAP_NAME?.trim() || 'مالک پنل'
  if (!email || !password || password.length < 12) throw new Error('Set CMS_BOOTSTRAP_EMAIL and a 12+ character CMS_BOOTSTRAP_PASSWORD before seeding.')
  const prisma = new PrismaClient()
  await prisma.$connect()
  await prisma.user.upsert({
    where: { email },
    create: { email, displayName: name, passwordHash: await argon2.hash(password, { type: argon2.argon2id }), role: UserRole.OWNER },
    update: { displayName: name, role: UserRole.OWNER },
  })
  const settings = [
    ['site', { legacyVariables: {} }],
    ['contact', {
      phone: '+982144215738', phoneDisplay: { fa: '۰۲۱-۴۴۲۱۵۷۳۸', en: '+98 21 4421 5738' }, email: 'admin@pesaba.com',
      address: { fa: 'تهران، بلوار مرزداران، خیابان شهید ابراهیمی، نبش کوچه الوند هفتم، پلاک ۲', en: 'No. 2, 7th Alvand Alley, Ebrahimi St., Marzdaran Blvd., Tehran - IRAN' },
      mapUrl: 'https://www.google.com/maps/place/%D9%BE%D8%B1%D8%AA%D9%88+%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7+%D8%B5%D8%A8%D8%A7%E2%80%AD/@35.7315228,51.3446176,20z/data=!4m5!3m4!1s0x3f8dfd6fbc1bc0dd:0x928653e044a47e7c!8m2!3d35.7315228!4d51.3446176',
      linkedinUrl: 'https://ir.linkedin.com/company/partov-ertebat-saba', recipients: { sales: '', support: '', partnership: '' }, formEnabled: true,
    }],
    ['contact_operations', { recipients: { sales: '', support: '', partnership: '' }, formEnabled: true }],
    ['navigation', { header: [], footer: [], legal: [] }],
    ['branding', { name: { fa: 'پرتو ارتباط صبا', en: 'Pesaba' }, tagline: { fa: 'سخت افزار برای شبکه های حیاتی', en: 'Hardware for critical networks' }, footerTagline: { fa: 'طراحی سخت‌افزار برای انتقال کنترل‌شده داده و حفاظت از شبکه‌های حیاتی.', en: 'Hardware for controlled transfer and protection of critical networks.' }, logoUrl: '/pesaba-mark.svg' }],
    ['seo', { defaultTitle: { fa: 'پرتو ارتباط صبا | سخت افزار برای شبکه های حیاتی', en: 'Pesaba | Hardware for critical networks' }, defaultDescription: { fa: 'راهکارهای سخت افزاری برای انتقال کنترل شده داده، رمزنگاری شبکه و پایش زیرساخت.', en: 'Hardware products for controlled data transfer, network encryption, and infrastructure monitoring.' }, defaultImageUrl: '', twitterHandle: '' }],
    ['labels', { fa: {}, en: {} }],
  ] as const
  // Seeding provisions only missing defaults. It must never overwrite values
  // an Owner changed from the panel.
  for (const [namespace, data] of settings) await prisma.siteSetting.upsert({ where: { namespace }, create: { namespace, data }, update: {} })
  await prisma.$disconnect()
}

seed().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
