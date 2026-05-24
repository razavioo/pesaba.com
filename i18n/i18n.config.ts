export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fa',
  fallbackLocale: 'en',
  datetimeFormats: {
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long:  { year: 'numeric', month: 'long',  day: 'numeric', weekday: 'short' },
    },
    fa: {
      short: { year: 'numeric', month: 'short', day: 'numeric', calendar: 'persian', numberingSystem: 'latn' },
      long:  { year: 'numeric', month: 'long',  day: 'numeric', calendar: 'persian', numberingSystem: 'latn' },
    },
  },
  numberFormats: {
    en: {
      decimal:  { style: 'decimal',  minimumFractionDigits: 0, maximumFractionDigits: 2 },
      currency: { style: 'currency', currency: 'USD' },
    },
    fa: {
      decimal:  { style: 'decimal',  minimumFractionDigits: 0, maximumFractionDigits: 2 },
      currency: { style: 'currency', currency: 'IRR', numberingSystem: 'latn' },
    },
  },
}))
