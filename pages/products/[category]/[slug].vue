<template>
  <div v-if="product">
    <section class="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <div class="container-site py-4">
        <nav class="flex items-center gap-2 text-sm text-[var(--text-muted)]" :aria-label="$t('common.breadcrumb')">
          <NuxtLink :to="localePath('/products')" class="transition-colors hover:text-[var(--text-secondary)]">{{ $t('products.title') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="localePath(`/products/${product.category}`)" class="transition-colors hover:text-[var(--text-secondary)]">{{ $t(`products.categories.${product.category}`) }}</NuxtLink>
          <span>/</span>
          <span class="text-[var(--text-secondary)]">{{ product.title }}</span>
        </nav>
      </div>
    </section>

    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div class="space-y-4">
            <div class="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),var(--bg-elevated)] p-5 shadow-[0_24px_70px_rgba(4,10,20,0.5)]">
              <div :class="['aspect-[16/10] overflow-hidden rounded-[22px] border border-[var(--border)]', isDark ? 'bg-[linear-gradient(180deg,rgba(14,165,233,0.05),transparent)]' : 'bg-[var(--bg-page)]']">
                <NuxtImg :src="activeImage || '/placeholder-product.svg'" :alt="product.title" class="h-full w-full object-contain p-8" />
              </div>
            </div>

            <div v-if="gallery.length" class="flex gap-3 overflow-x-auto pb-2">
              <button
                v-for="(img, i) in gallery"
                :key="img"
                @click="activeImage = img"
                :class="[
                  'h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border p-1 transition-colors',
                  activeImage === img ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-[var(--bg-elevated)]',
                ]"
              >
                <NuxtImg :src="img.replace(/\.webp$/, '-thumb.webp')" :alt="`${product.title} ${i + 1}`" class="h-full w-full rounded-xl object-contain" />
              </button>
            </div>
          </div>

          <div class="xl:sticky xl:top-24 xl:self-start">
            <div class="card-halo p-6">
              <div class="label-accent mb-4">{{ $t(`products.categories.${product.category}`) }}</div>
              <div class="mb-3 flex items-center gap-4">
                <h1 class="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)]">{{ product.title }}</h1>
                <img v-if="product.logo" :src="$withBase(product.logo)" :alt="`${product.title} logo`" class="h-10 w-auto opacity-90" loading="lazy" />
              </div>
              <p class="mb-6 text-base leading-relaxed text-[var(--text-secondary)]">{{ product.card_summary || product.description }}</p>

              <div v-if="primarySpecs.length" class="mb-6 flex flex-wrap gap-2">
                <SpecPill v-for="spec in primarySpecs" :key="spec.label" :label="spec.label" :value="spec.value" />
              </div>

              <div class="mb-6 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
                  <div class="label-meta mb-1">{{ locale === 'fa' ? 'تناسب استقرار' : 'Deployment fit' }}</div>
                  <div class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ deploymentFit }}</div>
                </div>
                <div class="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
                  <div class="label-meta mb-1">{{ locale === 'fa' ? 'مستندات' : 'Documentation' }}</div>
                  <div class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ documentationNote }}</div>
                </div>
              </div>

              <div id="quote" class="flex flex-wrap gap-3">
                <BaseButton variant="primary" size="lg" :to="localePath('/company/contact')">
                  {{ $t('products.request_quote') }}
                </BaseButton>
                <BaseButton variant="outline" size="lg" :to="localePath('/resources/datasheets')">
                  {{ $t('products.download_pdf') }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section :class="['sticky top-16 z-20 border-y border-[var(--border)] backdrop-blur-xl', isDark ? 'bg-[rgba(8,16,28,0.94)]' : 'bg-[rgba(248,250,252,0.94)]']">
      <div class="container-site">
        <div class="flex gap-2 overflow-x-auto py-3" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'rounded-full border px-3 py-2 text-sm transition-colors',
              activeTab === tab.key
                ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            ]"
            role="tab"
            :aria-selected="activeTab === tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div v-show="activeTab === 'overview'" class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div class="prose-product max-w-none">
            <ContentRenderer :value="product" />
          </div>
          <div class="space-y-4">
            <div class="card-halo p-5">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'قابلیت‌های کلیدی' : 'Key capabilities' }}</div>
              <dl class="divide-y divide-[var(--border)] text-sm leading-relaxed">
                <div v-for="spec in primarySpecs" :key="spec.label" class="py-3 first:pt-0 last:pb-0">
                  <dt class="label-meta mb-1 text-[var(--text-muted)]">{{ spec.label }}</dt>
                  <dd class="text-[var(--text-primary)]" style="overflow-wrap: anywhere;">{{ spec.value }}</dd>
                </div>
              </dl>
            </div>
            <div class="card-halo p-5">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'دانلود و ارزیابی' : 'Downloads & evaluation' }}</div>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ documentationNote }}</p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'specs'" class="overflow-x-auto rounded-[24px] border border-[var(--border)]">
          <table class="w-full text-start text-sm">
            <thead class="bg-[var(--bg-elevated)]">
              <tr>
                <th class="label-meta px-5 py-4 text-start">{{ locale === 'fa' ? 'پارامتر' : 'Parameter' }}</th>
                <th class="label-meta px-5 py-4 text-start">{{ locale === 'fa' ? 'مقدار' : 'Value' }}</th>
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

        <div v-show="activeTab === 'faq'" class="max-w-3xl">
          <FAQItem v-for="(faq, i) in genericFAQs" :key="i" :id="`faq-${i}`" :question="faq.q" :answer="faq.a" />
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

    <CTAStrip :headline="$t('products.order_cta')" :primary-label="$t('products.request_quote')" :primary-href="localePath('/company/contact')" />
  </div>

  <div v-else class="container-site py-24 text-center">
    <p class="text-[var(--text-secondary)]">{{ locale === 'fa' ? 'محصول یافت نشد.' : 'Product not found.' }}</p>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { isDark } = useDarkMode()
const { emitProduct, emitBreadcrumbs } = useSchemaOrg()
const { category, slug } = route.params as { category: string; slug: string }

const { data: product } = await useAsyncData(`product-${slug}-${locale.value}`, async () => {
  const matches = await queryContent('products', category).where({ slug }).find()
  return matches.find(p => locale.value === 'fa' ? p.locale === 'fa' : !p.locale) ?? matches[0] ?? null
})

const gallery = computed(() => [...(product.value?.photos || []), ...(product.value?.images || [])])
const activeImage = ref<string | null>(null)
watchEffect(() => {
  activeImage.value = gallery.value[0] || null
})

const primarySpecs = computed(() => (product.value?.specs || []).slice(0, 4))
const deploymentFit = computed(() => locale.value === 'fa'
  ? 'برای محیط‌های حساس که نیاز به رفتار قابل پیش‌بینی، مسیر داده شفاف، و مستندسازی فنی دارند.'
  : 'Designed for sensitive environments that require predictable behavior, explainable data paths, and technical buying documentation.')
const documentationNote = computed(() => locale.value === 'fa'
  ? 'دیتاشیت‌ها و مدارک فنی از بخش منابع در دسترس هستند؛ برای سناریوهای ارزیابی با تیم فروش تماس بگیرید.'
  : 'Datasheets and technical material are available in Resources; contact sales engineering for evaluation-specific guidance.')

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
  useSeoMeta({
    title: `${product.value.title} | Pesaba`,
    ogTitle: `${product.value.title} | Pesaba`,
    description: product.value.description,
    ogDescription: product.value.description,
    ogImage: `https://pesaba.com/og/product/${product.value.slug}`,
    twitterCard: 'summary_large_image',
  })
  emitProduct({ name: product.value.title, nameFa: product.value.title_fa, slug: product.value.slug, category: product.value.category, description: product.value.description, image: activeImage.value || undefined, specs: product.value.specs, locale: locale.value })
  emitBreadcrumbs([{ name: 'Products', url: `/${locale.value}/products` }, { name: t(`products.categories.${product.value.category}`), url: `/${locale.value}/products/${product.value.category}` }, { name: product.value.title, url: `/${locale.value}/products/${product.value.category}/${slug}` }])
}
</script>
