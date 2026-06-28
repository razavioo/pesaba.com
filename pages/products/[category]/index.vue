<template>
  <div>
    <!-- Hero -->
    <section class="page-hero bg-[#093544]">
      <div class="container-site relative z-10 py-16 lg:py-24">
        <nav class="mb-8 flex items-center gap-2 text-xs text-white/40" :aria-label="$t('common.breadcrumb')">
          <NuxtLink :to="localePath('/')" class="hover:text-white/70 transition-colors">{{ $t('common.home') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="localePath('/products')" class="hover:text-white/70 transition-colors">{{ $t('products.title') }}</NuxtLink>
          <span>/</span>
          <span class="text-white/60">{{ $t(`products.categories.${category}`) }}</span>
        </nav>
        <div class="max-w-3xl">
          <div class="section-label mb-5" style="color:#AAC5D0">{{ categoryTag }}</div>
          <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight" style="letter-spacing: -0.02em;">
            {{ $t(`products.categories.${category}`) }}
          </h1>
          <p class="text-lg text-white/70 leading-relaxed">{{ categoryDesc }}</p>
        </div>
      </div>
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <!-- Product grid -->
    <section class="section">
      <div class="container-site">
        <div v-if="products?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            v-for="p in products"
            :key="p._path"
            :title="p.title"
            :slug="p.slug"
            :href="localePath(`/products/${category}/${p.slug}`)"
            :description="p.card_summary || p.description"
            :specs="p.specs?.slice(0, 3)"
            :image="p.photos?.[0] || p.images?.[0]"
            :tags="productTags(p)"
          />
        </div>
        <p v-else class="text-[var(--text-muted)]">{{ $t('common.no_results') }}</p>
      </div>
    </section>

    <CTAStrip
      :headline="$t('products.category_cta')"
      :sub="$t('contact.phone_first_sub')"
      :primary-label="$t('contact.call_sales_now')"
      :primary-href="salesPhoneHref"
      :secondary-label="$t('products.request_quote')"
      :secondary-href="`${localePath('/company/contact')}?dept=sales`"
    />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { salesPhoneHref } = useContactInfo()
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

const categoryDesc = computed(() => locale.value === 'fa' ? DESCS[category]?.fa || '' : DESCS[category]?.en || '')
const categoryTag = computed(() => locale.value === 'fa' ? TAGS[category]?.fa || '' : TAGS[category]?.en || '')

function productTags(_product: { category: string }) {
  return [categoryTag.value]
}

if (products.value?.length) {
  emitBreadcrumbs([
    { name: t('common.home'), url: `/${locale.value}` },
    { name: 'Products', url: `/${locale.value}/products` },
    { name: t(`products.categories.${category}`), url: `/${locale.value}/products/${category}` },
  ])
}
</script>
