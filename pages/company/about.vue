<template>
  <div v-if="doc">
    <section class="page-hero relative">
      <div class="container-site section-hero relative z-10">
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'درباره پرتو ارتباط صبا' : 'About Pesaba' }}</div>
          <h1 class="mb-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">{{ doc.title }}</h1>
          <p class="mb-8 text-lg leading-relaxed text-white/70">{{ doc.sub }}</p>
          <div class="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            <div v-for="stat in aboutStats" :key="stat.label">
              <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
              <div class="text-xs text-white/50">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="border-b border-[var(--border)]">
      <div class="container-site flex min-h-44 items-center py-10 md:min-h-56 md:py-12">
        <img
          src="/logo.svg"
          :alt="locale === 'fa' ? 'نشان پرتو ارتباط صبا' : 'Pesaba logo'"
          class="h-24 w-auto md:h-32"
        >
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 md:grid-cols-2">
        <div v-for="card in whyCards" :key="card.title" class="flex gap-4">
          <div class="w-0.5 shrink-0 self-stretch bg-[#AAC5D0]/50" aria-hidden="true" />
          <div class="py-1">
            <h2 class="mb-1 text-base font-semibold text-[var(--text-primary)]">{{ card.title }}</h2>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ card.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-[var(--border)]">
      <div class="relative h-[420px] overflow-hidden lg:h-[520px]">
        <NuxtImg
          :src="aboutData.heroImage"
          :alt="locale === 'fa' ? 'تصویر مفهومی از زیرساخت شبکه' : 'Conceptual visualization of network infrastructure'"
          class="h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/30 to-transparent" />
        <div class="absolute bottom-0 start-0 end-0 container-site pb-10">
          <p class="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ locale === 'fa' ? 'برای ما مهم است بدانید چه چیزی می‌خرید، چرا برای شبکه شما مناسب است و در زمان استقرار چه پشتیبانی‌ای دریافت می‌کنید. جزئیات ساخت و مدارک هر مدل نیز در مسیر خرید قابل ارائه است.' : 'You should know what you are buying, why it fits your network, and what support is available during deployment. Model-specific build details and documentation are also available through the buying process.' }}
          </p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div class="section-label mb-3">{{ locale === 'fa' ? 'فرهنگ مهندسی' : 'Engineering culture' }}</div>
          <h2 class="section-heading mb-4 text-[var(--text-primary)]">{{ locale === 'fa' ? 'سخت‌افزار قابل توضیح، تیمی که پشتش می‌ایستد' : 'Explainable hardware, a team that stands behind it' }}</h2>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ locale === 'fa'
              ? 'تمرکز تیم پرتو ارتباط صبا بر رمزنگاری، سخت‌افزار ارتباطی و امنیت OT/ICS است. این تخصص را به محصولاتی تبدیل می‌کنیم که در شبکه‌های واقعی قابل استفاده، قابل توضیح و قابل پشتیبانی باشند.'
              : 'The Pesaba team focuses on cryptography, communications hardware, and OT/ICS security. Every product must be legible to professional buyers — from the data path to the attack surface.' }}
          </p>
        </div>
        <div class="overflow-hidden rounded-[2px] border border-[var(--border)]">
          <NuxtImg
            :src="aboutData.engineeringImage"
            :alt="locale === 'fa' ? 'تصویر مفهومی از عملیات مهندسی و پایش شبکه' : 'Conceptual visualization of network engineering and monitoring'"
            class="h-72 w-full object-cover object-center lg:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div class="max-w-4xl prose text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-a:text-[#1F7994]">
          <CmsMarkdown :source="String(doc.body || '')" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { get, list } = usePublicCms()
const { data: doc } = await useAsyncData(`about-${locale.value}`, () => get('company', 'about', locale.value as 'fa' | 'en'), { watch: [locale] })

type AboutPageData = { heroImage?: string; engineeringImage?: string }
const aboutData = computed(() => {
  const data = doc.value as (AboutPageData & Record<string, unknown>) | null
  return {
    heroImage: data?.heroImage || '/images/hero-datacenter.png',
    engineeringImage: data?.engineeringImage || '/images/about/soc-operations.png',
  }
})

const whyCards = computed(() => locale.value === 'fa'
  ? [
      { title: 'ساخته‌شده برای شبکه‌های حساس', body: 'محصولات پرتو ارتباط صبا برای جاهایی ساخته شده‌اند که امنیت، پایداری و کنترل جریان داده مستقیماً روی کار سازمان اثر می‌گذارد.' },
      { title: 'راهکار متناسب با کار شما', body: 'از انتقال یک‌طرفه داده و رمزنگاری لینک تا پایش شبکه و آب، محصول بر اساس مسئله و محیط استفاده انتخاب می‌شود.' },
      { title: 'اطلاعات روشن برای تصمیم مطمئن', body: 'مشخصات محصولات، محدودیت‌ها و مدارک قابل ارائه را شفاف منتشر می‌کنیم تا مقایسه و انتخاب برای شما ساده‌تر باشد.' },
      { title: 'همراهی از انتخاب تا استقرار', body: 'اگر درباره تناسب محصول، روش اتصال یا الزامات شبکه مطمئن نیستید، تیم ما سناریوی شما را بررسی و مسیر مناسب را پیشنهاد می‌کند.' },
    ]
  : [
      { title: 'Product development in Iran', body: 'Pesaba develops network-security products in Iran; manufacturing scope and component origin are confirmed per model and project.' },
      { title: 'Product-specific architecture', body: 'Operating-system presence, data-path boundaries, and FPGA roles vary by model and must be checked in the applicable revision documentation.' },
      { title: 'Evidence-based compliance', body: 'Certification status is only confirmed with an evidence number, authority, model, version, scope, and validity date.' },
      { title: 'Engineering review', body: 'Product fit, deployment requirements, and available supporting documents are established during technical and procurement review.' },
    ]
)

const { data: catalogProducts } = await useAsyncData('about-catalog-stats', () => list('product', locale.value as 'fa' | 'en'), { watch: [locale] })
const catalogEntries = computed(() => new Set(
  (catalogProducts.value || [])
    .filter(product => product.active !== false)
    .map(product => `${product.category}/${product.slug}`),
).size)
const catalogCategories = computed(() => new Set(
  (catalogProducts.value || [])
    .filter(product => product.active !== false)
    .map(product => product.category)
    .filter(Boolean),
).size)
const aboutStats = computed(() => locale.value === 'fa'
  ? [{ value: String(catalogEntries.value), label: 'مدخل کاتالوگ' }, { value: String(catalogCategories.value), label: 'خانواده محصول' }, { value: '۲', label: 'زبان سایت' }]
  : [{ value: String(catalogEntries.value), label: 'Catalog entries' }, { value: String(catalogCategories.value), label: 'Product families' }, { value: '2', label: 'Site languages' }]
)

useSeoMeta({ title: doc.value?.seoTitle ?? `About | Pesaba`, description: doc.value?.seoDescription })
</script>

<style scoped>
h1, h2, h3, h4, h5, h6,
:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  border-bottom: none !important;
  text-decoration: none !important;
}
</style>
