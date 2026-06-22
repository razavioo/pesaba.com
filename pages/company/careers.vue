<template>
  <div v-if="doc">
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'همکاری با پرتو ارتباط صبا' : 'Careers' }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.02em] text-[var(--text-primary)] md:text-5xl">{{ doc.title }}</h1>
          <p class="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">{{ doc.sub }}</p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <div class="label-meta mb-5">{{ $t('careers.why_title') }}</div>
          <ul class="space-y-4">
            <li v-for="item in doc.reasons" :key="item" class="list-dot">{{ item }}</li>
          </ul>
        </div>
        <div class="border-s border-[var(--border)] ps-8">
          <div class="label-meta mb-4">{{ $t('careers.open_positions') }}</div>
          <p class="mb-2 text-lg font-semibold text-[var(--text-primary)]">{{ $t('careers.no_openings') }}</p>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ $t('careers.no_openings_sub') }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <div class="label-meta mb-4">{{ $t('careers.send_cv') }}</div>
          <p class="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{{ $t('careers.send_cv_sub') }}</p>
          <a href="mailto:admin@pesaba.com" class="text-base font-medium text-[#1F7994] hover:text-[#AAC5D0]">admin@pesaba.com</a>
        </div>
        <div>
          <div class="label-meta mb-4">{{ locale === 'fa' ? 'حوزه‌های مورد علاقه' : 'Typical focus areas' }}</div>
          <ul class="grid gap-2 sm:grid-cols-2">
            <li v-for="area in doc.areas" :key="area" class="text-sm text-[var(--text-secondary)] border-b border-[var(--border)] pb-2">
              {{ area }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const { data: doc } = await useAsyncData(`careers-${locale.value}`, async () => {
  const all = await queryContent('company').where({ _file: { $contains: 'careers' } }).find()
  return all.find(d => d.locale === locale.value) ?? all[0] ?? null
})
useSeoMeta({ title: doc.value?.seo_title ?? `${t('careers.open_positions')} | Pesaba`, description: doc.value?.seo_desc })
</script>
