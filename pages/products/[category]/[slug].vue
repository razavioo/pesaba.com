<template>
  <div v-if="product">
    <section class="page-hero overflow-hidden pb-0">
      <div class="container-site pb-6 pt-8 md:pt-12 lg:pb-8">
        <nav class="product-breadcrumb mb-4 flex min-w-0 max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 text-xs text-white/40" :aria-label="$t('common.breadcrumb')">
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
            <div class="min-w-0 p-5 md:p-8 lg:p-10">
              <div class="max-w-xl">
                <div class="label-accent mb-4">{{ $t(`products.categories.${product.category}`) }}</div>
                <div class="mb-4 flex min-w-0 flex-wrap items-center gap-4">
                  <h1 class="product-hero-title !text-[var(--text-primary)] max-w-full font-bold">{{ product.title }}</h1>
                  <img v-if="product.logo" :src="withBase(product.logo)" :alt="`${product.title} logo`" class="h-10 w-auto opacity-90" loading="lazy">
                </div>
                <p class="product-hero-copy mb-5 max-w-xl text-base leading-relaxed md:text-lg">{{ publicDescription(product) }}</p>

                <div id="quote" class="mb-4 grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap">
                  <BaseButton variant="primary" size="sm" :href="salesPhoneHref" class="product-hero-action">
                    {{ $t('contact.call_sales') }}
                  </BaseButton>
                  <BaseButton variant="outline" size="sm" :to="quoteHref" class="product-hero-action">
                    {{ $t('products.request_quote') }}
                  </BaseButton>
                  <BaseButton v-if="primaryDatasheetHref" variant="outline" size="sm" :href="primaryDatasheetHref" target="_blank" rel="noopener" class="product-hero-action col-span-2 sm:col-span-auto">
                    {{ $t('products.download_pdf') }}
                  </BaseButton>
                </div>
                <p class="product-hero-note max-w-xl text-xs leading-relaxed">
                  {{ productDatasheets.length ? $t('products.direct_datasheet_note') : $t('products.call_for_datasheet') }}
                </p>
              </div>
            </div>

            <!-- Image column (right — Advenica order) -->
            <div class="product-hero-media relative min-w-0 bg-white p-3 shadow-[0_18px_45px_rgba(9,53,68,0.08)] md:p-5 lg:ms-0 lg:me-8 lg:mt-8">
              <div class="product-hero-image relative aspect-[624/410] overflow-hidden bg-white md:aspect-[624/430]">
                <NuxtImg :src="activeGalleryImage || '/placeholder-product.svg'" :alt="product.title" class="h-full w-full object-contain p-4 md:p-7" loading="eager" fetchpriority="high" />
                <div v-if="gallery.length > 1" class="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between md:inset-x-3">
                  <button
                    type="button"
                    class="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-[var(--text-secondary)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    :aria-label="locale === 'fa' ? 'تصویر قبلی' : 'Previous image'"
                    @click="prevImage"
                  >
                    <svg class="h-4 w-4" :class="locale === 'fa' ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-[var(--text-secondary)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    :aria-label="locale === 'fa' ? 'تصویر بعدی' : 'Next image'"
                    @click="nextImage"
                  >
                    <svg class="h-4 w-4" :class="locale === 'fa' ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="gallery.length" class="product-thumbnail-rail mt-4 flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden border-t border-[#C9DDE5] bg-[#F4F8FA] p-2" :aria-label="locale === 'fa' ? 'گالری تصاویر محصول' : 'Product image gallery'">
                <button
                  v-for="(img, i) in gallery"
                  :key="img"
                  type="button"
                  :aria-label="locale === 'fa' ? `نمایش تصویر ${i + 1}` : `Show image ${i + 1}`"
                  :aria-current="activeImageIndex === i ? 'true' : undefined"
                  :class="[
                    'h-16 w-24 flex-shrink-0 overflow-hidden border bg-white p-1.5 transition-colors',
                    activeImageIndex === i ? 'border-[var(--accent)] ring-2 ring-[#AAC5D0]' : 'border-[#C9DDE5] hover:border-[var(--accent)]',
                  ]"
                  @click="selectImage(i)"
                >
                  <NuxtImg :src="thumbSrc(img)" :alt="`${product.title} ${i + 1}`" class="block h-full w-full object-contain" loading="lazy" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="product-sections">
      <section
        class="sticky top-[5.125rem] z-20 border-b border-[var(--border)] bg-white shadow-[0_12px_30px_rgba(9,53,68,0.08)] md:top-[6.25rem]"
        :aria-label="locale === 'fa' ? 'بخش‌های محصول' : 'Product sections'"
      >
        <div class="container-site">
          <div class="flex gap-2 overflow-x-auto py-3" role="tablist" :aria-label="locale === 'fa' ? 'بخش‌های محصول' : 'Product sections'">
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
              :id="`tab-${tab.key}`"
              :aria-controls="`panel-${tab.key}`"
              :aria-selected="activeTab === tab.key"
              :tabindex="activeTab === tab.key ? 0 : -1"
              @click="activeTab = tab.key"
              @keydown.left.prevent="moveTab(-1)"
              @keydown.right.prevent="moveTab(1)"
              @keydown.up.prevent="moveTab(-1)"
              @keydown.down.prevent="moveTab(1)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="container-site">
        <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0" v-show="activeTab === 'overview'" class="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div class="prose-product max-w-none border-t border-[var(--border)] pt-6">
            <template v-if="normalizedOverview">
              <h2>{{ normalizedOverview.title }}</h2>
              <p v-for="paragraph in normalizedOverview.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
              <h2 v-if="normalizedOverview.featureHeading">{{ normalizedOverview.featureHeading }}</h2>
              <ul v-if="normalizedOverview.features.length" class="product-feature-list">
                <li v-for="feature in normalizedOverview.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
              <h2 v-if="normalizedOverview.linkHeading">{{ normalizedOverview.linkHeading }}</h2>
              <p v-if="normalizedOverview.linkText">
                {{ normalizedOverview.linkText }}
              </p>
            </template>
              <CmsMarkdown v-else :source="String(product.body || '')" />
          </div>
          <div class="min-w-0 space-y-4 xl:sticky xl:top-36 xl:self-start">
            <div v-if="primarySpecs.length || keyCapabilityItems.length" class="border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'قابلیت‌های کلیدی' : 'Key capabilities' }}</div>
              <dl v-if="primarySpecs.length" class="divide-y divide-[var(--border)] text-sm leading-relaxed">
                <div v-for="spec in primarySpecs" :key="spec.label" class="py-3 first:pt-0 last:pb-0">
                  <dt class="label-meta mb-1 text-[var(--text-muted)]">{{ spec.label }}</dt>
                  <dd class="text-[var(--text-primary)]" style="overflow-wrap: anywhere;">{{ spec.value }}</dd>
                </div>
              </dl>
              <ul v-else class="space-y-3 text-sm leading-relaxed text-[var(--text-primary)]">
                <li v-for="item in keyCapabilityItems" :key="item" class="flex gap-2">
                  <span class="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[var(--accent)]" aria-hidden="true" />
                  <span style="overflow-wrap: anywhere;">{{ item }}</span>
                </li>
              </ul>
            </div>
            <div v-if="productDatasheets.length" data-product-downloads class="border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
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

        <div id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" tabindex="0" v-show="activeTab === 'specs'" class="bg-[#093544] p-5 text-white md:p-8 lg:p-10">
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
            <div v-if="productSpecs.length" class="overflow-x-auto bg-white">
              <table class="w-full text-start text-sm">
                <thead class="bg-[var(--bg-elevated)]">
                  <tr>
                    <th class="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{{ locale === 'fa' ? 'پارامتر' : 'Parameter' }}</th>
                    <th class="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{{ locale === 'fa' ? 'مقدار' : 'Value' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(spec, i) in productSpecs" :key="spec.label" :class="i % 2 === 0 ? 'bg-[var(--bg-page)]' : 'bg-[var(--bg-elevated)]/55'">
                    <td class="border-t border-[var(--border)] px-5 py-4 text-[var(--text-secondary)]">{{ spec.label }}</td>
                    <td class="border-t border-[var(--border)] px-5 py-4 font-mono text-[var(--text-primary)]">{{ spec.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else-if="keyCapabilityItems.length" class="bg-white p-5 text-[var(--text-primary)]">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'قابلیت‌ها' : 'Capabilities' }}</div>
              <ul class="grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
                <li v-for="item in keyCapabilityItems" :key="item" class="flex gap-2">
                  <span class="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[var(--accent)]" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="panel-faq" role="tabpanel" aria-labelledby="tab-faq" tabindex="0" v-show="activeTab === 'faq'" class="max-w-3xl">
          <FAQItem v-for="(faq, i) in genericFAQs" :key="i" :question="faq.q" :answer="faq.a" />
        </div>
        </div>
      </section>
    </div>

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
            :title="p.title || ''"
            :slug="p.slug || ''"
            :href="localePath(`/products/${p.category}/${p.slug}`)"
            :description="publicDescription(p)"
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
const { publicDescription } = useProductCopy()
const { emitProduct, emitBreadcrumbs } = useSchemaOrg()
const { category, slug } = route.params as { category: string; slug: string }

const { get, list } = usePublicCms()
const { data: product } = await useAsyncData(`product-${slug}-${locale.value}`, () =>
  get('product', slug, locale.value as 'fa' | 'en'), { watch: [locale] },
)

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

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

const gallery = computed(() => {
  const productImages = normalizeMedia([
    ...(product.value?.photos || []),
    ...(product.value?.images || []),
  ])
  if (productImages.length) return productImages

  const technicalImages = normalizeMedia([
    product.value?.diagram,
    product.value?.schematic_image,
    product.value?.logo,
  ])
  return technicalImages.length ? technicalImages : ['/placeholder-product.svg']
})
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

type ProductOverview = {
  title: string
  paragraphs: string[]
  featureHeading: string
  features: string[]
  linkHeading: string
  linkText: string
}

function normalizeTextItems(items: string[]) {
  const seen = new Set<string>()
  return items
    .map(item => sentenceSplit(item).replace(/\s+/g, ' ').trim())
    .filter((item) => {
      if (!item || seen.has(item)) return false
      seen.add(item)
      return true
    })
}

function sentenceSplit(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/([a-z)])([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z)])(\d+\s*[×x])/g, '$1 $2')
    .replace(/(:)([A-Z0-9])/g, '$1 $2')
    .replace(/(networks\.)(By)/g, '$1 $2')
    .replace(/(level\.)(It)/g, '$1 $2')
    .replace(/(networks\.)(The)/g, '$1 $2')
    .replace(/(networks\.)(This)/g, '$1 $2')
    .replace(/(path\.)(Key)/g, '$1 $2')
    .replace(/(including:)(One-way)/g, '$1 $2')
    .replace(/(request)(This product)/g, '$1. $2')
    .trim()
}

function extractCapabilitiesFromBody(productValue: typeof product.value) {
  const body = String(productValue?.body || '')
  const items = body.split('\n')
    .filter(line => /^\s*[-*+]\s+/.test(line))
    .map(line => line.replace(/^\s*[-*+]\s+/, '').trim())
  return normalizeTextItems(items)
}

function normalizeCompressedOverview(productValue: typeof product.value): ProductOverview | null {
  void productValue
  return null
}

const reviewedOverview = computed(() => normalizeCompressedOverview(product.value))
const normalizedOverview = computed<ProductOverview>(() => {
  if (product.value?.evidence_reviewed === true) {
    const overview = reviewedOverview.value
    if (overview) return overview
  }

  const summary = publicDescription(product.value).trim()
  return {
    title: locale.value === 'fa' ? 'معرفی منتشرشده محصول' : 'Published product overview',
    paragraphs: [
      ...(summary ? [summary] : []),
      locale.value === 'fa'
        ? 'مشخصات، سازگاری، قابلیت‌ها و شرایط تجاری باید برای مدل و نسخه موردنظر از دیتاشیت جاری، پیشنهاد فنی یا قرارداد تأیید شوند. متن تفصیلی این محصول تا پایان بازبینی شواهد عمومی نمایش داده نمی‌شود.'
        : 'Specifications, compatibility, capabilities, and commercial terms must be confirmed for the selected model and revision from the current datasheet, technical proposal, or contract. Detailed copy remains unpublished until its evidence review is complete.',
    ],
    featureHeading: '',
    features: [],
    linkHeading: '',
    linkText: '',
  }
})
type ProductSpec = { label: string, value: string }

const productSpecs = computed<ProductSpec[]>(() => {
  if (!Array.isArray(product.value?.specs)) return []
  return product.value.specs.filter((spec): spec is ProductSpec => Boolean(
    spec
    && typeof spec === 'object'
    && 'label' in spec
    && typeof spec.label === 'string'
    && 'value' in spec
    && typeof spec.value === 'string',
  ))
})
const primarySpecs = computed(() => productSpecs.value.slice(0, 4))
const keyCapabilityItems = computed(() => {
  if (primarySpecs.value.length) return []
  if (product.value?.evidence_reviewed !== true) return []
  return extractCapabilitiesFromBody(product.value).slice(0, 5)
})
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
  const all = await list('product', locale.value as 'fa' | 'en')
  return all.filter((item: any) => item.slug !== slug && item.category === category).slice(0, 3)
}, { watch: [locale] })

const activeTab = ref('overview')
const tabs = computed(() => [
  { key: 'overview', label: t('products.overview') },
  { key: 'specs', label: t('products.specs') },
  { key: 'faq', label: t('products.faq') },
])

function moveTab(offset: number) {
  const index = tabs.value.findIndex(tab => tab.key === activeTab.value)
  const next = tabs.value[(index + offset + tabs.value.length) % tabs.value.length]
  activeTab.value = next.key
  nextTick(() => document.getElementById(`tab-${next.key}`)?.focus())
}

const genericFAQs = computed(() => locale.value === 'fa' ? [
  { q: 'شرایط گارانتی این محصول چیست؟', a: 'مدت، دامنه و شرایط گارانتی باید برای مدل، نسخه و سفارش موردنظر در پیشنهاد فروش یا قرارداد تأیید شود.' },
  { q: 'آیا امکان ارسال بین‌المللی وجود دارد؟', a: 'امکان فروش و ارسال به مقصد، الزامات صادراتی و مدارک لازم باید پیش از سفارش با تیم فروش بررسی شود.' },
  { q: 'وضعیت تامین قطعات یدکی چگونه است؟', a: 'وضعیت تولید، تعمیر و تامین قطعات به مدل، زمان سفارش و شرایط زنجیره تامین وابسته است و باید پیش از خرید استعلام شود.' },
  { q: 'فریم‌ور چگونه به‌روزرسانی می‌شود؟', a: 'روش دریافت، راستی‌آزمایی، نصب و بازگشت نسخه بین مدل‌ها متفاوت است؛ فقط از دستورالعمل رسمی مختص همان سخت‌افزار استفاده کنید.' },
] : [
  { q: 'What warranty applies to this product?', a: 'Warranty duration, scope, and conditions must be confirmed for the selected model, revision, and order in the sales proposal or contract.' },
  { q: 'Do you ship internationally?', a: 'Destination eligibility, export requirements, and required documentation must be reviewed with sales before an order is accepted.' },
  { q: 'What is the spare-parts position?', a: 'Production, repair, and parts availability depend on the model, order date, and supply conditions and must be confirmed before purchase.' },
  { q: 'How is firmware updated?', a: 'Package delivery, verification, installation, and rollback procedures vary by model; follow only the official instructions for the exact hardware revision.' },
])

if (product.value) {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://pesaba.com').replace(/\/$/, '')
  const productTitle = String(product.value.title || slug)
  const productSlug = String(product.value.slug || slug)
  const productCategory = String(product.value.category || category)
  const socialImage = `${siteUrl}/og/product/${productSlug}.${locale.value}.png`
  useSeoMeta({
    title: `${productTitle} | Pesaba`,
    ogTitle: `${productTitle} | Pesaba`,
    description: publicDescription(product.value),
    ogDescription: publicDescription(product.value),
    ogImage: socialImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    twitterTitle: `${productTitle} | Pesaba`,
    twitterDescription: product.value.description,
    twitterImage: socialImage,
    twitterCard: 'summary_large_image',
  })
  emitProduct({ name: productTitle, nameFa: product.value.title_fa, slug: productSlug, category: productCategory, description: publicDescription(product.value), image: activeGalleryImage.value || undefined, specs: product.value.specs, locale: locale.value })
  emitBreadcrumbs([{ name: t('common.home'), url: `/${locale.value}` }, { name: t('products.title'), url: `/${locale.value}/products` }, { name: t(`products.categories.${productCategory}`), url: `/${locale.value}/products/${productCategory}` }, { name: productTitle, url: `/${locale.value}/products/${productCategory}/${productSlug}` }])
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

.page-hero .product-hero-title {
  color: var(--text-primary) !important;
  font-size: clamp(2.25rem, 9vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.product-breadcrumb {
  contain: inline-size;
  overscroll-behavior-inline: contain;
}

.page-hero .product-hero-note {
  color: var(--text-muted) !important;
}

.page-hero .product-hero-panel :deep(.btn-primary) {
  background-color: var(--accent) !important;
  border-color: var(--accent) !important;
  color: #fff !important;
}

.page-hero .product-hero-panel :deep(.btn-primary:hover) {
  background-color: var(--btn-primary-hover) !important;
  border-color: var(--btn-primary-hover) !important;
}

.page-hero .product-hero-panel :deep(.btn-outline) {
  border-color: var(--border-strong) !important;
  color: var(--text-primary) !important;
}

.page-hero .product-hero-panel :deep(.btn-outline:hover) {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
}

.page-hero .product-hero-panel :deep(.product-hero-action) {
  min-height: 2.75rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.95rem;
  line-height: 1;
  white-space: nowrap;
}

.product-thumbnail-rail {
  padding-bottom: 0.25rem;
  scrollbar-gutter: stable;
}

.product-thumbnail-rail :deep(img) {
  object-position: center;
}

.prose-product .product-feature-list {
  columns: 2;
  column-gap: 2rem;
}

.prose-product .product-feature-list li {
  break-inside: avoid;
}

[dir="rtl"] .product-thumbnail-rail {
  direction: ltr;
}

[dir="rtl"] .product-thumbnail-rail > * {
  direction: rtl;
}

@media (min-width: 1024px) {
  .page-hero .product-hero-title {
    font-size: clamp(3.25rem, 4.6vw, 4.25rem);
  }
}

@media (max-width: 1023px) {
  .product-hero-media {
    order: -1;
  }
}

@media (max-width: 640px) {
  .page-hero .product-hero-panel :deep(.product-hero-action) {
    width: 100%;
    padding-inline: 0.75rem;
    font-size: 0.78rem;
  }

  .product-thumbnail-rail {
    margin-inline: -0.25rem;
    padding-inline: 0.25rem;
  }

  .prose-product .product-feature-list {
    columns: 1;
  }
}
</style>
