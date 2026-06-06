export function useContactInfo() {
  const { locale } = useI18n()

  const salesPhoneHref = 'tel:+982144215738'
  const salesEmail = 'admin@pesaba.com'
  const salesEmailHref = `mailto:${salesEmail}`

  const salesPhoneDisplay = computed(() => locale.value === 'fa' ? '۰۲۱-۴۴۲۱۵۷۳۸' : '+98 21 4421 5738')
  const salesPhoneDisplayInternational = '+98 21 4421 5738'

  return {
    salesPhoneHref,
    salesPhoneDisplay,
    salesPhoneDisplayInternational,
    salesEmail,
    salesEmailHref,
  }
}
