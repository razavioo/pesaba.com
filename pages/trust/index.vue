<template>
  <div v-if="v2Trust">
    <ContentBlocks :blocks="v2Trust.translation.blocks" :locale="locale === 'fa' ? 'fa' : 'en'" />
  </div>
  <div v-else>
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
            :src="pageData.evidenceImage"
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
const { get } = usePublicCms()
const { get: getV2 } = usePublicCmsV2()
const { data: v2Trust } = await useAsyncData('trust-page-v2', () => getV2('page', 'trust', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const { data: page } = await useAsyncData('trust-page', () => get('page', 'trust', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const pageData = computed(() => {
  const data = page.value as { evidenceImage?: string } | null
  return { evidenceImage: data?.evidenceImage || '/images/trust/rack-installation.png' }
})

useSeoMeta({
  title: `${t('trust.title')} | Pesaba`,
  description: computed(() => locale.value === 'fa'
    ? 'مرکز شفافیت فنی پرتو ارتباط صبا برای وضعیت مستندات، معماری محصول، خدمات و درخواست شواهد خرید.'
    : 'Pesaba technical transparency centre for evidence status, product architecture, service terms, and procurement documentation.'),
})

const trustCards = computed(() => [
  { title: t('trust.certifications'), desc: t('trust.certifications_desc'), status: locale.value === 'fa' ? 'بازبینی شواهد' : 'Evidence review', statusClass: 'label-status-neutral' },
  { title: t('trust.fpga_title'), desc: t('trust.fpga_desc'), status: locale.value === 'fa' ? 'وابسته به مدل' : 'Model-specific', statusClass: 'label-accent' },
  { title: t('trust.supply_chain'), desc: t('trust.supply_chain_desc'), status: locale.value === 'fa' ? 'وابسته به پروژه' : 'Project-specific', statusClass: 'label-status-neutral' },
  { title: t('trust.aes_title'), desc: t('trust.aes_desc'), status: locale.value === 'fa' ? 'وابسته به مدل' : 'Model-specific', statusClass: 'label-accent' },
  { title: t('trust.sla'), desc: t('trust.sla_desc'), status: locale.value === 'fa' ? 'شرایط قراردادی' : 'Contract terms', statusClass: 'label-status-neutral' },
  { title: t('trust.parts_title'), desc: t('trust.parts_desc'), status: locale.value === 'fa' ? 'نیازمند استعلام' : 'Confirm before order', statusClass: 'label-status-neutral' },
])

const evidence = computed(() => locale.value === 'fa'
  ? [
      { title: 'وضعیت شواهد', desc: 'هر ادعای گواهی باید به شماره مدرک، مرجع، مدل، نسخه، دامنه و مدت اعتبار متصل باشد.' },
      { title: 'گارانتی و خدمات', desc: 'شرایط گارانتی، سطح خدمت و زمان پاسخ برای هر سفارش در پیشنهاد یا قرارداد همان پروژه مشخص می‌شود.' },
      { title: 'چرخه عمر محصول', desc: 'وضعیت تولید، تعمیرپذیری و قطعات یدکی باید برای مدل و بازه زمانی خرید استعلام شود.' },
      { title: 'منشأ و زنجیره ساخت', desc: 'دامنه طراحی، مونتاژ و آزمون قابل اعلام است، اما باید برای محصول و سفارش مشخص تأیید شود.' },
    ]
  : [
      { title: 'Evidence status', desc: 'Every certification claim must identify the evidence number, authority, model, version, scope, and validity period.' },
      { title: 'Warranty and service', desc: 'Warranty, service level, and response terms are defined in the applicable proposal or project contract.' },
      { title: 'Product lifecycle', desc: 'Production, repair, and spare-parts availability must be confirmed for the model and planned purchase period.' },
      { title: 'Origin and build chain', desc: 'Design, assembly, and test scope can be disclosed, but it must be confirmed for the specific product and order.' },
    ]
)

const commitments = computed(() => locale.value === 'fa'
  ? [
      'مشخصات نهایی، دامنه تحویل و معیارهای پذیرش در پیشنهاد فنی همان پروژه ثبت می‌شوند.',
      'شرایط گارانتی، تعمیر، قطعات و سطح خدمت پیش از سفارش به‌صورت مکتوب تأیید می‌شوند.',
      'مدارک محدود یا محرمانه فقط پس از احراز درخواست و از مسیر متناسب با طبقه‌بندی سند ارائه می‌شوند.',
    ]
  : [
      'Final specifications, delivery scope, and acceptance criteria are recorded in the project proposal.',
      'Warranty, repair, parts, and service-level terms are confirmed in writing before an order.',
      'Restricted documents are supplied only after request verification and through a channel appropriate to their classification.',
    ]
)
</script>
