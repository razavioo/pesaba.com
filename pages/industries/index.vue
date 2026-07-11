<template>
  <div>
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ $t('nav.solutions') }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)] md:text-5xl">
            {{ locale === 'fa' ? 'راهکارهای بخش‌محور برای شبکه‌های حساس' : 'Sector-specific solutions for sensitive networks' }}
          </h1>
          <p class="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {{ $t('industries.sub') }}
          </p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="(industry, i) in industries"
            :key="industry.href"
            :to="localePath(industry.href)"
            class="product-card overflow-hidden"
            :class="{ 'md:col-span-2 xl:col-span-1': i === 0 }"
          >
            <div class="aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
              <NuxtImg :src="industry.image" :alt="industry.title" class="h-full w-full object-cover" loading="lazy" />
            </div>
            <div class="p-5">
              <div class="label-meta mb-2">{{ industry.badge }}</div>
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

useSeoMeta({ title: `${t('nav.solutions')} | Pesaba`, description: 'Pesaba network security solutions for utilities, telecom, government, manufacturing, and critical infrastructure.' })

const industries = computed(() => [
  { href: '/industries/banking-finance', title: locale.value === 'fa' ? 'بانک و مالی' : 'Banking & Finance', desc: locale.value === 'fa' ? 'حفاظت از شبکه‌های مالی و مراکز داده با رمزنگاری و مرزبندی سخت‌افزاری.' : 'Protect financial infrastructure and data centers with hardware-enforced segmentation and encryption.', image: '/images/industries/banking-finance.png', badge: locale.value === 'fa' ? 'اعتماد بالا' : 'High assurance' },
  { href: '/industries/government', title: locale.value === 'fa' ? 'دولت' : 'Government', desc: locale.value === 'fa' ? 'جداسازی دامنه و ارتباطات امن برای نهادهای حاکمیتی.' : 'Domain separation and secure communications for government environments.', image: '/images/industries/government.png', badge: locale.value === 'fa' ? 'حاکمیتی' : 'Sovereign' },
  { href: '/industries/manufacturing', title: locale.value === 'fa' ? 'تولید' : 'Manufacturing', desc: locale.value === 'fa' ? 'مرزبندی OT/IT و مشاهده‌پذیری برای شبکه‌های صنعتی کارخانه.' : 'OT/IT boundaries and observability for industrial factory networks.', image: '/images/industries/manufacturing.png', badge: locale.value === 'fa' ? 'OT' : 'OT operations' },
  { href: '/industries/oil-and-gas', title: locale.value === 'fa' ? 'نفت و گاز' : 'Oil & Gas', desc: locale.value === 'fa' ? 'محافظت از دارایی‌های بالادستی و پالایشگاهی با سخت‌افزار مقاوم.' : 'Protect upstream and refinery environments with hardened network boundaries.', image: '/images/industries/oil-and-gas.png', badge: locale.value === 'fa' ? 'سخت‌گیر' : 'Hardened' },
  { href: '/industries/power-grid', title: locale.value === 'fa' ? 'شبکه برق' : 'Power Grid', desc: locale.value === 'fa' ? 'جداسازی SCADA و انتقال امن داده برای تولید و انتقال برق.' : 'SCADA isolation and secure data export for generation and transmission infrastructure.', image: '/images/industries/power-grid.webp', badge: locale.value === 'fa' ? 'SCADA' : 'SCADA' },
  { href: '/industries/telecom-operators', title: locale.value === 'fa' ? 'اپراتورهای مخابراتی' : 'Telecom Operators', desc: locale.value === 'fa' ? 'پایش KPI، درایو تست و ابزارهای بهبود کیفیت شبکه سلولی.' : 'KPI monitoring, drive test workflows, and network quality tools for operators.', image: '/images/industries/telecom-operators.png', badge: locale.value === 'fa' ? 'کیفیت شبکه' : 'Network quality' },
    { href: '/industries/water-utilities', title: locale.value === 'fa' ? 'آب و فاضلاب' : 'Water Utilities', desc: locale.value === 'fa' ? 'پایش کیفیت آب و جداسازی سامانه‌های کنترل در تاسیسات حیاتی.' : 'Water-quality monitoring and control-system separation for utility environments.', image: '/images/industries/water-utilities.webp', badge: locale.value === 'fa' ? 'پایش' : 'Monitoring' },
])
</script>
