<template>
  <div>
    <section class="page-hero relative">
      <div class="container-site section-hero relative z-10">
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ $t('trust.title') }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.02em] text-white md:text-6xl">
            {{ $t('trust.headline') }}
          </h1>
          <p class="mb-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {{ $t('trust.sub') }}
          </p>
          <NuxtLink :to="localePath('/trust/compliance-matrix')" class="text-sm font-medium text-[#AAC5D0] transition-colors hover:text-white">
            {{ $t('trust.view_compliance') }} {{ locale === 'fa' ? '←' : '→' }}
          </NuxtLink>
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
        <div v-for="card in trustCards" :key="card.title" class="product-card p-6">
          <div class="mb-3" :class="card.statusClass">{{ card.status }}</div>
          <h2 class="mb-2 text-xl font-semibold text-[var(--text-primary)]">{{ card.title }}</h2>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ card.desc }}</p>
        </div>
      </div>
    </section>

    <section class="border-b border-[var(--border)]">
      <div class="container-site py-10">
        <div class="overflow-hidden rounded-3xl border border-[var(--border)]">
          <NuxtImg
            src="/images/trust/rack-installation.png"
            :alt="locale === 'fa' ? 'نصب رک — سخت‌افزار پرتو ارتباط صبا در محیط عملیاتی' : 'Rack installation — Pesaba hardware in operational environment'"
            class="h-64 w-full object-cover object-center md:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <div class="label-meta mb-6">{{ locale === 'fa' ? 'مستندات خرید' : 'Buying evidence' }}</div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="item in evidence" :key="item.title" class="border-s-2 border-[var(--border)] ps-4 py-1">
              <h3 class="mb-1 text-sm font-semibold text-[var(--text-primary)]">{{ item.title }}</h3>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <div>
          <div class="label-meta mb-6">{{ locale === 'fa' ? 'تعهدات اجرایی' : 'Operational commitments' }}</div>
          <ul class="space-y-4">
            <li v-for="item in commitments" :key="item" class="list-dot">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <CTAStrip :headline="$t('trust.cta_headline')" :primary-label="$t('trust.cta_primary')" :primary-href="localePath('/company/contact')" :secondary-label="$t('trust.view_compliance')" :secondary-href="localePath('/trust/compliance-matrix')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({ title: `${t('trust.title')} | Pesaba`, description: 'Pesaba certifications, compliance matrix, supply chain details, and security posture for critical infrastructure hardware.' })

const trustCards = computed(() => [
  { title: t('trust.certifications'), desc: t('trust.certifications_desc'), status: 'AFTA · ISO 9001', statusClass: 'label-status-active' },
  { title: t('trust.fpga_title'), desc: t('trust.fpga_desc'), status: 'By design', statusClass: 'label-accent' },
  { title: t('trust.supply_chain'), desc: t('trust.supply_chain_desc'), status: 'Verified', statusClass: 'label-status-active' },
  { title: t('trust.aes_title'), desc: t('trust.aes_desc'), status: 'AES-256', statusClass: 'label-accent' },
  { title: t('trust.sla'), desc: t('trust.sla_desc'), status: '12 months', statusClass: 'label-status-neutral' },
  { title: t('trust.parts_title'), desc: t('trust.parts_desc'), status: '5-year support', statusClass: 'label-status-neutral' },
])

const evidence = computed(() => locale.value === 'fa'
  ? [
      { title: 'ماتریس انطباق', desc: 'برای ارزیابی الزامات خرید، گواهی‌نامه‌ها و وضعیت انطباق در یک نقطه جمع می‌شوند.' },
      { title: 'پشتیبانی و SLA', desc: 'شرایط گارانتی، توسعه SLA و رویه‌های خدمات پس از فروش باید برای تیم خرید شفاف باشند.' },
      { title: 'قطعات یدکی', desc: 'تعهد موجودی قطعات برای مدل‌های تولیدی، ریسک عمر محصول را برای خریدار کاهش می‌دهد.' },
      { title: 'مسیر ساخت', desc: 'طراحی، ساخت و آزمون در زنجیره داخلی کنترل‌شده انجام می‌شود.' },
    ]
  : [
      { title: 'Compliance matrix', desc: 'Buyers need one place to review certifications and current compliance posture across product lines.' },
      { title: 'Warranty and SLA', desc: 'Warranty terms, service extensions, and support expectations need to be explicit before procurement.' },
      { title: 'Spare-parts policy', desc: 'Clear spare-parts commitments reduce lifecycle risk for operators deploying into long-lived infrastructure.' },
      { title: 'Build chain', desc: 'Design, assembly, and validation stay inside a controlled domestic engineering workflow.' },
    ]
)

const commitments = computed(() => locale.value === 'fa'
  ? [
      'گارانتی ۱۲ ماهه با امکان توسعه SLA برای پروژه‌های سازمانی.',
      'حداقل ۵ سال تامین قطعات یدکی برای مدل‌های تولیدی.',
      'مستندات فنی و خرید از طریق مرکز اعتماد و تیم فروش فنی ارائه می‌شود.',
    ]
  : [
      '12-month warranty with enterprise SLA extension options.',
      'Minimum 5-year spare-parts support for production models.',
      'Technical buying documentation is available through the trust center and sales engineering team.',
    ]
)
</script>
