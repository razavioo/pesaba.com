export function useContactInfo() {
  const { locale } = useI18n()
  const { contact } = usePublicSettings()

  const salesPhoneHref = computed(() => `tel:${contact.data.value.phone.replace(/[^+\d]/g, '')}`)
  const salesEmail = computed(() => contact.data.value.email)
  const salesEmailHref = computed(() => `mailto:${salesEmail.value}`)

  const salesPhoneDisplay = computed(() => contact.data.value.phoneDisplay[locale.value === 'fa' ? 'fa' : 'en'])
  const salesPhoneDisplayInternational = computed(() => contact.data.value.phoneDisplay.en)

  return {
    salesPhoneHref,
    salesPhoneDisplay,
    salesPhoneDisplayInternational,
    salesEmail,
    salesEmailHref,
  }
}
