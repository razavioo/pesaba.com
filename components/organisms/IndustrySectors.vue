<template>
  <!-- Advenica-signature: sector cards with B&W → color hover transition -->
  <section class="industries-section">
    <div class="container-wide">
      <div class="industries-grid">
        <NuxtLink
          v-for="sector in sectors"
          :key="sector.to"
          :to="localePath(sector.to)"
          class="sector-card group"
          :aria-label="sector.title"
        >
          <div class="sector-card__image">
            <NuxtImg
              :src="sector.image"
              :alt="sector.title"
              class="sector-card__img"
              loading="lazy"
              width="600"
              height="400"
            />
            <div :class="['sector-card__color-overlay', `sector-card__color-overlay--${sector.color}`]" />
          </div>

          <!-- Dark gradient for text readability -->
          <div class="sector-card__overlay" />

          <!-- Content -->
          <div class="sector-card__content">
            <div class="sector-card__tag">{{ sector.tag }}</div>
            <h3 class="sector-card__title">{{ sector.title }}</h3>
            <p class="sector-card__desc">{{ sector.desc }}</p>
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
    color: 'red',
  },
  {
    tag: 'مخابرات',
    title: 'اپراتورهای مخابراتی',
    desc: 'رمزنگاری و یکپارچه‌سازی شبکه اپراتوری با راهکارهای سخت‌افزاری',
    image: '/images/industries/telecom-operators.png',
    to: '/industries/telecom-operators',
    color: 'blue',
  },
  {
    tag: 'دولتی',
    title: 'سازمان‌های دولتی',
    desc: 'تأمین امنیت شبکه‌های حساس دولتی با راهکارهای قابل ممیزی',
    image: '/images/industries/government.png',
    to: '/industries/government',
    color: 'green',
  },
  {
    tag: 'آب و محیط‌زیست',
    title: 'زیرساخت آب و محیط‌زیست',
    desc: 'پایش بلادرنگ کیفیت آب و تشخیص زودهنگام آلودگی',
    image: '/images/industries/water-utilities.png',
    to: '/use-cases/water-toxicity-monitoring',
    color: 'yellow',
  },
] : [
  {
    tag: 'Power Grid',
    title: 'Power & Energy',
    desc: 'Protect control systems in the power sector with hardware-enforced network boundaries',
    image: '/images/industries/power-grid.png',
    to: '/industries/power-grid',
    color: 'red',
  },
  {
    tag: 'Telecom',
    title: 'Telecom Operators',
    desc: 'Carrier-grade encryption and network integration for telecom operators',
    image: '/images/industries/telecom-operators.png',
    to: '/industries/telecom-operators',
    color: 'blue',
  },
  {
    tag: 'Government',
    title: 'Government & Defense',
    desc: 'Secure sensitive government networks with auditable hardware solutions',
    image: '/images/industries/government.png',
    to: '/industries/government',
    color: 'green',
  },
  {
    tag: 'Water & Environment',
    title: 'Water & Critical Infrastructure',
    desc: 'Real-time water quality monitoring with early anomaly detection and alerting',
    image: '/images/industries/water-utilities.png',
    to: '/use-cases/water-toxicity-monitoring',
    color: 'yellow',
  },
])
</script>

<style scoped>
.industries-section {
  background: transparent;
  position: relative;
  z-index: 40;
  margin-top: -4.25rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .industries-section {
    margin-top: -7rem;
    margin-bottom: 5rem;
  }
}

@media (min-width: 1024px) {
  .industries-section {
    margin-top: -9rem;
    margin-bottom: 5.75rem;
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
    gap: 0.5rem;
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
  min-height: 230px;
  cursor: pointer;
  text-decoration: none;
  border-radius: var(--r-md, 0px);
  border: 0;
  background: var(--bg-elevated);
  box-shadow: none;
  transition: border-color 0.4s ease;
}

@media (min-width: 1024px) {
  .sector-card {
    aspect-ratio: 2/3;
    min-height: 430px;
  }
}

.sector-card:hover {
  border-color: var(--border);
}

/* Image container — dark teal background creates grayscale via blend mode */
.sector-card__image {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: #0f475a;
  transition: background-color 0.3s ease;
}

/* Base image — mix-blend-mode: luminosity + grayscale filter (Advenica technique) */
.sector-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  mix-blend-mode: luminosity;
  filter: contrast(0.5) grayscale();
  transition: all 0.3s ease;
}

.sector-card:hover .sector-card__image {
  background-color: transparent;
}

.sector-card:hover .sector-card__img {
  mix-blend-mode: normal;
  filter: contrast(1) grayscale(0);
  transform: scale(1.04);
}

/* Dark gradient for text readability */
.sector-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(9, 53, 68, 0.88) 0%,
    rgba(9, 53, 68, 0.42) 46%,
    rgba(9, 53, 68, 0.06) 100%
  );
}

/* Content anchored to bottom */
.sector-card__content {
  position: absolute;
  inset-inline-start: 0;
  inset-inline-end: 0;
  top: 50%;
  bottom: auto;
  transform: translateY(-50%);
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
  color: #AAC5D0;
  margin-bottom: 0.25rem;
}

.sector-card__title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  color: #FCFCFD;
  letter-spacing: 0;
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
}

.sector-card__color-overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  mix-blend-mode: color;
  pointer-events: none;
  z-index: 5;
}

.sector-card:hover .sector-card__color-overlay {
  opacity: 0.75;
}

.sector-card__color-overlay--red {
  background-color: #ef4444; /* red */
}

.sector-card__color-overlay--blue {
  background-color: #3b82f6; /* blue */
}

.sector-card__color-overlay--green {
  background-color: #10b981; /* green */
}

.sector-card__color-overlay--yellow {
  background-color: #f59e0b; /* yellow/orange */
}
</style>
