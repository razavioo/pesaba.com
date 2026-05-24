<template>
  <div>
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ $t('nav.resources') }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)] md:text-5xl">
            {{ $t('resources.headline') }}
          </h1>
          <p class="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {{ $t('resources.sub') }}
          </p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        <NuxtLink v-for="item in items" :key="item.to" :to="localePath(item.to)" class="product-card p-6">
          <div class="label-meta mb-3">{{ item.tag }}</div>
          <h2 class="mb-2 text-xl font-semibold text-[var(--text-primary)]">{{ item.title }}</h2>
          <p class="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</p>
          <span class="text-sm font-medium text-photon-400">{{ locale === 'fa' ? 'باز کردن' : 'Open section' }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="label-meta mb-5">{{ locale === 'fa' ? 'ویژه' : 'Featured now' }}</div>
          <div class="divide-y divide-[var(--border)]">
            <NuxtLink v-for="item in featured" :key="item.href" :to="localePath(item.href)" class="group block py-4 first:pt-0 last:pb-0">
              <div class="mb-0.5 text-base font-semibold text-[var(--text-primary)] group-hover:text-photon-400 transition-colors">{{ item.title }}</div>
              <div class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</div>
            </NuxtLink>
          </div>
        </div>
        <div class="border-s border-[var(--border)] ps-8">
          <div class="label-meta mb-5">{{ locale === 'fa' ? 'برای ارزیابی خرید' : 'For technical evaluation' }}</div>
          <ul class="space-y-4">
            <li v-for="item in buyerTasks" :key="item" class="list-dot">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: `${t('nav.resources')} | Pesaba`,
  description: 'Articles, glossary, datasheets, and firmware resources for Pesaba products and technologies.',
})

const items = computed(() => [
  { to: '/blog', title: t('blog.title'), desc: t('resources.blog_desc'), tag: locale.value === 'fa' ? 'تحلیل' : 'Analysis' },
  { to: '/glossary', title: t('glossary.title'), desc: t('resources.glossary_desc'), tag: locale.value === 'fa' ? 'مرجع' : 'Reference' },
  { to: '/resources/datasheets', title: t('resources.datasheets'), desc: t('resources.datasheets_desc'), tag: locale.value === 'fa' ? 'مستندات' : 'Documents' },
  { to: '/resources/firmware', title: t('resources.firmware'), desc: t('resources.firmware_desc'), tag: locale.value === 'fa' ? 'نسخه‌ها' : 'Releases' },
])

const featured = computed(() => locale.value === 'fa'
  ? [
      { href: '/blog/what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer', title: 'چرا شبکه‌های صنعتی به انتقال یک‌طرفه داده نیاز دارند؟', desc: 'مقاله‌ای برای خریداران و معماران شبکه که بین فایروال و دیتا دیود مردد هستند.' },
      { href: '/glossary/data-diode', title: 'واژه‌نامه: Data Diode', desc: 'تعریف سریع، کاربردها و جایگاه در معماری‌های با اطمینان بالا.' },
      { href: '/resources/datasheets', title: 'دیتاشیت‌های محصول', desc: 'مشخصات فنی، فرم‌فکتور و راه‌های ارزیابی محصول در یک بخش.' },
    ]
  : [
      { href: '/blog/what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer', title: 'Why industrial networks need one-way data transfer', desc: 'A practical explainer for buyers deciding between firewalls and physical one-way enforcement.' },
      { href: '/glossary/data-diode', title: 'Glossary: Data Diode', desc: 'Quick definition, deployment role, and boundary implications for high-assurance environments.' },
      { href: '/resources/datasheets', title: 'Product datasheets', desc: 'Specifications, form factors, and evaluation material organized in one place.' },
    ]
)

const buyerTasks = computed(() => locale.value === 'fa'
  ? [
      'انتخاب بین محصولات برای سناریوی استقرار و نرخ لینک.',
      'دسترسی به واژه‌نامه و مقالات برای تیم فنی و خرید.',
      'دانلود دیتاشیت و بررسی مسیر به‌روزرسانی فریم‌ور.',
    ]
  : [
      'Compare product fit by deployment pattern and link speed.',
      'Give technical and procurement teams shared language via glossary and explainers.',
      'Download datasheets and review firmware/update expectations before purchase.',
    ]
)
</script>
