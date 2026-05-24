<template>
  <div v-if="term" class="min-h-screen">
    <div class="container-site pt-6 pb-2">
      <nav class="flex items-center gap-2 text-xs text-ink-500" :aria-label="$t('common.breadcrumb')">
        <NuxtLink :to="localePath('/glossary')" class="hover:text-ink-300 transition-colors">{{ $t('glossary.title') }}</NuxtLink>
        <span>/</span>
        <span class="text-ink-300" dir="ltr">{{ term.title }}</span>
      </nav>
    </div>
    <div class="container-prose py-12 lg:py-16 mx-auto px-6">
      <div class="mb-10">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <BaseBadge color="photon">{{ $t('glossary.term') }}</BaseBadge>
          <span v-if="term.category" class="text-xs text-ink-500 font-mono">{{ term.category }}</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-ink-100 mb-3 leading-tight" style="letter-spacing: -0.02em;" dir="ltr">{{ term.title }}</h1>
        <p v-if="term.title_fa" class="text-2xl font-bold text-ink-400 mb-6" dir="rtl" style="font-family: 'IRANYekanX', sans-serif;">{{ term.title_fa }}</p>
        <p v-if="term.short_definition" class="text-lg text-ink-300 leading-relaxed border-l-2 border-photon-500/30 ps-4">{{ term.short_definition }}</p>
      </div>
      <div class="prose-article"><ContentRenderer :value="term" /></div>
      <div class="mt-12 pt-8 border-t border-ink-700/50">
        <NuxtLink :to="localePath('/glossary')" class="text-sm text-photon-500 hover:text-photon-400 transition-colors">{{ $t('glossary.all_terms') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { emitGlossaryTerm, emitBreadcrumbs } = useSchemaOrg()
const { data: term } = await useAsyncData(`glossary-${route.params.slug}-${locale.value}`, () => queryContent('glossary').where({ slug: route.params.slug as string, locale: locale.value }).findOne())
if (term.value) {
  useSeoMeta({ title: `${term.value.title} — ${t('glossary.title')} | Pesaba`, description: term.value.short_definition || `Definition of ${term.value.title}.`, ogImage: `https://pesaba.com/og/glossary/${term.value.slug}`, twitterCard: 'summary_large_image' })
  emitGlossaryTerm({ name: term.value.title, description: term.value.short_definition || '', url: `/${locale.value}/glossary/${term.value.slug}` })
  emitBreadcrumbs([{ name: t('glossary.title'), url: `/${locale.value}/glossary` }, { name: term.value.title, url: `/${locale.value}/glossary/${term.value.slug}` }])
}
</script>