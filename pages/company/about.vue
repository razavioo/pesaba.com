<template>
  <div v-if="doc">
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'درباره پرتو ارتباط صبا' : 'About Pesaba' }}</div>
          <h1 class="mb-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--text-primary)] md:text-7xl">{{ doc.title }}</h1>
          <p class="mb-8 text-lg leading-relaxed text-[var(--text-secondary)]">{{ doc.sub }}</p>
          <div class="flex flex-wrap gap-x-10 gap-y-4 border-t border-[var(--border)] pt-6">
            <div v-for="stat in aboutStats" :key="stat.label">
              <div class="text-2xl font-bold text-[var(--text-primary)]">{{ stat.value }}</div>
              <div class="text-xs text-[var(--text-muted)]">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 md:grid-cols-2">
        <div v-for="card in whyCards" :key="card.title" class="flex gap-4">
          <div class="w-0.5 shrink-0 self-stretch bg-photon-700/40" aria-hidden="true" />
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
          src="/images/hero-datacenter.png"
          alt="Pesaba engineering facility"
          class="h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/30 to-transparent" />
        <div class="absolute bottom-0 start-0 end-0 container-site pb-10">
          <p class="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ locale === 'fa' ? 'طراحی، ساخت و آزمون در تهران — زنجیره مهندسی از FPGA تا محصول نهایی.' : 'Designed, built, and tested in Tehran — engineering chain from FPGA to finished product.' }}
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
              ? 'تمرکز تیم پرتو ارتباط صبا بر رمزنگاری، سخت‌افزار ارتباطی و امنیت OT/ICS است. هر محصول باید برای خریدار حرفه‌ای قابل توضیح باشد — از مسیر داده تا سطح حمله.'
              : 'The Pesaba team focuses on cryptography, communications hardware, and OT/ICS security. Every product must be legible to professional buyers — from the data path to the attack surface.' }}
          </p>
        </div>
        <div class="overflow-hidden rounded-3xl border border-[var(--border)]">
          <NuxtImg
            src="/images/about/soc-operations.png"
            :alt="locale === 'fa' ? 'تیم مهندسی پرتو ارتباط صبا' : 'Pesaba engineering team'"
            class="h-72 w-full object-cover object-center lg:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div class="max-w-4xl prose text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-a:text-photon-400">
          <ContentRenderer :value="doc" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { data: doc } = await useAsyncData(`about-${locale.value}`, async () => {
  const entry = await queryContent('company/about').where({ locale: locale.value }).findOne()
  if (entry) return entry
  return await queryContent('company/about').findOne()
})

const whyCards = computed(() => locale.value === 'fa'
  ? [
      { title: 'طراحی و ساخت داخلی', body: 'تمام سخت‌افزار در تهران طراحی و تولید می‌شود و زنجیره مهندسی تحت کنترل داخلی قرار دارد.' },
      { title: 'معماری FPGA بدون سیستم‌عامل', body: 'در خطوط کلیدی محصول، وابستگی به سیستم‌عامل عمومی حذف شده تا سطح حمله محدود بماند.' },
      { title: 'گواهی و انطباق', body: 'مستندات انطباق، گواهی‌نامه‌ها و تعهدات عملیاتی برای خریدار حرفه‌ای قابل ارائه است.' },
      { title: 'تیم مهندسی متخصص', body: 'تمرکز تیم بر رمزنگاری، سخت‌افزار ارتباطی و امنیت OT/ICS است.' },
    ]
  : [
      { title: 'Domestic engineering and build', body: 'Hardware is designed and manufactured in Tehran inside a controlled engineering chain.' },
      { title: 'OS-less FPGA architecture', body: 'Key product lines remove general-purpose operating systems from the critical data path.' },
      { title: 'Certification and compliance', body: 'Compliance material, certifications, and operational commitments are available to professional buyers.' },
      { title: 'Specialized engineering team', body: 'The team is focused on cryptography, communications hardware, and OT/ICS security.' },
    ]
)

const aboutStats = computed(() => locale.value === 'fa'
  ? [{ value: '۱۷+', label: 'سال تجربه' }, { value: '۱۹', label: 'محصول' }, { value: '۵۰۰+', label: 'پروژه تحویل‌شده' }]
  : [{ value: '17+', label: 'Years of expertise' }, { value: '19', label: 'Products' }, { value: '500+', label: 'Projects delivered' }]
)

useSeoMeta({ title: doc.value?.seo_title ?? `About | Pesaba`, description: doc.value?.seo_desc })
</script>
