<template>
  <main v-if="document"><p class="bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">{{ locale === 'fa' ? 'پیش‌نمایش خصوصی — این صفحه منتشر و قابل ایندکس نیست.' : 'Private preview — this page is not published or indexable.' }}</p><ContentBlocks :blocks="document.translation.blocks" :locale="locale === 'fa' ? 'fa' : 'en'" /></main>
</template>

<script setup lang="ts">
defineI18nRoute(false)
const route = useRoute(); const { locale } = useI18n(); const { get } = usePublicCmsV2()
const token = computed(() => typeof route.query.token === 'string' ? route.query.token : '')
const { data: document } = await useAsyncData(`preview-${route.params.id}-${locale.value}`, () => token.value ? get('page', String(route.params.id), locale.value as 'fa' | 'en', token.value) : Promise.resolve(null), { watch: [locale, token] })
if (!document.value) throw createError({ statusCode: 404, statusMessage: 'Preview not found' })
useSeoMeta({ robots: 'noindex, nofollow, noarchive', title: 'Private content preview' })
</script>
