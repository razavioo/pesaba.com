<template>
  <div class="content-blocks space-y-12">
    <section v-for="block in blocks" :id="block.anchor" :key="block.id" :class="['scroll-mt-28', blockClasses(block)]">
      <template v-if="block.type === 'hero'">
        <div class="page-hero p-8 md:p-12"><div class="container-site"><p v-if="block.eyebrow" class="label-accent mb-4">{{ block.eyebrow }}</p><h1 class="max-w-4xl text-4xl font-extrabold text-white md:text-6xl">{{ block.title }}</h1><p v-if="block.copy" class="mt-5 max-w-2xl text-lg text-white/75">{{ block.copy }}</p><div v-if="block.primaryCta || block.secondaryCta" class="mt-7 flex flex-wrap gap-3"><BaseButton v-if="block.primaryCta" :to="localPath(block.primaryCta.href)" variant="primary">{{ block.primaryCta.label }}</BaseButton><BaseButton v-if="block.secondaryCta" :to="localPath(block.secondaryCta.href)" variant="outline">{{ block.secondaryCta.label }}</BaseButton></div></div></div>
      </template>
      <template v-else-if="block.type === 'rich_text'"><div class="container-site max-w-4xl"><h2 v-if="block.title" class="section-heading mb-5">{{ block.title }}</h2><CmsMarkdown :source="block.markdown" class="prose-custom" /></div></template>
      <template v-else-if="block.type === 'media_text'"><div class="container-site grid gap-7 lg:grid-cols-2 lg:items-center" :class="block.reverse ? 'lg:[&>*:first-child]:order-2' : ''"><img v-if="assets[block.media.assetId]" :src="assets[block.media.assetId].url" :alt="block.media.alt || assets[block.media.assetId].alt" class="w-full border border-[var(--border)] object-cover"><div><h2 class="section-heading mb-4">{{ block.title }}</h2><p class="whitespace-pre-line leading-relaxed text-[var(--text-secondary)]">{{ block.copy }}</p><BaseButton v-if="block.cta" :to="localPath(block.cta.href)" class="mt-5">{{ block.cta.label }}</BaseButton></div></div></template>
      <template v-else-if="block.type === 'specification_table'"><div class="container-site"><h2 class="section-heading mb-5">{{ block.title }}</h2><div class="overflow-x-auto"><table class="w-full border border-[var(--border)] text-sm"><tbody><tr v-for="spec in block.specs" :key="spec.label"><th class="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-start">{{ spec.label }}</th><td class="border-b border-[var(--border)] px-4 py-3">{{ spec.value }}</td></tr></tbody></table></div></div></template>
      <template v-else-if="block.type === 'download_list'"><div class="container-site"><h2 class="section-heading mb-4">{{ block.title }}</h2><ul class="space-y-3"><li v-for="item in block.downloads" :key="item.label"><a v-if="assets[item.media.assetId]" :href="assets[item.media.assetId].url" target="_blank" rel="noopener" class="text-[var(--accent)] underline">{{ item.label }}</a><span v-if="item.note" class="ms-2 text-sm text-[var(--text-muted)]">{{ item.note }}</span></li></ul></div></template>
      <template v-else-if="block.type === 'faq'"><div class="container-site max-w-4xl"><h2 v-if="block.title" class="section-heading mb-4">{{ block.title }}</h2><FAQItem v-for="item in block.items" :key="item.question" :question="item.question" :answer="item.answer" /></div></template>
      <template v-else-if="block.type === 'notice'"><div class="container-site"><div :class="['border-s-4 p-5', block.tone === 'warning' ? 'border-amber-500 bg-amber-50' : 'border-[var(--accent)] bg-[var(--bg-elevated)]']"><h2 v-if="block.title" class="mb-2 text-lg font-bold">{{ block.title }}</h2><p>{{ block.copy }}</p></div></div></template>
      <template v-else-if="block.type === 'cta'"><CTAStrip :headline="block.title" :sub="block.copy" :primary-label="block.primaryCta.label" :primary-href="localPath(block.primaryCta.href)" :secondary-label="block.secondaryCta?.label" :secondary-href="block.secondaryCta ? localPath(block.secondaryCta.href) : undefined" /></template>
      <template v-else-if="block.type === 'stat_grid'"><div class="container-site"><h2 v-if="block.title" class="section-heading mb-5">{{ block.title }}</h2><div :class="['grid gap-4 sm:grid-cols-2', columnClass(block)]"><div v-for="stat in block.stats" :key="stat.label" class="border border-[var(--border)] p-5"><strong class="block text-3xl text-[var(--accent)]">{{ stat.value }}</strong><span class="mt-2 block text-sm">{{ stat.label }}</span></div></div></div></template>
      <template v-else-if="block.type === 'card_grid'"><div class="container-site"><h2 class="section-heading mb-5">{{ block.title }}</h2><div :class="['grid gap-4 md:grid-cols-2', columnClass(block)]"><article v-for="card in block.cards" :key="card.title" class="border border-[var(--border)] p-5"><h3 class="mb-2 text-lg font-bold">{{ card.title }}</h3><p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ card.copy }}</p><BaseButton v-if="card.cta" :to="localPath(card.cta.href)" size="sm" class="mt-4">{{ card.cta.label }}</BaseButton></article></div></div></template>
      <template v-else-if="block.type === 'collection' || block.type === 'related_links'"><div class="container-site"><h2 class="section-heading mb-5">{{ block.title }}</h2><div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><NuxtLink v-for="item in links(block)" :key="item.id" :to="localPath(item.path)" class="border border-[var(--border)] p-5 transition hover:border-[var(--accent)]"><h3 class="font-bold">{{ item.title }}</h3><p class="mt-2 text-sm text-[var(--text-secondary)]">{{ item.description }}</p></NuxtLink></div></div></template>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ContentBlock } from '@pesaba/cms-contracts'
import type { PublicContentReference, PublicMedia } from '~/composables/usePublicCmsV2'
const props = defineProps<{ blocks: ContentBlock[]; locale: 'fa' | 'en' }>()
const localePath = useLocalePath(); const { media, references } = usePublicCmsV2()
const scan = (key: 'assetId' | 'contentId') => { const found = new Set<string>(); const visit = (value: unknown) => { if (!value || typeof value !== 'object') return; if (Array.isArray(value)) return value.forEach(visit); const item = value as Record<string, unknown>; if (typeof item[key] === 'string' && item[key]) found.add(item[key] as string); Object.values(item).forEach(visit) }; visit(props.blocks); return [...found] }
const mediaIds = computed(() => scan('assetId')); const contentIds = computed(() => scan('contentId'))
const { data: mediaList } = await useAsyncData(() => `block-media-${mediaIds.value.join('-')}-${props.locale}`, () => Promise.all(mediaIds.value.map(id => media(id, props.locale).catch(() => null))), { watch: [mediaIds, () => props.locale] })
const { data: referenceList } = await useAsyncData(() => `block-references-${contentIds.value.join('-')}-${props.locale}`, () => references(contentIds.value, props.locale), { watch: [contentIds, () => props.locale] })
const assets = computed<Record<string, PublicMedia>>(() => Object.fromEntries((mediaList.value || []).filter((item): item is PublicMedia => Boolean(item)).map(item => [item.id, item])))
const byId = computed<Record<string, PublicContentReference>>(() => Object.fromEntries((referenceList.value || []).map((item: PublicContentReference) => [item.id, item])))
function links(block: Extract<ContentBlock, { type: 'collection' | 'related_links' }>) { const ids = block.type === 'collection' ? block.items.map(item => item.contentId) : block.items.flatMap(item => item.target?.contentId ? [item.target.contentId] : []); return ids.map(id => byId.value[id]).filter(Boolean) }
function localPath(path: string) { return /^(?:https?:|mailto:|tel:|#)/.test(path) ? path : localePath(path) }
function blockClasses(block: ContentBlock) { const design = block.design as { variant?: string; surface?: string; width?: string; align?: string; spacing?: string } | undefined; return [`block-surface-${design?.surface || 'default'}`, `block-width-${design?.width || 'default'}`, `block-align-${design?.align || 'start'}`, `block-spacing-${design?.spacing || 'normal'}`, `block-variant-${design?.variant || 'standard'}`] }
function columnClass(block: ContentBlock) { return ({ '2': 'lg:grid-cols-2', '3': 'lg:grid-cols-3', '4': 'lg:grid-cols-4', auto: 'lg:grid-cols-3' }[block.design?.columns || 'auto']) }
</script>

<style scoped>
.block-surface-muted { background: var(--bg-elevated); }
.block-surface-dark { background: #093544; color: white; }
.block-surface-accent { background: #eff7f9; }
.block-spacing-compact { padding-block: 1rem; }
.block-spacing-generous { padding-block: 2rem; }
.block-width-narrow :deep(.container-site) { max-width: 56rem; }
.block-width-wide :deep(.container-site) { max-width: 90rem; }
.block-align-center :deep(.container-site) { text-align: center; }
.block-variant-feature :deep(article), .block-variant-feature :deep(table) { border-color: #1f7994; box-shadow: 0 10px 24px rgb(9 53 68 / .08); }
.block-variant-compact :deep(article) { padding: .9rem; }
</style>
