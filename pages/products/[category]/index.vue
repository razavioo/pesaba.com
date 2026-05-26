<template>
  <div>
    <!-- Category hero -->
    <section
      class="relative overflow-hidden border-b border-ink-700/30"
      :style="isDark ? 'background: linear-gradient(160deg, #0A0F1A 0%, #060A12 100%)' : 'background: var(--bg-elevated)'"
    >
      <!-- Dot grid -->
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(148,161,189,0.06) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />
      <!-- Glow -->
      <div class="absolute end-0 top-0 w-[500px] h-[500px] rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 65%); filter: blur(60px);" aria-hidden="true" />

      <div class="container-site relative py-16 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <!-- Left: text -->
          <div>
            <nav class="flex items-center gap-2 text-xs text-ink-500 mb-6" :aria-label="$t('common.breadcrumb')">
              <NuxtLink :to="localePath('/products')" class="hover:text-ink-300 transition-colors">{{ $t('products.title') }}</NuxtLink>
              <span>/</span>
              <span class="text-ink-300">{{ $t(`products.categories.${category}`) }}</span>
            </nav>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-bg)] text-[10px] font-mono text-[var(--accent)] uppercase tracking-widest mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              {{ categoryTag }}
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-ink-100 mb-5 leading-tight" style="letter-spacing: -0.025em;">
              {{ $t(`products.categories.${category}`) }}
            </h1>
            <p class="text-ink-400 text-lg leading-relaxed max-w-xl">{{ categoryDesc }}</p>
          </div>

          <!-- Right: product grid preview -->
          <div v-if="heroSlugs.length" class="relative hidden lg:flex items-center justify-end gap-4">
            <div
              v-for="(slug, i) in heroSlugs"
              :key="slug"
              :class="[
                'relative rounded-xl border border-ink-700/50 flex items-center justify-center overflow-hidden transition-transform',
                i === 1 ? 'w-44 h-44 z-10 shadow-[0_0_0_1px_rgba(14,165,233,0.15),0_16px_48px_rgba(14,165,233,0.07)]' : 'w-32 h-32 opacity-60',
                i === 0 ? '-translate-y-4' : '',
                i === 2 ? 'translate-y-4' : '',
              ]"
              :style="isDark ? 'background: linear-gradient(145deg, #0E1422 0%, #08101C 100%)' : 'background: var(--bg-page)'"
            >
              <NuxtImg
                :src="$withBase(heroPhotoSrc(slug))"
                :alt="slug"
                class="w-full h-full object-contain p-4 drop-shadow-[0_4px_16px_rgba(14,165,233,0.10)]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product grid -->
    <section class="section">
      <div class="container-site">
        <div v-if="products?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProductCard v-for="p in products" :key="p._path" :title="p.title" :slug="p.slug"
            :href="localePath(`/products/${category}/${p.slug}`)" :description="p.description"
            :category-label="$t(`products.categories.${category}`)" :specs="p.specs?.slice(0, 3)"
            :image="p.photos?.[0] || p.images?.[0]" />
        </div>
        <p v-else class="text-ink-500">{{ $t('common.no_results') }}</p>
      </div>
    </section>

    <CTAStrip :headline="$t('products.category_cta')" :primary-label="$t('products.request_quote')" :primary-href="localePath('/company/contact')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const { isDark } = useDarkMode()
const localePath = useLocalePath()
const route = useRoute()
const { emitBreadcrumbs } = useSchemaOrg()
const category = route.params.category as string

const { data: products } = await useAsyncData(`category-${category}-${locale.value}`, async () => {
  const all = await queryContent('products')
    .where({ category, active: { $ne: false } })
    .find()

  return all
    .filter(p => locale.value === 'fa' ? p.locale === 'fa' : !p.locale)
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
})

const DESCS: Record<string, { fa: string; en: string }> = {
  'data-diodes': { fa: 'انتقال یک‌طرفه‌ی فیزیکی داده با حذف مسیر برگشتی — بدون استثنا.', en: 'Hardware-enforced one-way data flow. No software, no exceptions.' },
  'network-encryption': { fa: 'رمزنگاری AES-256 مبتنی بر FPGA — بدون سیستم‌عامل.', en: 'AES-256 FPGA-native encryption. OS-less. No software attack surface.' },
  'cellular-monitoring': { fa: 'پایش KPI شبکه‌های سلولی از 2G تا 5G NR.', en: 'Full-stack cellular KPI measurement from drive-test to cloud aggregation.' },
  'network-switching-filtering': { fa: 'سوئیچینگ و فیلترینگ عمیق لایه ۲/۳ مبتنی بر FPGA.', en: 'FPGA-native Layer-2/3 switching and deep-packet filtering.' },
  'telecom-transmission': { fa: 'انتقال اترنت روی SDH/STM1 و E1.', en: 'Ethernet-over-SDH, Ethernet-over-E1, and multiplexing interfaces.' },
  'bio-monitoring': { fa: 'پایش زیست‌محیطی و کیفیت آب با سنسورهای هوشمند.', en: 'Continuous water toxicity and biomonitoring with real-time alerting.' },
}

const TAGS: Record<string, { fa: string; en: string }> = {
  'data-diodes': { fa: 'امنیت سخت‌افزاری', en: 'Hardware Security' },
  'network-encryption': { fa: 'سخت‌افزاری · AES-256', en: 'FPGA · AES-256' },
  'cellular-monitoring': { fa: 'مخابراتی · 2G – 5G NR', en: '2G – 5G NR' },
  'network-switching-filtering': { fa: 'سوئیچینگ لایه ۲ و ۳', en: 'Layer 2 / 3' },
  'telecom-transmission': { fa: 'انتقال · SDH / E1', en: 'SDH · E1' },
  'bio-monitoring': { fa: 'پایش اینترنت اشیا', en: 'IoT · Water Quality' },
}

const HERO_SLUGS: Record<string, string[]> = {
  'data-diodes': ['a10', 'k200', 'g200'],
  'network-encryption': ['emx-6', 'umx-6', 'emx-8'],
  'cellular-monitoring': ['capella', 'auriga'],
  'network-switching-filtering': ['emx-9', 'emx-5', 'emx-4'],
  'telecom-transmission': ['sdx-1', 'sdx', 'emx-10'],
  'bio-monitoring': ['orazan'],
}

const HERO_PHOTOS: Record<string, string> = {
  'a10': '/photos/a10/photo-1.webp',
  'a100': '/photos/a100/photo-1.webp',
  'g200': '/photos/g200/photo-1.webp',
  'g300': '/photos/g300/photo-1.webp',
  'k200': '/photos/k200/photo-1.webp',
  'emx-6': '/photos/emx-6/photo-1.webp',
  'umx-6': '/photos/umx-6/photo-1.webp',
  'emx-8': '/photos/emx-8/photo-1.webp',
  'emx-9': '/photos/emx-9/photo-1.webp',
  'sdx-1': '/photos/sdx-1/photo-1.webp',
  'sdx': '/photos/sdx/photo-1.webp',
  'emx-10': '/photos/emx-10/photo-1.webp',
  'capella': '/photos/capella/photo-1.webp',
  'orazan': '/photos/orazan/photo-1.webp',
}

const heroPhotoSrc = (slug: string) => HERO_PHOTOS[slug] || '/placeholder-product.svg'

const categoryDesc = computed(() => (DESCS[category]?.[locale.value === 'fa' ? 'fa' : 'en']) || '')
const categoryTag = computed(() => (TAGS[category]?.[locale.value === 'fa' ? 'fa' : 'en']) || '')
const heroSlugs = computed(() => (HERO_SLUGS[category] || []).slice(0, 3))

useSeoMeta({ title: `${t(`products.categories.${category}`)} | Pesaba`, ogTitle: `${t(`products.categories.${category}`)} | Pesaba`, description: categoryDesc.value, ogDescription: categoryDesc.value })
emitBreadcrumbs([{ name: t('products.title'), url: `/${locale.value}/products` }, { name: t(`products.categories.${category}`), url: `/${locale.value}/products/${category}` }])
</script>
