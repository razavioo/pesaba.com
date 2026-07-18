<template>
  <div v-if="v2Document">
    <ContentBlocks :blocks="v2Document.translation.blocks" :locale="locale === 'fa' ? 'fa' : 'en'" />
  </div>
  <div v-else-if="doc">
    <ImageHero
      :image="typeof doc?.heroImage === 'string' ? doc.heroImage : '/images/heroes/careers-hero.png'"
      :image-alt="locale === 'fa' ? 'مهندس در حال آزمایش برد امنیت شبکه در آزمایشگاه' : 'Engineer testing a network security board in a laboratory'"
      :eyebrow="locale === 'fa' ? 'همکاری با پرتو ارتباط صبا' : 'Careers at Pesaba'"
      :title="locale === 'fa' ? 'در ساختن امنیت سخت‌افزاری همراه ما باشید' : (doc.title ?? 'Careers')"
      :description="doc.sub ?? ''"
      theme="people"
    />

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
const { get } = usePublicCms()
const { get: getV2 } = usePublicCmsV2()
const { data: v2Document } = await useAsyncData(`careers-v2-${locale.value}`, () => getV2('company', 'careers', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const { data: doc } = await useAsyncData(`careers-${locale.value}`, () => get('company', 'careers', locale.value as 'fa' | 'en'), { watch: [locale] })
useSeoMeta({ title: doc.value?.seoTitle ?? `${t('careers.open_positions')} | Pesaba`, description: doc.value?.seoDescription })
</script>
