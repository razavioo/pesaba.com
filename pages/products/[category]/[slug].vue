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
                  <img v-if="product.logo" :src="$withBase(product.logo)" :alt="`${product.title} logo`" class="h-10 w-auto opacity-90" loading="lazy">
                </div>
                <p class="product-hero-copy mb-5 max-w-xl text-base leading-relaxed md:text-lg">{{ product.card_summary || product.description }}</p>

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
            <div class="product-hero-media relative min-w-0 bg-white p-3 md:p-5 lg:-mb-7 lg:ms-0 lg:me-8 lg:mt-8">
              <div class="product-hero-image relative aspect-[624/390] overflow-hidden bg-white md:aspect-[624/420]">
                <NuxtImg :src="activeGalleryImage || '/placeholder-product.svg'" :alt="product.title" class="h-full w-full object-contain p-2.5 md:p-7" loading="eager" fetchpriority="high" />
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
              <div v-if="gallery.length > 1" class="product-thumbnail-rail mt-3 flex max-w-full items-center gap-2 overflow-x-auto overflow-y-visible border-t border-[#C9DDE5] pt-3" :aria-label="locale === 'fa' ? 'گالری تصاویر محصول' : 'Product image gallery'">
                <button
                  v-for="(img, i) in gallery"
                  :key="img"
                  type="button"
                  :aria-label="locale === 'fa' ? `نمایش تصویر ${i + 1}` : `Show image ${i + 1}`"
                  :aria-current="activeImageIndex === i ? 'true' : undefined"
                  :class="[
                    'h-14 w-20 flex-shrink-0 overflow-visible border bg-white p-1 transition-colors',
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
            <ContentRenderer v-else :value="product" />
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

type ProductBodyNode = {
  type?: string
  tag?: string
  value?: string
  children?: ProductBodyNode[]
}

type ProductOverview = {
  title: string
  paragraphs: string[]
  featureHeading: string
  features: string[]
  linkHeading: string
  linkText: string
}

const PRODUCT_FEATURE_MARKERS = [
  'True one-way data transfer',
  'Unidirectional communication',
  'Guaranteed unidirectional communication',
  'Unidirectional link implemented',
  'Hardware-level separation',
  'Complete hardware-based separation',
  'Complete protection',
  'Physical isolation',
  'OS-less hardware design',
  'Fully hardware-based',
  'Full elimination',
  'Complete elimination',
  'Significantly reduced',
  'Reduced hacking risk',
  'Suitable for',
  'Designed for',
  'Supports industrial protocols',
  'Support for common',
  'Support for industrial',
  'Support for data transfer',
  'Available in desktop',
  '24/7 operation',
  'High reliability',
  'Easy integration',
  'No return path',
  'No requirement',
  'Independent power circuits',
  'Isolated power circuits',
  'Complete isolation',
  'FPGA-based design',
  'Multiple supported services, including:',
  'One-way message transfer',
  'File, database, and image transfer',
  'Database synchronization',
  'Screen mirroring',
  'Screen Mirroring',
  'Modbus service',
  'Modbus',
  'Camera streaming service',
  'Camera services',
  'Integrated LED status indicators',
  'Integrated LED display',
  'Front-panel display',
  'SNMP monitoring protocol',
  'SYSLOG implementation',
  'Data transfer rate',
  'Ability to add custom',
  'Ability to connect',
  'Connect and disconnect',
  'Support for multiple users',
  'Simultaneous access',
  'Scalable and adaptable',
  'File reception event integration',
  'Display of software outputs',
  'Low Process consumption',
  'Form Factor:',
  'This product contains',
]

function collectText(node?: ProductBodyNode): string {
  if (!node) return ''
  if (typeof node.value === 'string') return node.value
  return (node.children || []).map(child => collectText(child)).join('')
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

function cleanHeading(text: string) {
  return text
    .replace(/\|/g, ' - ')
    .replace(/\s+/g, ' ')
    .replace(/\s+-\s*$/g, '')
    .trim()
}

function splitSection(text: string, marker: string) {
  const index = text.indexOf(marker)
  if (index === -1) return [text, ''] as const
  return [text.slice(0, index).trim(), text.slice(index + marker.length).trim()] as const
}

function splitFeatureText(text: string) {
  const escaped = PRODUCT_FEATURE_MARKERS.map(marker => marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  return text
    .replace(new RegExp(`\\s*(${escaped})`, 'g'), '\n$1')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
}

function firstFeatureMarkerIndex(text: string) {
  return PRODUCT_FEATURE_MARKERS.reduce((first, marker) => {
    const index = text.indexOf(marker)
    if (index === -1) return first
    return first === -1 ? index : Math.min(first, index)
  }, -1)
}

function normalizePlainCompressedOverview(readable: string, fallbackTitle?: string): ProductOverview | null {
  const titleMarkers = ['Product Overview', 'Full Description & Key Features']
  let title = fallbackTitle || ''
  let body = readable

  for (const marker of titleMarkers) {
    const index = readable.indexOf(marker)
    if (index === -1) continue

    title = cleanHeading(readable.slice(0, index + marker.length))
    body = readable.slice(index + marker.length).trim()
    break
  }

  const [bodyText, linkText] = splitSection(body, 'Relevant Internal Links:')
  const sectionedBody = bodyText
    .replace(/\s+(Introduction to|Communication Ports|Secure Software-less Architecture|Hardware Design|Traffic Filtering Capabilities|Customization Capabilities)/g, '\n$1')
  const paragraphs = sectionedBody
    .split(/\n|(?<=\.)\s+/)
    .map(item => item.trim())
    .filter(Boolean)

  if (!paragraphs.length) return null

  return {
    title: cleanHeading(title || fallbackTitle || ''),
    paragraphs,
    featureHeading: '',
    features: [],
    linkHeading: linkText ? 'Relevant Internal Links' : '',
    linkText,
  }
}

function normalizeCompressedOverview(productValue: typeof product.value): ProductOverview | null {
  const children = productValue?.body?.children as ProductBodyNode[] | undefined
  if (!children?.length || children.length > 1) return null

  const raw = collectText(children[0]).trim()
  const isCompressed = raw.length > 500 && /[a-z)][A-Z][a-z]|:[A-Z0-9]|[a-z)]\d+\s*[×x]/.test(raw)
  if (!isCompressed) return null

  const readable = sentenceSplit(raw)
  if (!readable.includes('Product Overview') || !readable.includes('Key Features')) {
    return normalizePlainCompressedOverview(readable, productValue?.title)
  }

  const [titleText, afterTitle] = splitSection(readable, 'Product Overview')
  const [overviewText, afterOverview] = splitSection(afterTitle, 'Key Features')
  const [featureBlock, linkText] = splitSection(afterOverview, 'Relevant Internal Links:')
  const firstFeatureIndex = firstFeatureMarkerIndex(featureBlock)
  const featureHeading = firstFeatureIndex > 0 ? `Key Features ${featureBlock.slice(0, firstFeatureIndex).trim()}` : 'Key Features'
  const featureText = firstFeatureIndex > -1 ? featureBlock.slice(firstFeatureIndex).trim() : featureBlock
  const paragraphs = overviewText
    .split(/(?<=\.)\s+/)
    .map(item => item.trim())
    .filter(Boolean)

  return {
    title: cleanHeading(titleText),
    paragraphs,
    featureHeading,
    features: splitFeatureText(featureText),
    linkHeading: linkText ? 'Relevant Internal Links' : '',
    linkText,
  }
}

const normalizedOverview = computed(() => normalizeCompressedOverview(product.value))
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
