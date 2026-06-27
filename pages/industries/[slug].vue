<template>
  <div v-if="industry">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-[#093544]" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <div class="absolute inset-0 opacity-30" :style="heroMediaStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(90deg, rgba(9,53,68,0.88) 0%, rgba(9,53,68,0.45) 55%, transparent 100%);" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.05) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

      <div class="container-site relative py-16 lg:py-24">
        <nav class="flex items-center gap-2 text-xs text-white/40 mb-8" aria-label="breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-white/70 transition-colors">{{ $t('common.home') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink :to="localePath('/industries')" class="hover:text-white/70 transition-colors">{{ $t('nav.industries') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <span class="text-white/60">{{ industry.title }}</span>
        </nav>

        <div class="max-w-2xl">
          <div class="mb-5 inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] border border-[#AAC5D0]/30 text-[#AAC5D0]">{{ $t('nav.industries') }}</div>
          <h1
            class="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight"
            style="letter-spacing: -0.025em;"
          >
            {{ industry.title }}
          </h1>
          <p v-if="industry.description" class="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
            {{ industry.description }}
          </p>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" size="lg" :to="localePath('/company/contact')">{{ $t('industries.talk_specialist') }}</BaseButton>
            <BaseButton variant="outline" size="lg" :to="localePath('/products')">{{ $t('use_cases.explore_products') }}</BaseButton>
          </div>
        </div>
      </div>

      <!-- SVG wedge -->
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <!-- In-page nav — Advenica pattern -->
    <div class="anchor-nav">
      <div class="container-site">
        <div class="flex gap-2 overflow-x-auto py-3">
          <a href="#products">{{ locale === 'fa' ? 'محصولات' : 'Products' }}</a>
          <a href="#use-cases">{{ locale === 'fa' ? 'کاربردها' : 'Use Cases' }}</a>
          <a href="#faq">{{ locale === 'fa' ? 'پرسش‌ها' : 'FAQ' }}</a>
          <a href="#contact">{{ locale === 'fa' ? 'تماس' : 'Contact' }}</a>
        </div>
      </div>
    </div>

    <!-- Prose: Challenge + Solution -->
    <section class="container-site py-16">
      <div class="max-w-3xl">
        <div class="prose-custom"><ContentRenderer :value="industry" /></div>
      </div>
    </section>

    <!-- Recommended Products -->
    <section id="products" v-if="industryProducts.length" class="border-t border-[var(--border)]">
      <div class="container-site py-16">
        <div class="mb-10">
          <h2 class="text-2xl font-bold text-[var(--text-primary)]">
            {{ $t('industries.related_products') }}
          </h2>
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

    <!-- Use Cases -->
    <section id="use-cases" v-if="latestArticles.length" class="border-t border-[var(--border)]">
      <div class="container-site py-16">
        <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-8">
          {{ locale === 'fa' ? 'کاربردهای مرتبط' : 'Related Use Cases' }}
        </h2>
        <div class="grid gap-5 sm:grid-cols-2">
          <NuxtLink
            v-for="article in latestArticles"
            :key="article._path"
            :to="localePath(`/blog/${article.slug}`)"
            class="card-halo group overflow-hidden"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-[var(--bg-elevated)]">
              <NuxtImg
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                class="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <IconPhoton class="h-12 w-12 text-[#AAC5D0]/40" />
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                {{ article.title }}
              </h3>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2 mb-3">{{ article.description }}</p>
              <span class="text-sm font-medium text-[var(--accent)]">{{ $t('blog.read_more') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" v-if="industry.faqs?.length" class="border-t border-[var(--border)]">
      <div class="container-site py-16">
        <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-8">
          {{ $t('industries.faq_title') }}
        </h2>
        <div class="max-w-3xl">
          <FAQItem
            v-for="(faq, i) in industry.faqs"
            :key="i"
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

const { data: latestArticles } = await useAsyncData(`articles-${locale.value}-${route.params.slug}`, () =>
  queryContent('articles').where({ locale: locale.value }).sort({ date: -1 }).limit(2).find()
)

const industryProducts = computed(() => {
  if (!industry.value?.products || !allProducts.value) return []
  return ((industry.value.products as string[])
    .map(id => allProducts.value!.find(p => p._path?.endsWith(id)))
    .filter(Boolean) as typeof allProducts.value)
    .slice(0, 3)
})

if (industry.value) {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://pesaba.com').replace(/\/$/, '')
  useSeoMeta({
    title: `${industry.value.title} | Pesaba`,
    description: industry.value.description,
    ogImage: `${siteUrl}/images/industries/${industry.value.slug}.png`,
    twitterCard: 'summary_large_image',
  })
  emitBreadcrumbs([
    { name: t('nav.industries'), url: `/${locale.value}/industries` },
    { name: industry.value.title, url: `/${locale.value}/industries/${industry.value.slug}` },
  ])
}

const { withBase } = useBaseUrl()

const heroMediaStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'center'
  return `background-image: url('${withBase(`/images/industries/${industry.value?.slug}.png`)}'); background-size: cover; background-position: ${position};`
})
</script>
