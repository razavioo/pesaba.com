<template>
  <div>
    <section class="page-hero relative">
      <div class="container-site section-hero relative z-10">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'سناریوهای استقرار' : 'Deployment Scenarios' }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] text-white md:text-5xl">
            {{ locale === 'fa' ? 'راهکارها بر اساس مسئله عملیاتی' : 'Solutions by operational problem' }}
          </h1>
          <p class="max-w-3xl text-lg leading-relaxed text-white/70">
            {{ locale === 'fa'
              ? 'مسئله‌ای را که می‌خواهید حل کنید انتخاب کنید تا نتیجه مورد انتظار، راهکار مناسب و محصولات مرتبط را ببینید.'
              : 'Choose a scenario to review the recommended architecture, technical advantage, and matching Pesaba platforms.' }}
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="item in useCases"
          :key="item.slug"
          :to="localePath(`/use-cases/${item.slug}`)"
          class="product-card group overflow-hidden"
        >
          <div class="aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <NuxtImg
              :src="item.image"
              :alt="item.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <div class="p-5">
            <div class="label-meta mb-3">{{ locale === 'fa' ? 'کاربرد' : 'Use case' }}</div>
            <h2 class="mb-2 text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994]">
              {{ item.title }}
            </h2>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => locale.value === 'fa' ? 'سناریوهای استقرار | Pesaba' : 'Use Cases | Pesaba',
  description: () => locale.value === 'fa'
    ? 'سناریوهای استقرار محصولات پرتو ارتباط صبا برای زیرساخت حیاتی، شبکه صنعتی، رمزنگاری و پایش سلولی.'
    : 'Deployment scenarios for Pesaba platforms across critical infrastructure, industrial networks, encryption, and cellular monitoring.',
})

const { list } = usePublicCms()
const fallbackImages: Record<string, string> = {
  'one-way-data-transfer': '/images/use-cases/one-way-data-transfer.png', 'ot-it-segmentation': '/images/use-cases/ot-it-segmentation.png', 'aes-256-network-encryption': '/images/use-cases/network-encryption-hero.png', 'cellular-quality-monitoring': '/images/use-cases/cellular-quality-monitoring.png', 'scada-isolation': '/images/use-cases/scada-isolation.png', 'water-toxicity-monitoring': '/images/use-cases/water-toxicity-monitoring.png',
}
const { data: records } = await useAsyncData('use-case-index', () => list('use_case', locale.value as 'fa' | 'en'), { watch: [locale] })
const useCases = computed(() => (records.value || []).map(item => ({ ...item, image: typeof item.image === 'string' ? item.image : typeof item.hero_image === 'string' ? item.hero_image : fallbackImages[item.slug] || '/images/use-cases/one-way-data-transfer.png' })))
</script>
