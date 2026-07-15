<template>
  <div>
    <ImageHero
      :image="pageData.heroImage"
      :image-alt="locale === 'fa' ? 'مرکز کنترل و زیرساخت شبکه صنعتی' : 'Industrial control room and critical network infrastructure'"
      :eyebrow="locale === 'fa' ? 'صنایع و زیرساخت‌های حیاتی' : 'Industries and critical infrastructure'"
      :title="locale === 'fa' ? 'راهکارهای امنیتی برای شبکه‌های حساس' : 'Sector-specific solutions for sensitive networks'"
      :description="$t('industries.sub')"
      theme="industrial"
    />

    <section class="section border-b border-[var(--border)]">
      <div class="container-site">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="(industry, i) in industries"
            :key="industry.slug"
            :to="localePath(`/industries/${industry.slug}`)"
            class="product-card overflow-hidden"
            :class="{ 'md:col-span-2 xl:col-span-1': i === 0 }"
          >
            <div class="aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
              <NuxtImg :src="industry.image" :alt="industry.title" class="h-full w-full object-cover" loading="lazy" />
            </div>
            <div class="p-5">
              <div class="label-meta mb-2">{{ industry.badge || (locale === 'fa' ? 'صنعت' : 'Industry') }}</div>
              <h2 class="mb-2 text-xl font-semibold text-[var(--text-primary)]">{{ industry.title }}</h2>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ industry.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <CTAStrip
:headline="locale === 'fa' ? 'برای سناریوی شما چه چیزی مناسب است؟' : 'Need help mapping the right architecture?'"
      :sub="locale === 'fa' ? 'تیم فروش فنی پرتو ارتباط صبا می‌تواند سناریوی استقرار، حدود اعتماد و گزینه‌های محصول را با شما مرور کند.' : 'Pesaba sales engineering can map your deployment pattern, trust boundary, and product fit.'"
      :primary-label="$t('nav.talk_to_sales')" :primary-href="localePath('/company/contact')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { get, list } = usePublicCms()
const { data: page } = await useAsyncData('industries-page', () => get('page', 'industries', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const pageData = computed(() => {
  const data = page.value as { heroImage?: string } | null
  return { heroImage: data?.heroImage || '/images/heroes/industries-hero.png' }
})

useSeoMeta({ title: `${t('nav.solutions')} | Pesaba`, description: 'Pesaba network security solutions for utilities, telecom, government, manufacturing, and critical infrastructure.' })

const fallbackImages: Record<string, string> = { 'banking-finance': '/images/industries/banking-finance.png', government: '/images/industries/government.png', manufacturing: '/images/industries/manufacturing.png', 'oil-and-gas': '/images/industries/oil-and-gas.png', 'power-grid': '/images/industries/power-grid.webp', 'telecom-operators': '/images/industries/telecom-operators.png', 'water-utilities': '/images/industries/water-utilities.webp' }
const { data: records } = await useAsyncData('industry-index', () => list('industry', locale.value as 'fa' | 'en'), { watch: [locale] })
const industries = computed(() => (records.value || []).map(item => ({ ...item, desc: item.description, badge: typeof item.badge === 'string' ? item.badge : '', image: typeof item.image === 'string' ? item.image : fallbackImages[item.slug] || '/images/industries/power-grid.webp' })))
</script>
