<template>
  <div>
    <section class="page-hero relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.045) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

      <div class="container-wide section-hero relative z-10 grid gap-12 py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.8fr)] lg:items-center lg:py-28">
        <div class="max-w-3xl">
          <div class="section-label mb-5" style="color:#AAC5D0">{{ locale === 'fa' ? 'محصولات' : 'Products' }}</div>
          <h1 class="mb-5 text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[1.08] text-[#FCFCFD]">
            {{ $t('products.title') }}
          </h1>
          <p class="max-w-2xl text-lg leading-relaxed text-[#D7E6EC]">
            {{ $t('products.index_sub') }}
          </p>
        </div>
        <div class="relative hidden lg:block">
          <div class="absolute -end-8 -top-8 text-[#AAC5D0]/30" aria-hidden="true">
            <svg width="198" height="94" viewBox="0 0 198 94" fill="currentColor">
              <rect v-for="(_, index) in 32" :key="index" :x="(index % 8) * 26" :y="Math.floor(index / 8) * 26" width="16" height="16" rx="1" />
            </svg>
          </div>
          <NuxtImg src="/photos/g200/rackmount.webp" alt="Pesaba products" class="relative z-10 ms-auto max-h-[420px] w-full object-contain" loading="eager" />
        </div>
      </div>

      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="sticky top-[5.125rem] z-20 border-b border-[var(--border)] bg-white shadow-[0_12px_30px_rgba(9,53,68,0.08)] md:top-[6.25rem]">
      <div class="container-site">
        <div class="flex gap-2 overflow-x-auto py-3">
          <a
            v-for="cat in categories"
            :key="cat.key"
            :href="`#${cat.key}`"
            class="whitespace-nowrap border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
          >
            {{ $t(`products.categories.${cat.key}`) }}
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site space-y-14">
        <div v-for="cat in categories" :id="cat.key" :key="cat.key" class="scroll-mt-[10.5rem]">
          <div class="mb-6 flex items-end justify-between gap-6 border-b border-[var(--border)] pb-5">
            <div>
              <div class="label-meta mb-2 text-sm md:text-base">{{ cat.products.length }} {{ locale === 'fa' ? 'محصول' : 'products' }}</div>
              <h2 class="text-3xl font-medium text-[var(--text-primary)]">{{ $t(`products.categories.${cat.key}`) }}</h2>
            </div>
            <NuxtLink :to="localePath(`/products/${cat.key}`)" class="text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]">
              {{ $t('common.view_all') }}
            </NuxtLink>
          </div>

          <div :class="['grid gap-4 sm:grid-cols-2 lg:grid-cols-3']">
            <ProductCard
              v-for="p in cat.products"
              :key="p._path"
              :title="p.title || ''"
              :slug="p.slug || ''"
              :href="localePath(`/products/${cat.key}/${p.slug}`)"
              :description="publicDescription(p)"
              :category-label="$t(`products.categories.${cat.key}`)"
              :specs="p.specs?.slice(0, 2)"
              :image="p.photos?.[0] || p.images?.[0]"
              :fallback-image="productFallbackImage(p.category)"
              loading="lazy"
              :tags="productTags(p)"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { withBase } = useBaseUrl()
const { publicDescription } = useProductCopy()

useHead({
  link: [
    { rel: 'preload', as: 'image', href: withBase('/photos/g200/rackmount.webp') },
  ],
})

const productsDescription = computed(() => locale.value === 'fa'
  ? 'محصولات پرتو ارتباط صبا در حوزه دیتا دیود، رمزنگاری شبکه، پایش، سوئیچینگ، انتقال مخابراتی و پایش زیستی آب.'
  : 'Explore Pesaba data diodes, network encryption, monitoring, switching, telecom transmission, and water-biomonitoring products.')

useSeoMeta({
  title: `${t('products.title')} | Pesaba`,
  ogTitle: `${t('products.title')} | Pesaba`,
  description: productsDescription,
  ogDescription: productsDescription,
})

const CATEGORY_KEYS = ['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring']
const { data: allProducts } = await useAsyncData('all-products', () => queryContent('products').find())

const CATEGORY_TAGS: Record<string, { fa: string[]; en: string[] }> = {
  'data-diodes': { fa: ['انتقال یک‌طرفه', 'جداسازی سخت‌افزاری'], en: ['One-way transfer', 'Hardware isolation'] },
  'network-encryption': { fa: ['رمزنگاری شبکه', 'FPGA'], en: ['Network encryption', 'FPGA'] },
  'cellular-monitoring': { fa: ['پایش شبکه'], en: ['Network monitoring'] },
  'network-switching-filtering': { fa: ['ترافیک شبکه', 'FPGA'], en: ['Network traffic', 'FPGA'] },
  'telecom-transmission': { fa: ['انتقال مخابراتی'], en: ['Telecom transport'] },
  'bio-monitoring': { fa: ['پایش زیستی آب'], en: ['Water biomonitoring'] },
}

function productTags(product: unknown) {
  if (!product || typeof product !== 'object' || !('category' in product) || typeof product.category !== 'string') return []
  return CATEGORY_TAGS[product.category]?.[locale.value === 'fa' ? 'fa' : 'en'] || []
}

function productFallbackImage(category: unknown) {
  const fallbacks: Record<string, string> = {
    'telecom-transmission': '/photos/sdx/photo-1.webp',
    'cellular-monitoring': '/photos/capella/photo-1.webp',
    'network-switching-filtering': '/photos/emx-9/photo-1.webp',
    'network-encryption': '/photos/emx-6/photo-1.webp',
    'data-diodes': '/photos/g200/photo-1.webp',
    'bio-monitoring': '/photos/orazan/photo-1.webp',
  }
  return typeof category === 'string' ? fallbacks[category] || '/photos/g200/photo-1.webp' : '/photos/g200/photo-1.webp'
}

const categories = computed(() =>
  CATEGORY_KEYS.map(key => ({
    key,
    products: (allProducts.value || []).filter(p => p.category === key && (locale.value === 'fa' ? p.locale === 'fa' : !p.locale)),
  })).filter(cat => cat.products.length),
)
</script>
