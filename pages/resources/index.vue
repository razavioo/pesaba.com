<template>
  <div>
    <ImageHero
      image="/images/heroes/resources-hero.png"
      :image-alt="locale === 'fa' ? 'میز کار مهندسی و منابع فنی امنیت شبکه' : 'Engineering workspace with technical security resources'"
      :eyebrow="locale === 'fa' ? 'منابع فنی' : 'Technical resources'"
      :title="$t('resources.headline')"
      :description="$t('resources.sub')"
      theme="reference"
    />

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        <NuxtLink v-for="item in items" :key="item.to" :to="localePath(item.to)" class="product-card p-6">
          <div class="label-meta mb-3">{{ item.tag }}</div>
          <h2 class="mb-2 text-xl font-semibold text-[var(--text-primary)]">{{ item.title }}</h2>
          <p class="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</p>
          <span class="text-sm font-medium text-[#1F7994]">{{ locale === 'fa' ? 'باز کردن' : 'Open section' }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="label-meta mb-5">{{ locale === 'fa' ? 'ویژه' : 'Featured now' }}</div>
          <div class="divide-y divide-[var(--border)]">
            <NuxtLink v-for="item in featured" :key="item.href" :to="localePath(item.href)" class="group block py-4 first:pt-0 last:pb-0">
              <div class="mb-0.5 text-base font-semibold text-[var(--text-primary)] group-hover:text-[#1F7994] transition-colors">{{ item.title }}</div>
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
  description: computed(() => locale.value === 'fa' ? 'مقالات، واژه‌نامه و منابع فریم‌ور برای محصولات و فناوری‌های پرتو ارتباط صبا.' : 'Articles, glossary, and firmware resources for Pesaba products and technologies.'),
})

const items = computed(() => [
  { to: '/blog', title: t('blog.title'), desc: t('resources.blog_desc'), tag: locale.value === 'fa' ? 'تحلیل' : 'Analysis' },
  { to: '/glossary', title: t('glossary.title'), desc: t('resources.glossary_desc'), tag: locale.value === 'fa' ? 'مرجع' : 'Reference' },
  { to: '/resources/firmware', title: t('resources.firmware'), desc: t('resources.firmware_desc'), tag: locale.value === 'fa' ? 'نسخه‌ها' : 'Releases' },
])

const featured = computed(() => locale.value === 'fa'
  ? [
      { href: '/blog/what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer', title: 'چرا شبکه‌های صنعتی به انتقال یک‌طرفه داده نیاز دارند؟', desc: 'مقاله‌ای برای خریداران و معماران شبکه که بین فایروال و دیتا دیود مردد هستند.' },
      { href: '/glossary/data-diode', title: 'واژه‌نامه: Data Diode', desc: 'تعریف سریع، کاربردها و جایگاه در معماری‌های با اطمینان بالا.' },
    ]
  : [
      { href: '/blog/what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer', title: 'Why industrial networks need one-way data transfer', desc: 'A practical explainer for buyers deciding between firewalls and physical one-way enforcement.' },
      { href: '/glossary/data-diode', title: 'Glossary: Data Diode', desc: 'Quick definition, deployment role, and boundary implications for high-assurance environments.' },
    ]
)

const buyerTasks = computed(() => locale.value === 'fa'
  ? [
      'انتخاب بین محصولات برای سناریوی استقرار و نرخ لینک.',
      'دسترسی به واژه‌نامه و مقالات برای تیم فنی و خرید.',
      'بررسی مسیر به‌روزرسانی فریم‌ور.',
    ]
  : [
      'Compare product fit by deployment pattern and link speed.',
      'Give technical and procurement teams shared language via glossary and explainers.',
      'Review firmware/update expectations before purchase.',
    ]
)
</script>
