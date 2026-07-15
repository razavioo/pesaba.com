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
            :title="p.title || ''"
            :slug="p.slug || ''"
            :href="localePath(`/products/${category}/${p.slug}`)"
            :description="publicDescription(p)"
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
const { publicDescription } = useProductCopy()
const category = route.params.category as string

const DESCS: Record<string, { fa: string; en: string }> = {
  'data-diodes': { fa: 'انتقال یک‌طرفه اعمال‌شده در سخت‌افزار؛ سرویس‌های پشتیبانی‌شده و معماری جداسازی در هر مدل متفاوت است.', en: 'Hardware-enforced one-way data transfer; supported services and isolation architecture vary by model.' },
  'network-encryption': { fa: 'رمزنگاری شبکه AES-256 مبتنی بر FPGA؛ رابط‌ها و گزینه‌های مدیریت کلید در هر مدل متفاوت است.', en: 'FPGA-based AES-256 network encryption; interfaces and key-management options vary by model.' },
  'cellular-monitoring': { fa: 'پایش و تحلیل شبکه‌های سلولی 2G، 3G، LTE و TD-LTE.', en: 'Monitoring and analysis for 2G, 3G, LTE, and TD-LTE cellular networks.' },
  'network-switching-filtering': { fa: 'سوئیچینگ، TAP، تحلیل و فیلترکردن ترافیک شبکه با پردازش مبتنی بر FPGA.', en: 'FPGA-based network switching, traffic tapping, analysis, and packet filtering.' },
  'telecom-transmission': { fa: 'انتقال اترنت روی SDH/STM1 و E1.', en: 'Ethernet-over-SDH, Ethernet-over-E1, and multiplexing interfaces.' },
  'bio-monitoring': { fa: 'پایش پیوسته سمیت آب با تحلیل رفتاری زیستی و هشدار بلادرنگ.', en: 'Continuous water-toxicity monitoring using biological behavioural analysis and real-time alerting.' },
}

const TAGS: Record<string, { fa: string; en: string }> = {
  'data-diodes': { fa: 'انتقال یک‌طرفه', en: 'One-Way Transfer' },
  'network-encryption': { fa: 'رمزنگاری شبکه', en: 'Network Encryption' },
  'cellular-monitoring': { fa: 'پایش شبکه', en: 'Network Monitoring' },
  'network-switching-filtering': { fa: 'پردازش ترافیک شبکه', en: 'Network Traffic Processing' },
  'telecom-transmission': { fa: 'انتقال مخابراتی', en: 'Telecom Transport' },
  'bio-monitoring': { fa: 'پایش زیستی آب', en: 'Water Biomonitoring' },
}

if (!Object.hasOwn(DESCS, category)) {
  throw createError({ statusCode: 404, statusMessage: 'Product category not found' })
}

const { list } = usePublicCms()
const { data: products } = await useAsyncData(`category-${category}-${locale.value}`, async () =>
  (await list('product', locale.value as 'fa' | 'en')).filter((product: any) => product.category === category).sort((a: any, b: any) => (a.priority ?? a.sortOrder ?? 999) - (b.priority ?? b.sortOrder ?? 999)), { watch: [locale] },
)

const categoryDesc = computed(() => locale.value === 'fa' ? DESCS[category]?.fa || '' : DESCS[category]?.en || '')
const categoryTag = computed(() => locale.value === 'fa' ? TAGS[category]?.fa || '' : TAGS[category]?.en || '')
const categoryTitle = computed(() => t(`products.categories.${category}`))
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://pesaba.com').replace(/\/+$/, '')
const socialImage = computed(() => `${siteUrl}/og/category/${category}.${locale.value}.png`)

useSeoMeta({
  title: computed(() => `${categoryTitle.value} | Pesaba`),
  description: categoryDesc,
  ogTitle: computed(() => `${categoryTitle.value} | Pesaba`),
  ogDescription: categoryDesc,
  ogImage: socialImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  twitterTitle: computed(() => `${categoryTitle.value} | Pesaba`),
  twitterDescription: categoryDesc,
  twitterImage: socialImage,
  twitterCard: 'summary_large_image',
})

function productTags(_product: unknown) {
  return [categoryTag.value]
}

emitBreadcrumbs([
  { name: t('common.home'), url: `/${locale.value}` },
  { name: t('products.title'), url: `/${locale.value}/products` },
  { name: categoryTitle.value, url: `/${locale.value}/products/${category}` },
])
</script>
