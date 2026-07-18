<template>
  <div v-if="v2Document">
    <ContentBlocks :blocks="v2Document.translation.blocks" :locale="locale === 'fa' ? 'fa' : 'en'" />
  </div>
  <div v-else-if="doc">
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'رسانه و مطبوعات' : 'Press' }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.02em] text-[var(--text-primary)] md:text-5xl">{{ doc.title }}</h1>
          <p class="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">{{ doc.sub }}</p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="max-w-4xl prose text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-a:text-[#1F7994]">
          <CmsMarkdown :source="String(doc.body || '')" />
        </div>
        <div class="border-s border-[var(--border)] ps-6">
          <div class="label-meta mb-5">{{ $t('press.key_facts') }}</div>
          <dl class="space-y-5">
            <div v-for="fact in doc.facts" :key="fact.label">
              <dt class="label-meta mb-1">{{ fact.label }}</dt>
              <dd class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ fact.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { get } = usePublicCms()
const { get: getV2 } = usePublicCmsV2()
const { data: v2Document } = await useAsyncData(`press-v2-${locale.value}`, () => getV2('company', 'press', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const { data: doc } = await useAsyncData(`press-${locale.value}`, () => get('company', 'press', locale.value as 'fa' | 'en'), { watch: [locale] })
useSeoMeta({ title: doc.value?.seoTitle ?? 'Press | Pesaba', description: doc.value?.seoDescription })
</script>
