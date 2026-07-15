import type { BrandingSettings, ContactSettings, NavigationSettings, SeoSettings } from '@pesaba/cms-contracts'

export const defaultContactSettings: ContactSettings = {
  phone: '+982144215738',
  phoneDisplay: { fa: '۰۲۱-۴۴۲۱۵۷۳۸', en: '+98 21 4421 5738' },
  email: 'admin@pesaba.com',
  address: { fa: 'تهران، بلوار مرزداران، خیابان شهید ابراهیمی، نبش کوچه الوند هفتم، پلاک ۲', en: 'No. 2, 7th Alvand Alley, Ebrahimi St., Marzdaran Blvd., Tehran - IRAN' },
  mapUrl: 'https://www.google.com/maps/place/%D9%BE%D8%B1%D8%AA%D9%88+%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7+%D8%B5%D8%A8%D8%A7%E2%80%AD/@35.7315228,51.3446176,20z/data=!4m5!3m4!1s0x3f8dfd6fbc1bc0dd:0x928653e044a47e7c!8m2!3d35.7315228!4d51.3446176',
  linkedinUrl: 'https://ir.linkedin.com/company/partov-ertebat-saba',
  recipients: { sales: '', support: '', partnership: '' },
  formEnabled: true,
}

export const defaultBrandingSettings: BrandingSettings = {
  name: { fa: 'پرتو ارتباط صبا', en: 'Pesaba' },
  tagline: { fa: 'سخت افزار برای شبکه های حیاتی', en: 'Hardware for critical networks' },
  footerTagline: { fa: 'طراحی سخت‌افزار برای انتقال کنترل‌شده داده و حفاظت از شبکه‌های حیاتی.', en: 'Hardware for controlled transfer and protection of critical networks.' },
  logoUrl: '/pesaba-mark.svg',
}

export const defaultNavigationSettings: NavigationSettings = {
  header: [], footer: [], legal: [],
}

export const defaultSeoSettings: SeoSettings = {
  defaultTitle: { fa: 'پرتو ارتباط صبا | سخت افزار برای شبکه های حیاتی', en: 'Pesaba | Hardware for critical networks' },
  defaultDescription: { fa: 'راهکارهای سخت افزاری برای انتقال کنترل شده داده، رمزنگاری شبکه و پایش زیرساخت.', en: 'Hardware products for controlled data transfer, network encryption, and infrastructure monitoring.' },
  defaultImageUrl: '',
  twitterHandle: '',
}

type PublicSetting<T> = { namespace: string; data: T; updatedAt: string }

function useSetting<T>(namespace: string, fallback: T) {
  const config = useRuntimeConfig()
  const base = String(config.public.cmsApiUrl).replace(/\/$/, '')
  const { data, pending, error, refresh } = useAsyncData(`public-setting-${namespace}`, async () => {
    try {
      const setting = await $fetch(`${base}/public/settings/${namespace}`) as PublicSetting<T>
      return setting.data
    } catch {
      return fallback
    }
  }, { default: () => fallback })
  return { data, pending, error, refresh }
}

export function usePublicSettings() {
  const contact = useSetting('contact', defaultContactSettings)
  const branding = useSetting('branding', defaultBrandingSettings)
  const navigation = useSetting('navigation', defaultNavigationSettings)
  const seo = useSetting('seo', defaultSeoSettings)
  return { contact, branding, navigation, seo }
}
