<template>
  <div v-if="useCase">
    <!-- Hero with image -->
    <section class="relative overflow-hidden bg-[#093544]" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
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
          <div class="mb-5 inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] border border-[#AAC5D0]/30 text-[#AAC5D0]">{{ $t('nav.use_cases') }}</div>
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
      <div class="prose-custom max-w-prose-narrow"><ContentRenderer :value="useCase" /></div>
    </section>

    <CTAStrip :headline="$t('use_cases.cta_headline')" :primary-label="$t('products.request_quote')" :primary-href="localePath('/company/contact')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { emitBreadcrumbs } = useSchemaOrg()

const { data: useCase } = await useAsyncData(`use-case-${route.params.slug}-${locale.value}`, () =>
  queryContent('use-cases').where({ slug: route.params.slug as string, locale: locale.value }).findOne()
    .catch(() => queryContent('use-cases').where({ slug: route.params.slug as string }).findOne())
)

if (useCase.value) {
  useSeoMeta({
    title: `${useCase.value.title} | Pesaba`,
    description: useCase.value.description,
    ogImage: `https://pesaba.com/images/use-cases/${useCase.value.slug}.png`,
    twitterCard: 'summary_large_image',
  })
  emitBreadcrumbs([
    { name: t('nav.use_cases'), url: `/${locale.value}/use-cases` },
    { name: useCase.value.title, url: `/${locale.value}/use-cases/${useCase.value.slug}` },
  ])
}

const { withBase } = useBaseUrl()

const heroMediaStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'right center'
  return `background-image: url('${withBase(`/images/use-cases/${useCase.value?.slug}.png`)}'); background-size: cover; background-position: ${position};`
})


</script>
