<template>
  <div v-if="term" class="min-h-screen">
    <section class="page-hero">
      <div class="container-site pt-6 pb-16">
      <nav class="flex items-center gap-2 text-xs text-white/40 mb-8" :aria-label="$t('common.breadcrumb')">
        <NuxtLink :to="localePath('/glossary')" class="hover:text-white/70 transition-colors">{{ $t('glossary.title') }}</NuxtLink>
        <span>/</span>
        <span class="text-white/60" :dir="locale === 'fa' ? 'rtl' : 'ltr'">{{ term.title }}</span>
      </nav>
      <div class="max-w-3xl">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <BaseBadge color="photon">{{ $t('glossary.term') }}</BaseBadge>
          <span v-if="term.category" class="text-xs text-[#AAC5D0] font-mono">{{ term.category }}</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight" style="letter-spacing: -0.02em;" :dir="locale === 'fa' ? 'rtl' : 'ltr'">{{ term.title }}</h1>
        <p v-if="locale === 'fa' && term.title_en" class="text-2xl font-bold text-white/70 mb-6" dir="ltr">{{ term.title_en }}</p>
        <p v-if="term.short_definition" class="text-lg text-white/70 leading-relaxed border-s-2 border-[#AAC5D0]/30 ps-4">{{ term.short_definition }}</p>
      </div>
      </div>
    </section>
    <div class="container-prose py-12 lg:py-16 mx-auto px-6">
      <CmsMarkdown :source="bodyWithoutRelatedProducts" class="prose-article" />
      <section
        v-if="relatedProducts.length"
        id="محصولات-مرتبط-پرتو-ارتباط-صبا"
        class="mt-12 border-t border-[var(--border)] pt-8"
        :aria-label="locale === 'fa' ? 'محصولات مرتبط پرتو ارتباط صبا' : 'Related Pesaba products'"
      >
        <div class="grid gap-5 md:grid-cols-2">
          <ProductCard
            v-for="product in relatedProducts"
            :key="product._path"
            :title="product.title || ''"
            :slug="product.slug || ''"
            :href="localePath(`/products/${product.category}/${product.slug}`)"
            :description="productDescription(product)"
            :category-label="product.category ? $t(`products.categories.${product.category}`) : undefined"
            :specs="product.specs?.slice(0, 2)"
            :image="product.photos?.[0] || product.images?.[0]"
          />
        </div>
      </section>
      <div v-if="!relatedProducts.length" class="sr-only">
        {{ locale === 'fa' ? 'محصول مرتبطی ثبت نشده است.' : 'No related products listed.' }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { emitGlossaryTerm, emitBreadcrumbs } = useSchemaOrg()
const termSlug = String(route.params.slug || '')
const { get, list } = usePublicCms()
const { data: term } = await useAsyncData(`glossary-${termSlug}-${locale.value}`, () => get('glossary', termSlug, locale.value as 'fa' | 'en'), { watch: [locale] })

const { data: products } = await useAsyncData(`glossary-products-${termSlug}-${locale.value}`, () => list('product', locale.value as 'fa' | 'en'), { watch: [locale] })
const { publicDescription } = useProductCopy()

const productDescription = (product: any) => {
  if (locale.value !== 'fa') return product.description_en || product.description || ''

  const localized = product.description_fa || (product.locale === 'fa' ? product.description : '')
  // Older CMS records may contain the English safety fallback in the Persian slot.
  if (localized && !/\bis listed in the Pesaba catalogue\b/i.test(localized)) return localized
  return publicDescription(product)
}

const relatedProducts = computed(() => {
  const relatedSlugs = Array.isArray(term.value?.related_products) ? term.value.related_products : []
  if (!relatedSlugs.length) return []

  return relatedSlugs
    .map((relatedSlug: string) => products.value?.find((product: any) =>
      (product.slug === relatedSlug || product._path?.split('/').pop() === relatedSlug)
      && product.active !== false
      && (locale.value === 'fa' ? product.locale === 'fa' : product.locale !== 'fa'),
    ))
    .filter(Boolean) as any[]
})

// Relation records are rendered as product cards below. Remove the legacy
// markdown appendix so the same relationships are not duplicated as text.
const bodyWithoutRelatedProducts = computed(() => String(term.value?.body || '')
  .replace(/\n## (?:محصولات مرتبط پرتو ارتباط صبا|Related Pesaba Products)[\s\S]*$/i, '')
  .trim())

if (!term.value) {
  throw createError({ statusCode: 404, statusMessage: 'Glossary term not found' })
}

if (term.value) {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://pesaba.com').replace(/\/$/, '')
  const termTitle = String(term.value.title || termSlug)
  const canonicalSlug = String(term.value.slug || termSlug)
  const description = term.value.short_definition || `Definition of ${termTitle}.`
  const socialImage = `${siteUrl}/og/glossary/${canonicalSlug}.${locale.value}.png`
  useSeoMeta({
    title: `${termTitle} — ${t('glossary.title')} | Pesaba`,
    description,
    ogTitle: `${termTitle} — ${t('glossary.title')} | Pesaba`,
    ogDescription: description,
    ogImage: socialImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    twitterTitle: `${termTitle} — ${t('glossary.title')} | Pesaba`,
    twitterDescription: description,
    twitterImage: socialImage,
    twitterCard: 'summary_large_image',
  })
  emitGlossaryTerm({ slug: canonicalSlug, title: termTitle, definition: description, locale: locale.value })
  emitBreadcrumbs([{ name: t('glossary.title'), url: `/${locale.value}/glossary` }, { name: termTitle, url: `/${locale.value}/glossary/${canonicalSlug}` }])
}
</script>
