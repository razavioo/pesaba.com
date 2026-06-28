<template>
  <!-- Advenica pattern: dark navy hero, just H1, SVG wedge transitions to light -->
  <section class="page-hero relative overflow-hidden min-h-[430px] md:min-h-[560px] flex flex-col justify-center bg-[#093544]">
    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.04) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

    <!-- Content -->
    <div class="container-wide relative z-20 py-24 md:py-36">
      <h1
        class="max-w-[1050px] text-[clamp(3.1rem,8vw,7.5rem)] font-medium text-[#FCFCFD] leading-[1.08]"
        style="letter-spacing:0;"
      >
        {{ t('home.hero_headline') }}
      </h1>
    </div>

    <div class="absolute end-[6vw] bottom-12 hidden md:block text-[#AAC5D0]/35" aria-hidden="true">
      <svg width="198" height="94" viewBox="0 0 198 94" fill="currentColor">
        <rect v-for="(_, index) in 32" :key="index" :x="(index % 8) * 26" :y="Math.floor(index / 8) * 26" width="16" height="16" rx="1" />
      </svg>
    </div>

    <!-- SVG diagonal wedge -->
    <div class="absolute bottom-0 inset-x-0 z-30 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" class="w-full h-12 md:h-16 block">
        <path d="M0,80 L1440,0 L1440,80 Z" fill="#FFFFFF" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
