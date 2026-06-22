<template>
  <!-- Advenica-signature: sector cards with B&W → color hover transition -->
  <section class="industries-section">
    <div class="container-site">
      <div class="industries-grid">
        <NuxtLink
          v-for="sector in sectors"
          :key="sector.to"
          :to="localePath(sector.to)"
          class="sector-card group"
          :aria-label="sector.title"
          :style="{
            '--hover-bg-from': sector.hoverBgFrom,
            '--hover-bg-via': sector.hoverBgVia,
            '--hover-bg-to': sector.hoverBgTo,
            '--hover-border': sector.hoverBorder,
            '--hover-tag': sector.hoverTag
          }"
        >
          <!-- Image with grayscale-to-color transition -->
          <div class="sector-card__image">
            <NuxtImg
              :src="sector.image"
              :alt="sector.title"
              class="sector-card__img"
              loading="lazy"
              width="600"
              height="400"
            />
            <!-- Color overlay — same image, clipped via opacity transition -->
            <div class="sector-card__color-overlay" />
          </div>

          <!-- Dark gradient overlay -->
          <div class="sector-card__overlay" />

          <!-- Hover color gradient overlay -->
          <div class="sector-card__hover-overlay" />

          <!-- Content -->
          <div class="sector-card__content">
            <div class="sector-card__tag">{{ sector.tag }}</div>
            <h3 class="sector-card__title">{{ sector.title }}</h3>
            <p class="sector-card__desc">{{ sector.desc }}</p>
            <span class="sector-card__arrow" aria-hidden="true">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const sectors = computed(() => locale.value === 'fa' ? [
  {
    tag: 'شبکه برق',
    title: 'شبکه برق و انرژی',
    desc: 'حفاظت از سیستم‌های کنترل در صنعت برق با مرزبندی سخت‌افزاری',
    image: '/images/industries/power-grid.png',
    to: '/industries/power-grid',
    hoverBgFrom: 'rgba(180, 83, 9, 0.9)',
    hoverBgVia: 'rgba(180, 83, 9, 0.4)',
    hoverBgTo: 'rgba(180, 83, 9, 0.05)',
    hoverBorder: 'rgba(245, 158, 11, 0.6)',
    hoverTag: '#F59E0B',
  },
  {
    tag: 'مخابرات',
    title: 'اپراتورهای مخابراتی',
    desc: 'رمزنگاری و یکپارچه‌سازی شبکه اپراتوری با راهکارهای سخت‌افزاری',
    image: '/images/industries/telecom-operators.png',
    to: '/industries/telecom-operators',
    hoverBgFrom: 'rgba(14, 116, 144, 0.9)',
    hoverBgVia: 'rgba(14, 116, 144, 0.4)',
    hoverBgTo: 'rgba(14, 116, 144, 0.05)',
    hoverBorder: 'rgba(6, 182, 212, 0.6)',
    hoverTag: '#06B6D4',
  },
  {
    tag: 'دولتی',
    title: 'سازمان‌های دولتی',
    desc: 'تأمین امنیت شبکه‌های حساس دولتی با راهکارهای قابل ممیزی',
    image: '/images/industries/government.png',
    to: '/industries/government',
    hoverBgFrom: 'rgba(153, 27, 27, 0.9)',
    hoverBgVia: 'rgba(153, 27, 27, 0.4)',
    hoverBgTo: 'rgba(153, 27, 27, 0.05)',
    hoverBorder: 'rgba(239, 68, 68, 0.6)',
    hoverTag: '#EF4444',
  },
  {
    tag: 'آب و محیط‌زیست',
    title: 'زیرساخت آب و محیط‌زیست',
    desc: 'پایش بلادرنگ کیفیت آب و تشخیص زودهنگام آلودگی',
    image: '/images/industries/water-utilities.png',
    to: '/use-cases/water-toxicity-monitoring',
    hoverBgFrom: 'rgba(15, 118, 110, 0.9)',
    hoverBgVia: 'rgba(15, 118, 110, 0.4)',
    hoverBgTo: 'rgba(15, 118, 110, 0.05)',
    hoverBorder: 'rgba(20, 184, 166, 0.6)',
    hoverTag: '#14B8A6',
  },
] : [
  {
    tag: 'Power Grid',
    title: 'Power & Energy',
    desc: 'Protect control systems in the power sector with hardware-enforced network boundaries',
    image: '/images/industries/power-grid.png',
    to: '/industries/power-grid',
    hoverBgFrom: 'rgba(180, 83, 9, 0.9)',
    hoverBgVia: 'rgba(180, 83, 9, 0.4)',
    hoverBgTo: 'rgba(180, 83, 9, 0.05)',
    hoverBorder: 'rgba(245, 158, 11, 0.6)',
    hoverTag: '#F59E0B',
  },
  {
    tag: 'Telecom',
    title: 'Telecom Operators',
    desc: 'Carrier-grade encryption and network integration for telecom operators',
    image: '/images/industries/telecom-operators.png',
    to: '/industries/telecom-operators',
    hoverBgFrom: 'rgba(14, 116, 144, 0.9)',
    hoverBgVia: 'rgba(14, 116, 144, 0.4)',
    hoverBgTo: 'rgba(14, 116, 144, 0.05)',
    hoverBorder: 'rgba(6, 182, 212, 0.6)',
    hoverTag: '#06B6D4',
  },
  {
    tag: 'Government',
    title: 'Government & Defense',
    desc: 'Secure sensitive government networks with auditable hardware solutions',
    image: '/images/industries/government.png',
    to: '/industries/government',
    hoverBgFrom: 'rgba(153, 27, 27, 0.9)',
    hoverBgVia: 'rgba(153, 27, 27, 0.4)',
    hoverBgTo: 'rgba(153, 27, 27, 0.05)',
    hoverBorder: 'rgba(239, 68, 68, 0.6)',
    hoverTag: '#EF4444',
  },
  {
    tag: 'Water & Environment',
    title: 'Water & Critical Infrastructure',
    desc: 'Real-time water quality monitoring with early anomaly detection and alerting',
    image: '/images/industries/water-utilities.png',
    to: '/use-cases/water-toxicity-monitoring',
    hoverBgFrom: 'rgba(15, 118, 110, 0.9)',
    hoverBgVia: 'rgba(15, 118, 110, 0.4)',
    hoverBgTo: 'rgba(15, 118, 110, 0.05)',
    hoverBorder: 'rgba(20, 184, 166, 0.6)',
    hoverTag: '#14B8A6',
  },
])
</script>

<style scoped>
.industries-section {
  background: transparent;
  position: relative;
  z-index: 40;
  margin-top: -3.5rem;
  margin-bottom: 2.5rem;
}

@media (min-width: 768px) {
  .industries-section {
    margin-top: -6rem;
    margin-bottom: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .industries-section {
    margin-top: -8rem;
    margin-bottom: 4.5rem;
  }
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .industries-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 639px) {
  .industries-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

/* Sector card */
.sector-card {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 3/4;
  cursor: pointer;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s ease,
              box-shadow 0.4s ease;
}

@media (min-width: 1024px) {
  .sector-card {
    aspect-ratio: 2/3;
  }
}

.sector-card:hover {
  transform: translateY(-6px);
  border-color: var(--hover-border);
  box-shadow: 0 12px 30px -10px var(--hover-bg-from),
              0 0 0 1px var(--hover-border);
}

/* Image container */
.sector-card__image {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Base image — starts grayscale, reveals color on hover */
.sector-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(100%) contrast(0.95) brightness(0.9);
  transition: filter 0.65s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.sector-card:hover .sector-card__img {
  filter: grayscale(0%) contrast(1) brightness(1);
  transform: scale(1.04);
}

/* Subtle color tint overlay (fade out on hover, revealing true colors underneath) */
.sector-card__color-overlay {
  position: absolute;
  inset: 0;
  background: rgba(9, 53, 68, 0.2);
  transition: opacity 0.65s ease;
}

.sector-card:hover .sector-card__color-overlay {
  opacity: 0;
}

/* Dark gradient for text readability */
.sector-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(4, 7, 13, 0.90) 0%,
    rgba(4, 7, 13, 0.45) 45%,
    rgba(4, 7, 13, 0.05) 100%
  );
  transition: opacity 0.4s ease;
}

/* Hover color gradient overlay */
.sector-card__hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--hover-bg-from) 0%,
    var(--hover-bg-via) 50%,
    var(--hover-bg-to) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.sector-card:hover .sector-card__hover-overlay {
  opacity: 1;
}

/* Content anchored to bottom */
.sector-card__content {
  position: absolute;
  inset-inline-start: 0;
  inset-inline-end: 0;
  bottom: 0;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.sector-card__tag {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(170, 197, 208, 0.8);
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.sector-card:hover .sector-card__tag {
  color: var(--hover-tag);
}

.sector-card__title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
}

@media (min-width: 768px) {
  .sector-card__title {
    font-size: 1.25rem;
  }
}

.sector-card__desc {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.4s ease;
}

.sector-card:hover .sector-card__desc {
  max-height: 5rem;
  opacity: 1;
}

.sector-card__arrow {
  display: inline-flex;
  color: rgba(255, 255, 255, 0.4);
  transform: translateX(-4px);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease, color 0.3s ease;
  margin-top: 0.25rem;
}

[dir="rtl"] .sector-card__arrow {
  transform: scaleX(-1) translateX(-4px);
}

.sector-card:hover .sector-card__arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--hover-tag);
}

[dir="rtl"] .sector-card:hover .sector-card__arrow {
  transform: scaleX(-1) translateX(0);
}
</style>
