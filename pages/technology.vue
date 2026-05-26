<template>
  <div>
    <section class="page-hero relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]" style="min-height: 440px; display: flex; flex-direction: column; justify-content: center;">
      <!-- Hero Background & Overlays -->
      <div class="absolute inset-0" :style="heroMediaStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" :style="heroOverlayStyle" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(148,161,189,0.05) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />
      <div class="absolute start-0 top-0 w-[400px] h-[400px] rounded-full pointer-events-none" style="background: radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 65%); filter: blur(60px);" aria-hidden="true" />

      <div class="container-site section-hero relative z-10 py-16 lg:py-24">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <div class="section-label mb-5">{{ $t('nav.technology') }}</div>
            <h1 class="mb-5 max-w-4xl border-s-2 border-photon-700/50 ps-4 text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--text-primary)] md:text-6xl">
              {{ $t('technology.headline') }}
            </h1>
            <p class="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
              {{ $t('technology.sub') }}
            </p>
          </div>
          <div class="border-s-2 border-photon-700/40 ps-5 bg-[var(--bg-elevated)]/60 backdrop-blur-md p-5 border border-[var(--border)]">
            <div class="label-meta mb-2">{{ locale === 'fa' ? 'خلاصه معماری' : 'Architecture summary' }}</div>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
              {{ locale === 'fa' ? 'فناوری پرتو ارتباط صبا برای خریدار حرفه‌ای باید توضیح‌پذیر باشد: مسیر داده قابل‌ردیابی، سطح حمله کوچک، و رفتار قابل پیش‌بینی.' : 'Pesaba technology must be legible to professional buyers: traceable data paths, small attack surface, and predictable hardware behavior.' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="divider-gradient" />

    <section class="section">
      <div class="container-site">
        <div class="mb-8 flex items-end justify-between gap-6">
          <div>
            <div class="section-label mb-3">{{ locale === 'fa' ? 'اصول طراحی' : 'Design Principles' }}</div>
            <h2 class="section-heading text-[var(--text-primary)]">{{ locale === 'fa' ? 'تصمیم‌هایی که در سطح محصول دیده می‌شوند' : 'The decisions that show up at product level' }}</h2>
          </div>
        </div>
        <div class="divide-y divide-[var(--border)]">
          <div v-for="pillar in pillars" :key="pillar.title" class="flex items-start gap-5 py-5 first:pt-0 last:pb-0">
            <component :is="pillar.icon" class="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-red)]" />
            <div>
              <h3 class="mb-1 text-sm font-semibold text-[var(--text-primary)]">{{ pillar.title }}</h3>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ pillar.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider-gradient" />

    <section class="section">
      <div class="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
        <div class="overflow-hidden rounded-3xl border border-[var(--border)]">
          <NuxtImg
            src="/images/technology/air-gap-concept.png"
            :alt="locale === 'fa' ? 'معماری air-gap و جداسازی یک‌طرفه' : 'Air-gap architecture and one-way isolation'"
            class="h-72 w-full object-cover object-center lg:h-96"
            loading="lazy"
          />
        </div>
        <div>
          <div class="section-label mb-3">{{ locale === 'fa' ? 'معماری داده‌ای' : 'Data architecture' }}</div>
          <h2 class="section-heading mb-4 text-[var(--text-primary)]">{{ locale === 'fa' ? 'جداسازی فیزیکی، نه نرم‌افزاری' : 'Physical isolation, not software-defined' }}</h2>
          <p class="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ locale === 'fa'
              ? 'در خطوط کلیدی محصول، مرز امنیتی در سخت‌افزار اعمال می‌شود. مسیر داده در FPGA تعریف می‌شود، نه در سیستم‌عامل یا پیکربندی نرم‌افزاری.'
              : 'In key product lines, the security boundary is enforced in hardware. The data path is defined in FPGA logic, not in an operating system or software configuration.' }}
          </p>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="proof in proofs" :key="proof.title" class="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <div class="label-meta mb-1">{{ proof.label }}</div>
              <h3 class="mb-1 text-sm font-semibold text-[var(--text-primary)]">{{ proof.title }}</h3>
              <p class="text-xs leading-relaxed text-[var(--text-secondary)]">{{ proof.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider-gradient" />

    <section class="section bg-[rgba(13,23,38,0.56)]">
      <div class="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div class="section-label mb-3">{{ locale === 'fa' ? 'فیلترینگ شبکه' : 'Network filtering' }}</div>
          <h2 class="section-heading mb-4 text-[var(--text-primary)]">{{ locale === 'fa' ? 'کنترل ترافیک در لایه سخت‌افزار' : 'Traffic control at the hardware layer' }}</h2>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ locale === 'fa'
              ? 'فیلترینگ بسته در FPGA بدون نیاز به CPU عمومی انجام می‌شود. این تضمین می‌کند که تصمیم‌های فیلترینگ از مسیر نرم‌افزاری که می‌توان به آن حمله کرد خارج بمانند.'
              : 'Packet filtering runs on the FPGA without a general-purpose CPU in the path. This ensures filtering decisions stay out of the software stack that can be exploited.' }}
          </p>
        </div>
        <div class="overflow-hidden rounded-3xl border border-[var(--border)]">
          <NuxtImg
            src="/images/technology/network-filtering.png"
            :alt="locale === 'fa' ? 'فیلترینگ شبکه در سطح سخت‌افزار' : 'Hardware-level network filtering'"
            class="h-72 w-full object-cover object-center lg:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <div class="divider-gradient" />

    <CTAStrip :headline="$t('technology.compare_headline')" :sub="$t('technology.compare_desc')" :primary-label="$t('footer.compare_products')" :primary-href="localePath('/products/compare')" :secondary-label="$t('trust.title')" :secondary-href="localePath('/trust')" />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isDark } = useDarkMode()
const { withBase } = useBaseUrl()

const heroMediaStyle = computed(() => {
  const position = locale.value === 'fa' ? 'left center' : 'center'
  const opacity = isDark.value ? '0.35' : '0.12'
  return `background-image: url('${withBase('/images/technology/technology-hero.png')}'); background-size: cover; background-position: ${position}; opacity: ${opacity};`
})

const heroOverlayStyle = computed(() => {
  const direction = locale.value === 'fa' ? '270deg' : '90deg'
  if (isDark.value) {
    return `background:
      linear-gradient(${direction}, rgba(10,15,26,0.92) 0%, rgba(10,15,26,0.65) 48%, rgba(10,15,26,0.2) 100%),
      linear-gradient(135deg, color-mix(in srgb, var(--bg-page) 78%, transparent) 0%, color-mix(in srgb, var(--bg-page) 62%, transparent) 58%, color-mix(in srgb, var(--bg-page) 82%, var(--accent) 18%) 100%);`
  }
  return `background:
    linear-gradient(${direction}, color-mix(in srgb, var(--bg-page) 88%, transparent) 0%, color-mix(in srgb, var(--bg-page) 55%, transparent) 55%, transparent 100%),
    linear-gradient(135deg, color-mix(in srgb, var(--bg-page) 65%, transparent) 0%, color-mix(in srgb, var(--bg-page) 40%, transparent) 60%, transparent 100%);`
})

useSeoMeta({
  title: `${t('nav.technology')} | Pesaba`,
  description: 'FPGA-native design principles, OS-less architecture, and hardware trust decisions behind Pesaba products.',
})

const pillars = computed(() => [
  { icon: resolveComponent('IconFpgaChip'), title: t('technology.pillar_fpga_title'), desc: t('technology.pillar_fpga_desc') },
  { icon: resolveComponent('IconAesLock'), title: t('technology.pillar_osless_title'), desc: t('technology.pillar_osless_desc') },
  { icon: resolveComponent('IconArrowOneWay'), title: t('technology.pillar_oneway_title'), desc: t('technology.pillar_oneway_desc') },
  { icon: resolveComponent('IconMadeInIran'), title: t('technology.pillar_local_title'), desc: t('technology.pillar_local_desc') },
])

const proofs = computed(() => locale.value === 'fa'
  ? [
      { label: 'Data path', title: 'مسیر داده قابل توضیح', desc: 'برای خریدار حرفه‌ای، منطق شبکه باید قابل توضیح باشد. معماری محصول باید نشان دهد بسته‌ها کجا می‌روند و چه چیزی اجازه عبور می‌گیرد.' },
      { label: 'Attack surface', title: 'کاهش وابستگی نرم‌افزاری', desc: 'محصولات کلیدی بر اساس منطق سخت‌افزاری و بدون سیستم‌عامل عمومی ساخته شده‌اند تا دامنه CVE و سرویس‌های جانبی کاهش یابد.' },
      { label: 'Deployment fit', title: 'تناسب با سناریوی استقرار', desc: 'از جداسازی SCADA تا رمزنگاری بین‌سایتی، قالب محصول از ابتدا برای کاربری مشخص طراحی می‌شود.' },
    ]
  : [
      { label: 'Data path', title: 'Explainable hardware logic', desc: 'Professional buyers need to see how packets move, where controls live, and what can or cannot execute on the platform.' },
      { label: 'Attack surface', title: 'Reduced software dependency', desc: 'Key product lines avoid general-purpose operating systems and shrink the surrounding software perimeter.' },
      { label: 'Deployment fit', title: 'Matched to deployment pattern', desc: 'From SCADA isolation to inter-site encryption, the form factor and logic are chosen around the actual job to be done.' },
    ]
)
</script>
