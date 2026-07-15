<template>
  <div v-if="useCase">
    <!-- Hero with image -->
    <section class="page-hero relative overflow-hidden" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <div class="absolute inset-0 opacity-30" :style="heroMediaStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(90deg, rgba(9,53,68,0.88) 0%, rgba(9,53,68,0.45) 55%, transparent 100%);" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.05) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

      <div class="container-site relative py-16 lg:py-24">
        <nav class="flex items-center gap-2 text-xs text-white/40 mb-8" aria-label="breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-white/70 transition-colors">{{ $t('common.home') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink :to="localePath('/use-cases')" class="hover:text-white/70 transition-colors">{{ $t('nav.use_cases') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <span class="text-white/60">{{ useCase.title }}</span>
        </nav>

        <div class="max-w-2xl">
          <div class="label-accent mb-5 inline-flex items-center border border-[#AAC5D0]/30 px-3 py-1 !text-[#AAC5D0]">{{ $t('nav.use_cases') }}</div>
          <h1
            class="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight"
            style="letter-spacing: -0.025em;"
          >
            {{ useCase.title }}
          </h1>
          <p v-if="useCase.description" class="text-lg text-white/70 leading-relaxed mb-4 max-w-xl">
            {{ useCase.description }}
          </p>
          <p v-if="useCase.tagline" class="text-sm font-mono text-[#AAC5D0]/70 mb-8">
            // {{ useCase.tagline }}
          </p>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" size="lg" :to="localePath('/company/contact')">{{ $t('products.request_quote') }}</BaseButton>
            <BaseButton variant="outline" size="lg" :to="localePath('/products')">{{ $t('use_cases.explore_products') }}</BaseButton>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <!-- Content -->
    <section class="container-site py-16">
      <CmsMarkdown :source="String(useCase.body || '')" class="prose-custom max-w-prose-narrow" />
    </section>

    <CTAStrip :headline="$t('use_cases.cta_headline')" :primary-label="$t('products.request_quote')" :primary-href="localePath('/company/contact')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { emitBreadcrumbs } = useSchemaOrg()

const { get } = usePublicCms()
const { data: useCase } = await useAsyncData(`use-case-${route.params.slug}-${locale.value}`, () =>
  get('use_case', String(route.params.slug), locale.value as 'fa' | 'en'), { watch: [locale] },
)

if (!useCase.value) {
  throw createError({ statusCode: 404, statusMessage: 'Use case not found' })
}

if (useCase.value) {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://pesaba.com').replace(/\/$/, '')
  const useCaseTitle = String(useCase.value.title || route.params.slug)
  const canonicalSlug = String(useCase.value.slug || route.params.slug)
  const socialImage = `${siteUrl}/og/use-case/${canonicalSlug}.${locale.value}.png`
  useSeoMeta({
    title: `${useCaseTitle} | Pesaba`,
    ogTitle: `${useCaseTitle} | Pesaba`,
    description: useCase.value.description,
    ogDescription: useCase.value.description,
    ogImage: socialImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    twitterTitle: `${useCaseTitle} | Pesaba`,
    twitterDescription: useCase.value.description,
    twitterImage: socialImage,
    twitterCard: 'summary_large_image',
  })
  emitBreadcrumbs([
    { name: t('nav.use_cases'), url: `/${locale.value}/use-cases` },
    { name: useCaseTitle, url: `/${locale.value}/use-cases/${canonicalSlug}` },
  ])
}

const { withBase } = useBaseUrl()

const heroMediaStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'right center'
  const image = typeof useCase.value?.hero_image === 'string'
    ? useCase.value.hero_image
    : typeof useCase.value?.image === 'string'
      ? useCase.value.image
      : `/images/use-cases/${useCase.value?.slug}.png`
  return `background-image: url('${withBase(image)}'); background-size: cover; background-position: ${position};`
})


</script>
