<template>
  <div v-if="product">
    <section class="page-hero overflow-hidden pb-0">
      <div class="container-site pb-10 pt-32 md:pt-40 lg:pb-14">
        <nav class="mb-7 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 text-xs text-white/40" :aria-label="$t('common.breadcrumb')">
          <NuxtLink :to="localePath('/')" class="hover:text-white/70 transition-colors">{{ $t('common.home') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="localePath('/products')" class="hover:text-white/70 transition-colors">{{ $t('products.title') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="localePath(`/products/${product.category}`)" class="hover:text-white/70 transition-colors">{{ $t(`products.categories.${product.category}`) }}</NuxtLink>
          <span>/</span>
          <span class="text-white/60">{{ product.title }}</span>
        </nav>
        <div class="product-hero-panel relative bg-[#E6EEF1]">
          <div class="grid min-w-0 items-stretch lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]">
            <!-- Text column (left — Advenica order) -->
            <div class="min-w-0 p-6 md:p-10 lg:p-12">
              <div class="max-w-xl">
                <div class="label-accent mb-5">{{ $t(`products.categories.${product.category}`) }}</div>
                <div class="mb-4 flex min-w-0 flex-wrap items-center gap-4">
                  <h1 class="!text-[var(--text-primary)] max-w-full text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[4.75rem]">{{ product.title }}</h1>
                  <img v-if="product.logo" :src="$withBase(product.logo)" :alt="`${product.title} logo`" class="h-10 w-auto opacity-90" loading="lazy">
                </div>
                <p class="product-hero-copy mb-7 max-w-xl text-base leading-relaxed md:text-lg">{{ product.card_summary || product.description }}</p>

                <div id="quote" class="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <BaseButton variant="primary" size="lg" :href="salesPhoneHref">
                    {{ $t('contact.call_sales') }}
                  </BaseButton>
                  <BaseButton variant="outline" size="lg" :to="quoteHref">
                    {{ $t('products.request_quote') }}
                  </BaseButton>
                  <BaseButton v-if="primaryDatasheetHref" variant="outline" size="lg" :href="primaryDatasheetHref" target="_blank" rel="noopener">
                    {{ $t('products.download_pdf') }}
                  </BaseButton>
                </div>
                <p class="product-hero-note max-w-xl text-xs leading-relaxed">
                  {{ productDatasheets.length ? $t('products.direct_datasheet_note') : $t('products.call_for_datasheet') }}
                </p>
              </div>
            </div>

            <!-- Image column (right — Advenica order) -->
            <div class="relative min-w-0 bg-white p-5 lg:-mb-10 lg:ms-0 lg:me-8 lg:mt-10">
              <div class="relative aspect-[624/440] overflow-hidden bg-white">
                <NuxtImg :src="activeGalleryImage || '/placeholder-product.svg'" :alt="product.title" class="h-full w-full object-contain p-4 md:p-8" loading="eager" fetchpriority="high" />
                <div v-if="gallery.length > 1" class="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
                  <button
                    type="button"
                    class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-[var(--text-secondary)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    :aria-label="locale === 'fa' ? 'تصویر قبلی' : 'Previous image'"
                    @click="prevImage"
                  >
                    <svg class="h-4 w-4" :class="locale === 'fa' ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-[var(--text-secondary)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    :aria-label="locale === 'fa' ? 'تصویر بعدی' : 'Next image'"
                    @click="nextImage"
                  >
                    <svg class="h-4 w-4" :class="locale === 'fa' ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="grid items-center border-t border-[#C9DDE5] bg-white lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)]">
            <p class="product-hero-strip-copy line-clamp-2 px-5 py-4 text-sm leading-relaxed md:px-7 md:text-base">{{ product.card_summary || product.description }}</p>
            <div v-if="gallery.length > 1" class="flex h-24 max-w-full items-center gap-2 overflow-x-auto border-t border-[#C9DDE5] px-3 py-2 lg:border-s lg:border-t-0" :aria-label="locale === 'fa' ? 'گالری تصاویر محصول' : 'Product image gallery'">
              <button
                v-for="(img, i) in gallery"
                :key="img"
                type="button"
                :aria-label="locale === 'fa' ? `نمایش تصویر ${i + 1}` : `Show image ${i + 1}`"
                :aria-current="activeImageIndex === i ? 'true' : undefined"
                :class="[
                  'h-16 w-24 flex-shrink-0 overflow-hidden border bg-white p-1.5 transition-colors',
                  activeImageIndex === i ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-[var(--bg-elevated)]',
                ]"
                @click="selectImage(i)"
              >
                <NuxtImg :src="thumbSrc(img)" :alt="`${product.title} ${i + 1}`" class="block h-full w-full object-contain" loading="lazy" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="sticky top-24 z-20 border-b border-[var(--border)] bg-white shadow-[0_12px_30px_rgba(9,53,68,0.08)]"
      :aria-label="locale === 'fa' ? 'بخش‌های محصول' : 'Product sections'"
    >
      <div class="container-site">
        <div class="flex gap-2 overflow-x-auto py-3" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="[
              'whitespace-nowrap border px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]',
            ]"
            role="tab"
            :aria-selected="activeTab === tab.key"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-site">
        <div v-show="activeTab === 'overview'" class="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div class="prose-product max-w-none border-t border-[var(--border)] pt-6">
            <ContentRenderer :value="product" />
          </div>
          <div class="min-w-0 space-y-4 xl:sticky xl:top-36 xl:self-start">
            <div class="border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'قابلیت‌های کلیدی' : 'Key capabilities' }}</div>
              <dl class="divide-y divide-[var(--border)] text-sm leading-relaxed">
                <div v-for="spec in primarySpecs" :key="spec.label" class="py-3 first:pt-0 last:pb-0">
                  <dt class="label-meta mb-1 text-[var(--text-muted)]">{{ spec.label }}</dt>
                  <dd class="text-[var(--text-primary)]" style="overflow-wrap: anywhere;">{{ spec.value }}</dd>
                </div>
              </dl>
            </div>
            <div v-if="productDatasheets.length" class="border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'دانلود و ارزیابی' : 'Downloads & evaluation' }}</div>
              <ul class="space-y-2">
                <li v-for="(pdf, i) in productDatasheets" :key="pdf">
                  <a
                    :href="withBase(pdf)"
                    target="_blank"
                    rel="noopener"
                    download
                    class="inline-flex items-center gap-2 text-sm text-[#1F7994] hover:text-[#AAC5D0] transition-colors"
                  >
                    <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{{ productDatasheets.length > 1 ? `${t('products.download_pdf')} ${i + 1}` : t('products.download_pdf') }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'specs'" class="bg-[#093544] p-5 text-white md:p-8 lg:p-10">
          <div v-if="primarySpecs.length" class="mb-8 grid gap-px bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="spec in primarySpecs" :key="spec.label" class="min-w-0 bg-[#093544] p-5">
              <div class="break-words text-2xl font-medium leading-tight text-white md:text-3xl">{{ spec.value }}</div>
              <div class="label-meta mt-2 !text-[#AAC5D0]">{{ spec.label }}</div>
            </div>
          </div>
          <div class="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div class="bg-white p-5 text-[var(--text-primary)]">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'تناسب استقرار' : 'Deployment fit' }}</div>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ deploymentFit }}</p>
            </div>
            <div class="overflow-x-auto bg-white">
              <table class="w-full text-start text-sm">
                <thead class="bg-[var(--bg-elevated)]">
                  <tr>
                    <th class="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{{ locale === 'fa' ? 'پارامتر' : 'Parameter' }}</th>
                    <th class="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{{ locale === 'fa' ? 'مقدار' : 'Value' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(spec, i) in product.specs || []" :key="spec.label" :class="i % 2 === 0 ? 'bg-[var(--bg-page)]' : 'bg-[var(--bg-elevated)]/55'">
                    <td class="border-t border-[var(--border)] px-5 py-4 text-[var(--text-secondary)]">{{ spec.label }}</td>
                    <td class="border-t border-[var(--border)] px-5 py-4 font-mono text-[var(--text-primary)]">{{ spec.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'faq'" class="max-w-3xl">
          <FAQItem v-for="(faq, i) in genericFAQs" :key="i" :question="faq.q" :answer="faq.a" />
        </div>
      </div>
    </section>

    <section v-if="relatedProducts?.length" class="section border-t border-[var(--border)]">
      <div class="container-site">
        <div class="mb-6">
          <div class="section-label mb-4">{{ locale === 'fa' ? 'محصولات مرتبط' : 'Related products' }}</div>
          <h2 class="section-heading text-[var(--text-primary)]">{{ $t('products.related_products') }}</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            v-for="p in relatedProducts"
            :key="p._path"
            :title="p.title"
            :slug="p.slug"
            :href="localePath(`/products/${p.category}/${p.slug}`)"
            :description="p.card_summary || p.description"
            :category-label="$t(`products.categories.${p.category}`)"
            :specs="p.specs?.slice(0, 2)"
            :image="p.photos?.[0] || p.images?.[0]"
          />
        </div>
      </div>
    </section>

    <CTAStrip
      :headline="$t('products.order_cta')"
      :sub="$t('contact.phone_first_sub')"
      :primary-label="$t('contact.call_sales_now')"
      :primary-href="salesPhoneHref"
      :secondary-label="$t('products.request_quote')"
      :secondary-href="quoteHref"
    />
  </div>

  <div v-else class="container-site py-24 text-center">
    <p class="text-[var(--text-secondary)]">{{ locale === 'fa' ? 'محصول یافت نشد.' : 'Product not found.' }}</p>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { withBase } = useBaseUrl()
const { salesPhoneHref } = useContactInfo()
const { emitProduct, emitBreadcrumbs } = useSchemaOrg()
const { category, slug } = route.params as { category: string; slug: string }

const { data: product } = await useAsyncData(`product-${slug}-${locale.value}`, async () => {
  const matches = await queryContent('products', category).where({ slug }).find()
  return matches.find(p => locale.value === 'fa' ? p.locale === 'fa' : !p.locale) ?? matches[0] ?? null
})

function normalizeMedia(items?: unknown[]) {
  const seen = new Set<string>()
  return (items || [])
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map(item => item.trim())
    .filter((item) => {
      if (seen.has(item)) return false
      seen.add(item)
      return true
    })
}

const gallery = computed(() => normalizeMedia([...(product.value?.photos || []), ...(product.value?.images || [])]))
const activeImageIndex = ref(0)
const activeGalleryImage = computed(() => gallery.value[activeImageIndex.value] || gallery.value[0] || null)

watch(gallery, (items) => {
  if (!items.length) {
    activeImageIndex.value = 0
    return
  }
  if (activeImageIndex.value > items.length - 1) activeImageIndex.value = 0
}, { immediate: true })

function selectImage(index: number) {
  if (!gallery.value.length) return
  activeImageIndex.value = Math.min(Math.max(index, 0), gallery.value.length - 1)
}

function nextImage() {
  if (gallery.value.length < 2) return
  activeImageIndex.value = (activeImageIndex.value + 1) % gallery.value.length
}

function prevImage() {
  if (gallery.value.length < 2) return
  activeImageIndex.value = (activeImageIndex.value - 1 + gallery.value.length) % gallery.value.length
}

function thumbSrc(src: string) {
  return src
}

const primarySpecs = computed(() => (product.value?.specs || []).slice(0, 4))
const deploymentFit = computed(() => locale.value === 'fa'
  ? 'برای محیط‌های حساس که نیاز به رفتار قابل پیش‌بینی، مسیر داده شفاف، و مستندسازی فنی دارند.'
  : 'Designed for sensitive environments that require predictable behavior, explainable data paths, and technical buying documentation.')
const productDatasheets = computed(() => normalizeMedia([
  product.value?.schematic_pdf,
  ...(Array.isArray(product.value?.schematic_pdfs) ? product.value.schematic_pdfs : []),
]))
const primaryDatasheetHref = computed(() => productDatasheets.value[0] ? withBase(productDatasheets.value[0]) : '')
const quoteHref = computed(() => `${localePath('/company/contact')}?dept=sales&product=${encodeURIComponent(product.value?.slug || slug)}`)

const { data: relatedProducts } = await useAsyncData(`related-${slug}-${locale.value}`, async () => {
  const all = await queryContent('products', category).where({ slug: { $ne: slug } }).find()
  return all.filter(p => locale.value === 'fa' ? p.locale === 'fa' : !p.locale).slice(0, 3)
})

const activeTab = ref('overview')
const tabs = computed(() => [
  { key: 'overview', label: t('products.overview') },
  { key: 'specs', label: t('products.specs') },
  { key: 'faq', label: t('products.faq') },
])

const genericFAQs = computed(() => locale.value === 'fa' ? [
  { q: 'گارانتی این محصول چقدر است؟', a: 'تمامی محصولات پرتو ارتباط صبا با گارانتی ۱۲ ماهه و امکان تمدید پوشش ارائه می‌شوند.' },
  { q: 'آیا امکان ارسال بین‌المللی وجود دارد؟', a: 'بله، صادرات به مقاصد مجاز انجام می‌شود. برای مستندات صادرات با تیم فروش تماس بگیرید.' },
  { q: 'آیا تامین قطعات یدکی تضمین شده است؟', a: 'حداقل ۵ سال تامین قطعات یدکی برای تمامی مدل‌های تولیدی تضمین می‌شود.' },
  { q: 'آیا فریم‌ور در محل قابل به‌روزرسانی است؟', a: 'بله، از طریق بسته‌های فریم‌ور امضاشده در پورتال مشتریان. امکان بازگشت همیشه فراهم است.' },
] : [
  { q: 'What warranty does this product carry?', a: 'All Pesaba products carry a 12-month warranty with optional extended coverage.' },
  { q: 'Do you ship internationally?', a: 'Yes, we export to approved territories. Contact our sales team for export documentation.' },
  { q: 'Is spare-parts availability guaranteed?', a: 'We maintain minimum 5-year spare-parts availability for all production models.' },
  { q: 'Can firmware be updated in the field?', a: 'Yes, via signed firmware packages delivered through our customer portal. Rollback is always available.' },
])

if (product.value) {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://pesaba.com').replace(/\/$/, '')
  useSeoMeta({
    title: `${product.value.title} | Pesaba`,
    ogTitle: `${product.value.title} | Pesaba`,
    description: product.value.description,
    ogDescription: product.value.description,
    ogImage: `${siteUrl}/og/product/${product.value.slug}.svg`,
    twitterCard: 'summary_large_image',
  })
  emitProduct({ name: product.value.title, nameFa: product.value.title_fa, slug: product.value.slug, category: product.value.category, description: product.value.description, image: activeGalleryImage.value || undefined, specs: product.value.specs, locale: locale.value })
  emitBreadcrumbs([{ name: t('common.home'), url: `/${locale.value}` }, { name: 'Products', url: `/${locale.value}/products` }, { name: t(`products.categories.${product.value.category}`), url: `/${locale.value}/products/${product.value.category}` }, { name: product.value.title, url: `/${locale.value}/products/${product.value.category}/${slug}` }])
}
</script>

<style scoped>
.page-hero .product-hero-panel :deep(h1),
.page-hero .product-hero-panel :deep(h2) {
  color: var(--text-primary) !important;
}

.page-hero .product-hero-copy {
  color: var(--text-secondary) !important;
}

.page-hero .product-hero-note {
  color: var(--text-muted) !important;
}

.page-hero .product-hero-strip-copy {
  color: var(--text-primary) !important;
}

.page-hero .product-hero-panel :deep(.btn-outline) {
  border-color: var(--border-strong) !important;
  color: var(--text-primary) !important;
}

.page-hero .product-hero-panel :deep(.btn-outline:hover) {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
}
</style>
