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
      <div class="prose-article"><ContentRenderer :value="term" /></div>
      <div class="mt-12 pt-8 border-t border-ink-700/50">
        <NuxtLink :to="localePath('/glossary')" class="text-sm text-[#1F7994] hover:text-[#AAC5D0] transition-colors">{{ $t('glossary.all_terms') }}</NuxtLink>
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
const { data: term } = await useAsyncData(`glossary-${termSlug}-${locale.value}`, () => queryContent('glossary').where({ slug: termSlug, locale: locale.value }).findOne())

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
