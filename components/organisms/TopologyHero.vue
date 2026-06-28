<template>
  <!-- Advenica pattern: dark navy hero, just H1, SVG wedge transitions to light -->
  <section class="page-hero relative overflow-hidden min-h-[440px] md:min-h-[520px] flex flex-col justify-center bg-[#093544]">
    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.04) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />

    <!-- Content -->
    <div class="container-site relative z-20 py-20 md:py-32">
      <h1
        class="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-white leading-[1.08] max-w-3xl"
        style="letter-spacing: -0.02em;"
      >
        {{ t('home.hero_headline') }}
      </h1>
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
