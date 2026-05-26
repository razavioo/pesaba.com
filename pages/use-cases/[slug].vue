<template>
  <div v-if="useCase">
    <!-- Hero with image -->
    <section class="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <!-- Hero background image -->
      <div class="absolute inset-0" :style="heroMediaStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" :style="heroOverlayStyle" aria-hidden="true" />
      <!-- Dot grid overlay -->
      <div class="absolute inset-0 pointer-events-none bg-graph-paper opacity-30" aria-hidden="true" />
      <!-- Cyan glow -->
      <div class="absolute start-0 top-0 w-[400px] h-[400px] rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%); filter: blur(60px);" aria-hidden="true" />

      <div class="container-site relative py-16 lg:py-24">
        <nav class="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8" aria-label="breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-[var(--text-secondary)] transition-colors">{{ $t('common.home') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink :to="localePath('/use-cases')" class="hover:text-[var(--text-secondary)] transition-colors">{{ $t('nav.use_cases') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <span class="text-[var(--text-secondary)]">{{ useCase.title }}</span>
        </nav>

        <div class="max-w-2xl">
          <BaseBadge color="photon" class="mb-5">{{ $t('nav.use_cases') }}</BaseBadge>
          <h1
            class="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-5 leading-tight"
            style="letter-spacing: -0.025em;"
          >
            {{ useCase.title }}
          </h1>
          <p v-if="useCase.description" class="text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-xl">
            {{ useCase.description }}
          </p>
          <p v-if="useCase.tagline" class="text-sm font-mono text-photon-500/80 mb-8">
            // {{ useCase.tagline }}
          </p>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" size="lg" :to="localePath('/company/contact')">{{ $t('products.request_quote') }}</BaseButton>
            <BaseButton variant="outline" size="lg" :to="localePath('/products')">{{ $t('use_cases.explore_products') }}</BaseButton>
          </div>
        </div>
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

const { isDark } = useDarkMode()
const { withBase } = useBaseUrl()

const heroMediaStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'right center'
  const opacity = isDark.value ? '0.52' : '0.22'
  return `background-image: url('${withBase(`/images/use-cases/${useCase.value?.slug}.png`)}'); background-size: cover; background-position: ${position}; opacity: ${opacity};`
})

const heroOverlayStyle = computed(() => {
  const direction = locale.value === 'fa' ? '270deg' : '90deg'
  if (isDark.value) {
    return `background:
      linear-gradient(${direction}, rgba(10,15,26,0.90) 0%, rgba(10,15,26,0.56) 52%, rgba(10,15,26,0.16) 100%),
      linear-gradient(135deg, color-mix(in srgb, var(--bg-page) 76%, transparent) 0%, color-mix(in srgb, var(--bg-page) 60%, transparent) 58%, color-mix(in srgb, var(--bg-page) 80%, var(--accent) 20%) 100%);`
  }
  return `background:
    linear-gradient(${direction}, color-mix(in srgb, var(--bg-page) 82%, transparent) 0%, color-mix(in srgb, var(--bg-page) 45%, transparent) 55%, transparent 100%),
    linear-gradient(135deg, color-mix(in srgb, var(--bg-page) 60%, transparent) 0%, color-mix(in srgb, var(--bg-page) 30%, transparent) 60%, transparent 100%);`
})

</script>
