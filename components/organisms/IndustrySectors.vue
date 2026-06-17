<template>
  <!-- Advenica-signature: sector cards with B&W → color hover transition -->
  <section class="industries-section">
    <div class="container-site py-1">
      <div class="industries-grid">
        <NuxtLink
          v-for="sector in sectors"
          :key="sector.to"
          :to="localePath(sector.to)"
          class="sector-card group"
          :aria-label="sector.title"
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
  },
  {
    tag: 'مخابرات',
    title: 'اپراتورهای مخابراتی',
    desc: 'رمزنگاری و یکپارچه‌سازی شبکه اپراتوری با راهکارهای سخت‌افزاری',
    image: '/images/industries/telecom-operators.png',
    to: '/industries/telecom-operators',
  },
  {
    tag: 'دولتی',
    title: 'سازمان‌های دولتی',
    desc: 'تأمین امنیت شبکه‌های حساس دولتی با راهکارهای قابل ممیزی',
    image: '/images/industries/government.png',
    to: '/industries/government',
  },
  {
    tag: 'آب و محیط‌زیست',
    title: 'زیرساخت آب و محیط‌زیست',
    desc: 'پایش بلادرنگ کیفیت آب و تشخیص زودهنگام آلودگی',
    image: '/images/industries/water-utilities.png',
    to: '/use-cases/water-toxicity-monitoring',
  },
] : [
  {
    tag: 'Power Grid',
    title: 'Power & Energy',
    desc: 'Protect control systems in the power sector with hardware-enforced network boundaries',
    image: '/images/industries/power-grid.png',
    to: '/industries/power-grid',
  },
  {
    tag: 'Telecom',
    title: 'Telecom Operators',
    desc: 'Carrier-grade encryption and network integration for telecom operators',
    image: '/images/industries/telecom-operators.png',
    to: '/industries/telecom-operators',
  },
  {
    tag: 'Government',
    title: 'Government & Defense',
    desc: 'Secure sensitive government networks with auditable hardware solutions',
    image: '/images/industries/government.png',
    to: '/industries/government',
  },
  {
    tag: 'Water & Environment',
    title: 'Water & Critical Infrastructure',
    desc: 'Real-time water quality monitoring with early anomaly detection and alerting',
    image: '/images/industries/water-utilities.png',
    to: '/use-cases/water-toxicity-monitoring',
  },
])
</script>

<style scoped>
.industries-section {
  background: var(--bg-page);
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

@media (min-width: 1024px) {
  .industries-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 639px) {
  .industries-grid {
    grid-template-columns: 1fr;
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
}

@media (min-width: 1024px) {
  .sector-card {
    aspect-ratio: 2/3;
  }
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

.sector-card:hover .sector-card__overlay {
  background: linear-gradient(
    to top,
    rgba(9, 53, 68, 0.88) 0%,
    rgba(9, 53, 68, 0.35) 50%,
    rgba(9, 53, 68, 0.02) 100%
  );
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
  color: #AAC5D0;
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
  color: #AAC5D0;
}

[dir="rtl"] .sector-card:hover .sector-card__arrow {
  transform: scaleX(-1) translateX(0);
}

/* Thin vertical dividers between cards */
.sector-card:not(:last-child) {
  border-inline-end: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
