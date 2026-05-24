<template>
  <div v-if="industry">
    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <div class="absolute inset-0" :style="heroMediaStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" :style="heroOverlayStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(148,161,189,0.05) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />
      <div class="absolute start-0 top-0 w-[400px] h-[400px] rounded-full pointer-events-none" style="background: radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 65%); filter: blur(60px);" aria-hidden="true" />

      <div class="container-site relative py-16 lg:py-24">
        <nav class="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8" aria-label="breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-[var(--text-secondary)] transition-colors">{{ $t('common.home') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink :to="localePath('/industries')" class="hover:text-[var(--text-secondary)] transition-colors">{{ $t('nav.industries') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <span class="text-[var(--text-secondary)]">{{ industry.title }}</span>
        </nav>

        <div class="max-w-2xl">
          <BaseBadge color="photon" class="mb-5">{{ $t('nav.industries') }}</BaseBadge>
          <h1
            class="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-5 leading-tight"
            style="letter-spacing: -0.025em;"
          >
            {{ industry.title }}
          </h1>
          <p v-if="industry.description" class="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xl">
            {{ industry.description }}
          </p>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" size="lg" :to="localePath('/company/contact')">{{ $t('industries.talk_specialist') }}</BaseButton>
            <BaseButton variant="outline" size="lg" :to="localePath('/products')">{{ $t('use_cases.explore_products') }}</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Prose: Challenge + Solution -->
    <section class="container-site py-16">
      <div class="max-w-3xl">
        <div class="prose-custom"><ContentRenderer :value="industry" /></div>
      </div>
    </section>

    <!-- Recommended Products -->
    <section v-if="industryProducts.length" class="border-t border-[var(--border)]">
      <div class="container-site py-16">
        <div class="flex items-center gap-3 mb-10">
          <div class="h-6 w-0.5 bg-photon-500 rounded-full" aria-hidden="true" />
          <h2 class="text-xl font-bold text-[var(--text-primary)]">
            {{ $t('industries.related_products') }}
          </h2>
          <span class="font-mono text-xs text-[var(--text-muted)] tabular-nums">{{ industryProducts.length }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ProductCard
            v-for="product in industryProducts"
            :key="product.slug"
            :title="product.title"
            :slug="product.slug"
            :href="localePath(`/products/${product.category}/${product.slug}`)"
            :description="product.description"
            :category-label="product.category_label"
            :specs="product.specs?.slice(0, 3)"
            :image="product.photos?.[0] || product.images?.[0]"
          />
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section v-if="industry.faqs?.length" class="border-t border-[var(--border)]">
      <div class="container-site py-16">
        <div class="flex items-center gap-3 mb-8">
          <div class="h-6 w-0.5 bg-photon-500 rounded-full" aria-hidden="true" />
          <h2 class="text-xl font-bold text-[var(--text-primary)]">
            {{ $t('industries.faq_title') }}
          </h2>
        </div>
        <div class="max-w-3xl">
          <FAQItem
            v-for="(faq, i) in industry.faqs"
            :key="i"
            :id="`faq-${i}`"
            :question="faq.q"
            :answer="faq.a"
          />
        </div>
      </div>
    </section>

    <CTAStrip
      :headline="$t('industries.cta_headline')"
      :primary-label="$t('industries.cta_primary')"
      :primary-href="localePath('/company/contact')"
    />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { emitBreadcrumbs } = useSchemaOrg()

const { data: industry } = await useAsyncData(`industry-${route.params.slug}-${locale.value}`, () =>
  queryContent('industries').where({ slug: route.params.slug as string, locale: locale.value }).findOne()
    .catch(() => queryContent('industries').where({ slug: route.params.slug as string }).findOne())
)

const { data: allProducts } = await useAsyncData(`products-${locale.value}`, () =>
  queryContent('products').where({ locale: locale.value }).find()
)

const industryProducts = computed(() => {
  if (!industry.value?.products || !allProducts.value) return []
  return ((industry.value.products as string[])
    .map(id => allProducts.value!.find(p => p._path?.endsWith(id)))
    .filter(Boolean) as typeof allProducts.value)
    .slice(0, 3)
})

if (industry.value) {
  useSeoMeta({
    title: `${industry.value.title} | Pesaba`,
    description: industry.value.description,
    ogImage: `https://pesaba.com/images/industries/${industry.value.slug}.png`,
    twitterCard: 'summary_large_image',
  })
  emitBreadcrumbs([
    { name: t('nav.industries'), url: `/${locale.value}/industries` },
    { name: industry.value.title, url: `/${locale.value}/industries/${industry.value.slug}` },
  ])
}

const { isDark } = useDarkMode()

const heroMediaStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'center'
  const opacity = isDark.value ? '0.58' : '0.25'
  return `background-image: url('/images/industries/${industry.value?.slug}.png'); background-size: cover; background-position: ${position}; opacity: ${opacity};`
})

const heroOverlayStyle = computed(() => {
  const direction = locale.value === 'fa' ? '270deg' : '90deg'
  if (isDark.value) {
    return `background:
      linear-gradient(${direction}, rgba(10,15,26,0.88) 0%, rgba(10,15,26,0.52) 48%, rgba(10,15,26,0.12) 100%),
      linear-gradient(135deg, color-mix(in srgb, var(--bg-page) 74%, transparent) 0%, color-mix(in srgb, var(--bg-page) 56%, transparent) 58%, color-mix(in srgb, var(--bg-page) 80%, var(--accent) 20%) 100%);`
  }
  return `background:
    linear-gradient(${direction}, color-mix(in srgb, var(--bg-page) 82%, transparent) 0%, color-mix(in srgb, var(--bg-page) 45%, transparent) 55%, transparent 100%),
    linear-gradient(135deg, color-mix(in srgb, var(--bg-page) 60%, transparent) 0%, color-mix(in srgb, var(--bg-page) 30%, transparent) 60%, transparent 100%);`
})
</script>
