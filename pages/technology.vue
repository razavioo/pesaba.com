<template>
  <div>
    <section class="page-hero" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <!-- Background image overlay on dark navy -->
      <div class="absolute inset-0 opacity-20" :style="heroImgStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.06) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

      <div class="container-site section-hero relative z-10 py-16 lg:py-24">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <div class="section-label mb-5" style="color:#AAC5D0">{{ $t('nav.technology') }}</div>
            <h1 class="mb-5 max-w-4xl border-s-2 border-[#AAC5D0]/40 ps-4 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white md:text-6xl">
              {{ $t('technology.headline') }}
            </h1>
            <p class="max-w-3xl text-lg leading-relaxed text-white/70">
              {{ $t('technology.sub') }}
            </p>
          </div>
          <div class="border border-white/15 bg-white/8 backdrop-blur-md p-5">
            <div class="label-meta mb-2" style="color:#AAC5D0">{{ $t('technology.architecture_summary_label') }}</div>
            <p class="text-sm leading-relaxed text-white/65">
              {{ $t('technology.architecture_summary') }}
            </p>
          </div>
        </div>
      </div>

      <!-- SVG wedge to white -->
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div class="mb-8 flex items-end justify-between gap-6">
          <div>
            <div class="section-label mb-3">{{ $t('technology.design_principles_label') }}</div>
            <h2 class="section-heading text-[var(--text-primary)]">{{ $t('technology.design_principles_title') }}</h2>
          </div>
        </div>
        <div class="divide-y divide-[var(--border)]">
          <div v-for="pillar in pillars" :key="pillar.title" class="flex items-start gap-5 py-5 first:pt-0 last:pb-0">
            <component :is="pillar.icon" class="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <div>
              <h3 class="mb-1 text-sm font-semibold text-[var(--text-primary)]">{{ pillar.title }}</h3>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ pillar.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SVG wedge: white → blue-pale -->
    <div class="w-full overflow-hidden leading-none" aria-hidden="true" style="background:var(--bg-page)">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" class="w-full h-10 block"><path d="M0,0 L1440,48 L0,48 Z" fill="var(--bg-elevated)"/></svg>
    </div>

    <section class="section bg-[var(--bg-elevated)]">
      <div class="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
        <div class="overflow-hidden border border-[var(--border)]">
          <NuxtImg
            :src="technologyData.airGapImage"
            :alt="$t('technology.air_gap_alt')"
            class="h-72 w-full object-cover object-center lg:h-96"
            loading="lazy"
          />
        </div>
        <div>
          <div class="section-label mb-3">{{ $t('technology.data_architecture_label') }}</div>
          <h2 class="section-heading mb-4 text-[var(--text-primary)]">{{ $t('technology.data_architecture_title') }}</h2>
          <p class="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ $t('technology.data_architecture_desc') }}
          </p>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="proof in proofs" :key="proof.title" class="border border-[var(--border)] bg-[var(--bg-page)] p-4">
              <div class="label-meta mb-1">{{ proof.label }}</div>
              <h3 class="mb-1 text-sm font-semibold text-[var(--text-primary)]">{{ proof.title }}</h3>
              <p class="text-xs leading-relaxed text-[var(--text-secondary)]">{{ proof.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SVG wedge: blue-pale → deep navy -->
    <div class="w-full overflow-hidden leading-none" aria-hidden="true" style="background:var(--bg-elevated)">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" class="w-full h-10 block"><path d="M1440,0 L0,48 L1440,48 Z" fill="#093544"/></svg>
    </div>

    <section class="section bg-[#093544] pb-6 md:pb-8">
      <div class="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div class="section-label mb-3" style="color:#AAC5D0">{{ $t('technology.network_filtering_label') }}</div>
          <h2 class="section-heading mb-4 text-white">{{ $t('technology.network_filtering_title') }}</h2>
          <p class="text-sm leading-relaxed text-white/65">
            {{ $t('technology.network_filtering_desc') }}
          </p>
        </div>
        <div class="overflow-hidden border border-white/15">
          <NuxtImg
            :src="technologyData.filteringImage"
            :alt="$t('technology.network_filtering_alt')"
            class="h-72 w-full object-cover object-center lg:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <CTAStrip :headline="$t('technology.compare_headline')" :sub="$t('technology.compare_desc')" :primary-label="$t('footer.compare_products')" :primary-href="localePath('/products/compare')" :secondary-label="$t('trust.title')" :secondary-href="localePath('/trust')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { withBase } = useBaseUrl()
const { get } = usePublicCms()
type TechnologyPageData = {
  heroImage?: string
  airGapImage?: string
  filteringImage?: string
}

const { data: technologyPage } = await useAsyncData('technology-page', () => get('page', 'technology', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const technologyData = computed(() => {
  const data = technologyPage.value as TechnologyPageData | null
  return {
    heroImage: data?.heroImage || '/images/technology/technology-hero.png',
    airGapImage: data?.airGapImage || '/images/technology/air-gap-concept.png',
    filteringImage: data?.filteringImage || '/images/technology/network-filtering.png',
  }
})

const heroImgStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'center'
  return `background-image: url('${withBase(technologyData.value.heroImage)}'); background-size: cover; background-position: ${position};`
})

useSeoMeta({
  title: `${t('nav.technology')} | Pesaba`,
  description: 'FPGA-native design principles, OS-less architecture, and hardware trust decisions behind Pesaba products.',
})

const pillars = computed(() => [
  { icon: resolveComponent('IconFpgaChip'), title: t('technology.pillar_fpga_title'), desc: t('technology.pillar_fpga_desc') },
  { icon: resolveComponent('IconAesLock'), title: t('technology.pillar_osless_title'), desc: t('technology.pillar_osless_desc') },
  { icon: resolveComponent('IconArrowOneWay'), title: t('technology.pillar_oneway_title'), desc: t('technology.pillar_oneway_desc') },
  { icon: resolveComponent('IconMadeInIran'), title: t('technology.pillar_local_title'), desc: t('technology.pillar_local_desc') },
])

const proofs = computed(() => [1, 2, 3].map((n) => ({
  label: t(`technology.proof_${n}_label`), title: t(`technology.proof_${n}_title`), desc: t(`technology.proof_${n}_desc`),
})))
</script>
