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
  border-radius: var(--r-md, 0px);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  box-shadow: none;
  transition: border-color 0.4s ease;
}

@media (min-width: 1024px) {
  .sector-card {
    aspect-ratio: 2/3;
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
    to top,
    rgba(4, 7, 13, 0.85) 0%,
    rgba(4, 7, 13, 0.35) 50%,
    rgba(4, 7, 13, 0) 100%
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
  z-index: 10;
}

.sector-card__tag {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(170, 197, 208, 0.8);
  margin-bottom: 0.25rem;
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
}
</style>
