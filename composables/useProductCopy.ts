type ProductCopyRecord = {
  title?: string
  title_fa?: string
  slug?: string
  category?: string
  description?: string
  description_fa?: string
  description_en?: string
  card_summary?: string
  evidence_reviewed?: boolean
}

const categoryLabels = {
  en: {
    'data-diodes': 'data diodes',
    'network-encryption': 'network encryption',
    'network-switching-filtering': 'network switching and filtering',
    'telecom-transmission': 'telecom transmission',
    'cellular-monitoring': 'cellular monitoring',
    'bio-monitoring': 'water biomonitoring',
  },
  fa: {
    'data-diodes': 'دیتا دیود',
    'network-encryption': 'رمزنگاری شبکه',
    'network-switching-filtering': 'سوئیچینگ و فیلترینگ شبکه',
    'telecom-transmission': 'انتقال مخابراتی',
    'cellular-monitoring': 'پایش شبکه سلولی',
    'bio-monitoring': 'پایش زیستی آب',
  },
} as const

export function useProductCopy() {
  const { locale } = useI18n()

  function publicDescription(product: ProductCopyRecord | null | undefined): string {
    if (!product) return ''

    const language = locale.value === 'fa' ? 'fa' : 'en'
    if (product.evidence_reviewed === true) {
      const reviewed = language === 'fa'
        ? product.card_summary || product.description_fa || product.description
        : product.card_summary || product.description_en || product.description
      if (reviewed?.trim()) return reviewed.trim()
    }

    const title = (language === 'fa' ? product.title_fa || product.title : product.title) || product.slug || 'Product'
    const category = categoryLabels[language][product.category as keyof typeof categoryLabels[typeof language]]
      || (language === 'fa' ? 'محصول' : 'product')

    return language === 'fa'
      ? `${title} در رده ${category} قرار دارد. مشخصات، سازگاری، قابلیت‌ها و شرایط استقرار باید برای مدل و نسخه انتخابی از مستندات جاری تأیید شوند.`
      : `${title} is listed in the ${category} catalogue. Specifications, compatibility, capabilities, and deployment terms must be confirmed for the selected model and revision.`
  }

  return { publicDescription }
}
