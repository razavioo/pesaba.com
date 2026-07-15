type LabelTree = Record<string, unknown>

function isLabelTree(value: unknown): value is LabelTree {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const base = String(config.public.cmsApiUrl).replace(/\/$/, '')
  try {
    const setting = await $fetch(`${base}/public/settings/labels`) as { data?: { fa?: LabelTree; en?: LabelTree } }
    const i18n = nuxtApp.$i18n as { mergeLocaleMessage?: (locale: string, messages: LabelTree) => void }
    if (isLabelTree(setting.data?.fa)) i18n.mergeLocaleMessage?.('fa', setting.data.fa)
    if (isLabelTree(setting.data?.en)) i18n.mergeLocaleMessage?.('en', setting.data.en)
  } catch {
    // Built-in locale files remain a resilient public fallback when CMS is unavailable.
  }
})
