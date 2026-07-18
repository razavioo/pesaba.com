<template>
  <main v-if="document">
    <ContentBlocks :blocks="document.translation.blocks" :locale="contentLocale" />
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const contentLocale = computed(() => locale.value as 'fa' | 'en')
const { getPageByPath } = usePublicCmsV2()
const path = computed(() => `/${(Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug]).filter(Boolean).join('/')}`)
const { data: document } = await useAsyncData(() => `managed-page-${locale.value}-${path.value}`, () => getPageByPath(path.value, locale.value as 'fa' | 'en').catch(() => null), { watch: [locale, path] })

if (!document.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

useSeoMeta({
  title: () => document.value?.translation.seoTitle || document.value?.translation.title || '',
  description: () => document.value?.translation.seoDescription || document.value?.translation.description || '',
})
</script>
