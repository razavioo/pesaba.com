<template>
  <div>
    <section class="page-hero relative" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <div class="absolute inset-0 opacity-20" :style="heroImgStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.06) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

      <div class="container-site section-hero relative z-10 py-16 lg:py-24">
        <div class="max-w-3xl">
          <div class="section-label mb-5" style="color:#AAC5D0">{{ $t('nav.products') }}</div>
          <h1 class="mb-4 text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">
            {{ $t('products.title') }}
          </h1>
          <p class="text-lg leading-relaxed text-white/70">
            {{ $t('products.index_sub') }}
          </p>
        </div>
      </div>

      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="sticky top-16 z-20 border-b border-[var(--border)] bg-[var(--bg-page)]/95 backdrop-blur-xl">
      <div class="container-site">
        <div class="flex gap-2 overflow-x-auto py-3">
          <a
            v-for="cat in categories"
            :key="cat.key"
            :href="`#${cat.key}`"
            class="whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] hover:text-[var(--text-primary)]"
          >
            {{ $t(`products.categories.${cat.key}`) }}
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site space-y-14">
        <div v-for="cat in categories" :key="cat.key" :id="cat.key" class="scroll-mt-32">
          <div class="mb-6 flex items-end justify-between gap-6 border-b border-[var(--border)] pb-4">
            <div>
              <div class="label-meta mb-2">{{ cat.products.length }} {{ locale === 'fa' ? 'محصول' : 'products' }}</div>
              <h2 class="text-2xl font-semibold text-[var(--text-primary)]">{{ $t(`products.categories.${cat.key}`) }}</h2>
            </div>
            <NuxtLink :to="localePath(`/products/${cat.key}`)" class="text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]">
              {{ $t('common.view_all') }}
            </NuxtLink>
          </div>

          <div :class="['grid gap-5', cat.products.length === 1 ? 'max-w-md' : 'md:grid-cols-2']">
            <ProductCard
              v-for="p in cat.products"
              :key="p._path"
              :title="p.title"
              :slug="p.slug"
              :href="localePath(`/products/${cat.key}/${p.slug}`)"
              :description="p.card_summary || p.description"
              :category-label="$t(`products.categories.${cat.key}`)"
              :specs="p.specs?.slice(0, 2)"
              :image="p.photos?.[0] || p.images?.[0]"
              :tags="productTags(p)"
              :has-datasheet="hasDatasheet(p)"
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

useHead({
  link: [
    { rel: 'preload', as: 'image', href: withBase('/images/products/products-hero.png') },
  ],
})

const heroImgStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'center'
  return `background-image: url('${withBase('/images/products/products-hero.png')}'); background-size: cover; background-position: ${position};`
})

useSeoMeta({
  title: `${t('products.title')} | Pesaba`,
  ogTitle: `${t('products.title')} | Pesaba`,
  description: 'FPGA-native data diodes, network encryptors, cellular monitoring tools and telecom transmission hardware made in Iran.',
  ogDescription: 'FPGA-native data diodes, network encryptors, cellular monitoring tools and telecom transmission hardware made in Iran.',
})

const CATEGORY_KEYS = ['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring']
const { data: allProducts } = await useAsyncData('all-products', () => queryContent('products').find())

interface ProductCardMeta {
  category: string
  schematic_pdf?: string
  schematic_pdfs?: string[]
}

const CATEGORY_TAGS: Record<string, { fa: string[]; en: string[] }> = {
  'data-diodes': { fa: ['یک‌طرفه', 'مرز OT', 'بدون سیستم‌عامل'], en: ['One-way', 'OT boundary', 'OS-less'] },
  'network-encryption': { fa: ['AES-256', 'FPGA', 'لینک امن'], en: ['AES-256', 'FPGA', 'Secure links'] },
  'cellular-monitoring': { fa: ['2G–5G', 'QoS', 'میدانی'], en: ['2G–5G', 'QoS', 'Field probes'] },
  'network-switching-filtering': { fa: ['L2/L3', 'تفکیک شبکه', 'صنعتی'], en: ['L2/L3', 'Segmentation', 'Industrial'] },
  'telecom-transmission': { fa: ['SDH/E1', 'اپراتوری', 'انتقال'], en: ['SDH/E1', 'Carrier', 'Transport'] },
  'bio-monitoring': { fa: ['پایش آب', 'بلادرنگ', 'هشدار'], en: ['Water quality', 'Realtime', 'Alerting'] },
}

function productTags(product: ProductCardMeta) {
  return CATEGORY_TAGS[product.category]?.[locale.value === 'fa' ? 'fa' : 'en'] || []
}

function hasDatasheet(product: ProductCardMeta) {
  return Boolean(product.schematic_pdf || product.schematic_pdfs?.length)
}

const categories = computed(() =>
  CATEGORY_KEYS.map(key => ({
    key,
    products: (allProducts.value || []).filter(p => p.category === key && (locale.value === 'fa' ? p.locale === 'fa' : !p.locale)),
  })).filter(cat => cat.products.length),
)
</script>
