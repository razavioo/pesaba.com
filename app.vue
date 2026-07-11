<template>
  <div class="light" :dir="dir">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const config = useRuntimeConfig()

const SEO_LOCALES = [
  { code: 'fa' as const, hreflang: 'fa-IR' },
  { code: 'en' as const, hreflang: 'en-US' },
]

const dir = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr')
const siteUrl = computed(() => String(config.public.siteUrl || 'https://pesaba.com').replace(/\/+$/, ''))
const canonicalPath = computed(() => {
  const path = route.path || '/'
  return path.length > 1 ? path.replace(/\/+$/, '') : path
})
const canonicalUrl = computed(() => `${siteUrl.value}${canonicalPath.value}`)
const defaultTitle = computed(() => t('meta.default_title'))
const defaultDescription = computed(() => t('meta.default_description'))
const defaultOgImage = computed(() => `${siteUrl.value}/og/site/home.${locale.value}.png`)
const robotsDirective = computed(() => config.public.siteIndexable
  ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  : 'noindex, nofollow')

function absoluteLocalePath(code: 'fa' | 'en') {
  const path = switchLocalePath(code)
  if (!path) return null
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path
  return `${siteUrl.value}${normalized}`
}

useHead({
  htmlAttrs: {
    lang: () => locale.value === 'fa' ? 'fa-IR' : 'en-US',
    dir: () => locale.value === 'fa' ? 'rtl' : 'ltr',
    class: 'light',
  },
  link: computed(() => {
    const alternates = SEO_LOCALES.flatMap(({ code, hreflang }) => {
      const href = absoluteLocalePath(code)
      return href ? [{ key: `alternate-${code}`, rel: 'alternate', hreflang, href }] : []
    })
    const defaultHref = absoluteLocalePath('fa')

    return [
      { key: 'canonical', rel: 'canonical', href: canonicalUrl.value },
      ...alternates,
      ...(defaultHref ? [{ key: 'alternate-x-default', rel: 'alternate', hreflang: 'x-default', href: defaultHref }] : []),
    ]
  }),
  meta: computed(() => [
    { key: 'og-url', property: 'og:url', content: canonicalUrl.value },
    { key: 'og-locale', property: 'og:locale', content: locale.value === 'fa' ? 'fa_IR' : 'en_US' },
    { key: 'og-locale-alternate', property: 'og:locale:alternate', content: locale.value === 'fa' ? 'en_US' : 'fa_IR' },
  ]),
})

useSeoMeta({
  robots: robotsDirective,
  ogTitle: defaultTitle,
  ogDescription: defaultDescription,
  ogImage: defaultOgImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  twitterTitle: defaultTitle,
  twitterDescription: defaultDescription,
  twitterImage: defaultOgImage,
  twitterCard: 'summary_large_image',
})
</script>
