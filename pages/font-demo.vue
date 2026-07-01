<template>
  <div dir="rtl" class="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] py-12 px-6">
    <div class="max-w-4xl mx-auto">

      <h1 class="text-2xl font-bold mb-2 text-center" style="font-family: monospace;">Font Demo — مقایسه فونت‌ها</h1>
      <p class="text-center text-sm text-[var(--text-secondary)] mb-12" style="font-family: monospace;">هر بخش همان متن را با فونت متفاوت نشان می‌دهد</p>

      <div v-for="font in fonts" :key="font.id" class="mb-16 border border-[var(--border)] rounded-2xl overflow-hidden">
        <!-- Font label -->
        <div class="px-5 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border)] flex items-center justify-between">
          <span class="text-xs font-mono text-photon-400 uppercase tracking-widest">{{ font.id }}</span>
          <span class="text-xs text-[var(--text-muted)]">{{ font.note }}</span>
        </div>

        <div class="p-6 md:p-8 space-y-6" :style="`font-family: '${font.family}', 'Vazirmatn', sans-serif;`">

          <!-- Hero headline -->
          <div>
            <p class="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Hero Headline — font-extrabold</p>
            <p class="text-4xl md:text-5xl font-extrabold leading-[1.2]">
              طراحی و ساخت سخت‌افزار برای زیرساخت‌های حیاتی.
            </p>
          </div>

          <!-- Section heading -->
          <div>
            <p class="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Section Heading — font-bold</p>
            <p class="text-2xl md:text-3xl font-bold leading-snug">
              امنیت شبکه‌های صنعتی از سال ۱۳۸۷
            </p>
          </div>

          <!-- Card title -->
          <div>
            <p class="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Card Title — font-semibold</p>
            <p class="text-lg font-semibold">
              دیتا دیود A10 — انتقال یک‌طرفه داده با سرعت ۱ گیگابیت
            </p>
          </div>

          <!-- Body text -->
          <div>
            <p class="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Body — font-normal</p>
            <p class="text-base font-normal leading-relaxed text-[var(--text-secondary)]">
              پرتو ارتباط صبا تجهیزات امنیت شبکه مبتنی بر FPGA طراحی و تولید می‌کند. محصولات ما بدون سیستم‌عامل و با حداقل سطح حمله برای محیط‌های OT و ICS طراحی شده‌اند.
            </p>
          </div>

          <!-- Numbers -->
          <div>
            <p class="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Numbers / Stats</p>
            <div class="flex gap-8">
              <div>
                <p class="text-4xl font-extrabold text-photon-400">۱۹</p>
                <p class="text-sm text-[var(--text-muted)]">محصول</p>
              </div>
              <div>
                <p class="text-4xl font-extrabold text-photon-400">۱۴۰۲</p>
                <p class="text-sm text-[var(--text-muted)]">سال تأسیس</p>
              </div>
              <div>
                <p class="text-4xl font-extrabold text-photon-400">۶</p>
                <p class="text-sm text-[var(--text-muted)]">دسته‌بندی</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const fonts = [
  {
    id: 'IRANYekanX (فعلی)',
    family: 'IRANYekanXFaNum',
    note: 'فونت فعلی پروژه',
  },
  {
    id: 'IRANYekanX FaNum',
    family: 'IRANYekanXFaNum',
    note: 'یکان X با ارقام فارسی — Bold/Regular',
  },
  {
    id: 'FuturaBT',
    family: 'FuturaBT',
    note: 'فونت لاتین پروژه',
  },
]
</script>

<style scoped>
@font-face {
  font-family: 'IRANYekanXFaNum';
  src: url('/fonts/iranyekanx/IRANYekanXFaNum-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  size-adjust: 85%;
}
@font-face {
  font-family: 'IRANYekanXFaNum';
  src: url('/fonts/iranyekanx/IRANYekanXFaNum-Bold.woff2') format('woff2');
  font-weight: 500 900;
  font-display: swap;
  size-adjust: 85%;
}
</style>
