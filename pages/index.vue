<template>
  <div>
    <TopologyHero />

    <!-- Advenica-signature: sector cards with grayscale-to-color hover -->
    <IndustrySectors />

    <StatsShowcase />

    <section class="section">
      <div class="container-site">
        <div class="mb-8">
          <div class="section-label mb-3">{{ locale === 'fa' ? 'خطوط محصول' : 'Product Lines' }}</div>
          <h2 class="section-heading text-[var(--text-primary)]">{{ $t('home.what_we_do') }}</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="(cat, i) in productCategories"
            :key="cat.key"
            :class="[
              'w-full transition-all duration-300',
              i === 0 ? 'xl:col-span-2' : '',
              i === 5 ? 'xl:col-span-2' : '',
            ]"
          >
            <NuxtLink
              :to="localePath(`/products/${cat.key}`)"
              class="product-card card-halo group overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
            >
              <div :class="[
                'relative border-b border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden',
                i === 0 || i === 5 ? 'aspect-[21/9]' : 'aspect-[4/3]',
              ]">
                <NuxtImg :src="cat.image" :alt="cat.title" class="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                <!-- Advenica-style blinking dot indicator -->
                <span class="product-dot absolute right-4 top-4 h-3.5 w-3.5 rounded-full bg-[#1F7994]" aria-hidden="true" />
                <!-- Arrow on hover -->
                <span class="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#093544] text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" aria-hidden="true">
                  <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
              <div class="p-5 flex-grow">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <h3 :class="['font-semibold text-[var(--text-primary)]', i === 0 || i === 5 ? 'text-2xl' : 'text-xl']">{{ cat.title }}</h3>
                  <span class="label-meta shrink-0">{{ cat.stat }}</span>
                </div>
                <p class="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{{ cat.desc }}</p>
                <div class="flex flex-wrap gap-2">
                  <SpecPill v-for="chip in cat.chips" :key="chip.label" :label="chip.label" :value="chip.value" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- SVG wedge: white → blue-pale -->
    <div class="w-full overflow-hidden leading-none" aria-hidden="true" style="background:var(--bg-page)">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" class="w-full h-10 block"><path d="M0,0 L1440,48 L0,48 Z" fill="var(--bg-elevated)"/></svg>
    </div>

    <section class="section bg-[var(--bg-elevated)]">
      <div class="container-site">
        <div class="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
          <div>
            <div class="section-label mb-3">{{ locale === 'fa' ? 'کاربردها' : 'Where Pesaba Fits' }}</div>
            <h2 class="section-heading text-[var(--text-primary)]">
              {{ locale === 'fa' ? 'از مسئله عملیاتی به محصول مناسب برسید.' : 'Move from operational problem to the right hardware.' }}
            </h2>
          </div>
          <p class="section-copy max-w-2xl">
            {{ locale === 'fa' ? 'مانند سایت‌های مرجع مخابراتی، مسیر انتخاب محصول را بر اساس کاربرد ساده کرده‌ایم: مرزبندی امن، انتقال مخابراتی، پایش سلولی و زیرساخت‌های حیاتی.' : 'Inspired by leading telecom hardware sites, discovery is organized by use case: secure boundaries, telecom transport, cellular monitoring, and critical-infrastructure operations.' }}
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="item in applicationSegments"
            :key="item.to"
            :to="localePath(item.to)"
            class="card-halo group flex h-full flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="mb-5 flex items-start justify-between gap-3">
              <span class="inline-block border border-[var(--accent)]/25 bg-[var(--accent)]/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                {{ item.badge }}
              </span>
              <span class="text-[var(--text-muted)] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-hover:translate-x-0">→</span>
            </div>
            <h3 class="mb-2.5 text-lg font-bold text-[var(--text-primary)] leading-snug">{{ item.title }}</h3>
            <p class="mb-5 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="border border-[var(--border)] bg-[var(--bg-page)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-muted)]"
              >
                {{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SVG wedge: blue-pale → white -->
    <div class="w-full overflow-hidden leading-none" aria-hidden="true" style="background:var(--bg-elevated)">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" class="w-full h-10 block"><path d="M0,48 L1440,0 L1440,48 Z" fill="var(--bg-page)"/></svg>
    </div>

    <section class="section bg-[var(--bg-page)]">
      <div class="container-site">
        <div class="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <div class="section-label mb-3">{{ locale === 'fa' ? 'چرا متفاوتیم' : 'Why It Ships Better' }}</div>
            <h2 class="section-heading text-[var(--text-primary)]">{{ $t('home.how_we_ship') }}</h2>
          </div>
          <p class="section-copy max-w-2xl">
            {{ locale === 'fa' ? 'محصولات پرتو ارتباط صبا باید برای خریداران فنی قابل توجیه باشند: منطق سخت‌افزاری شفاف، وابستگی نرم‌افزاری کمتر، و مستندات اعتمادسازی قوی‌تر.' : 'Pesaba products need to be defensible to technical buyers: clearer hardware logic, fewer software dependencies, and stronger trust evidence.' }}
          </p>
        </div>
        <div class="grid gap-0 md:grid-cols-2 border border-[var(--border)] overflow-hidden">
          <div
            v-for="(pillar, i) in buildPillars"
            :key="pillar.title"
            :class="[
              'flex items-start gap-4 p-6 border-[var(--border)]',
              i % 2 === 0 ? 'border-e' : '',
              i < buildPillars.length - 2 ? 'border-b' : '',
            ]"
          >
            <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--accent)]/8 border border-[var(--accent)]/20">
              <component :is="pillar.icon" class="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 class="mb-1.5 text-base font-bold text-[var(--text-primary)]">{{ pillar.title }}</h3>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ pillar.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SVG wedge: white → blue-pale for news section -->
    <div class="w-full overflow-hidden leading-none" aria-hidden="true" style="background:var(--bg-page)">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" class="w-full h-10 block"><path d="M0,0 L1440,48 L0,48 Z" fill="var(--bg-elevated)"/></svg>
    </div>

    <section class="section bg-[var(--bg-elevated)]">
      <div class="container-site">
        <div class="mb-8 flex items-end justify-between gap-6">
          <div>
            <div class="section-label mb-3">{{ locale === 'fa' ? 'تازه‌ها' : 'From the Lab' }}</div>
            <h2 class="section-heading text-[var(--text-primary)]">{{ $t('home.from_the_lab') }}</h2>
          </div>
          <NuxtLink :to="localePath('/blog')" class="text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] underline-photon">
            {{ $t('common.view_all') }}
          </NuxtLink>
        </div>
        <div class="grid gap-5 xl:grid-cols-[1.4fr_1fr_1fr]">
          <!-- Featured article: editorial overlay style -->
          <NuxtLink
            v-if="featuredArticles?.[0]"
            :to="localePath(`/blog/${featuredArticles[0].slug}`)"
            class="group relative overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] h-full flex flex-col"
          >
            <div class="relative h-full min-h-[24rem]">
              <NuxtImg
                v-if="featuredArticles[0].image"
                :src="featuredArticles[0].image"
                :alt="featuredArticles[0].title"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="eager"
              />
              <div v-else class="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,165,233,0.08),transparent)]" />
              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(4,10,20,0.92)] via-[rgba(4,10,20,0.45)] to-transparent" />
              <!-- Content pinned to bottom -->
              <div class="absolute inset-x-0 bottom-0 p-6">
                <div class="mb-3 flex items-center gap-2 text-xs">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#AAC5D0]">{{ $t('blog.badge') }}</span>
                  <span class="h-px w-4 bg-white/20" />
                  <span class="text-white/50">{{ formatDate(featuredArticles[0].date) }}</span>
                </div>
                <h3 class="mb-2 text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#AAC5D0] md:text-2xl">
                  {{ featuredArticles[0].title }}
                </h3>
                <p class="line-clamp-2 text-sm leading-relaxed text-white/60">{{ featuredArticles[0].description }}</p>
                <div class="mt-4 text-sm font-semibold text-[#AAC5D0] transition-colors group-hover:text-white">
                  {{ $t('blog.read_more') }} →
                </div>
              </div>
            </div>
          </NuxtLink>
          <ArticleCard
            v-for="article in featuredArticles?.slice(1, 3)"
            :key="article._path"
            :title="article.title"
            :slug="article.slug"
            :href="localePath(`/blog/${article.slug}`)"
            :description="article.description"
            :date="article.date"
            :image="article.image"
            :word-count="article.body?.children?.length ? article.body.children.length * 90 : undefined"
            :category="$t('blog.badge')"
          />
        </div>
      </div>
    </section>

    <!-- SVG wedge: blue-pale → page for CTAStrip -->
    <div class="w-full overflow-hidden leading-none" aria-hidden="true" style="background:var(--bg-elevated)">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" class="w-full h-10 block"><path d="M1440,0 L0,48 L1440,48 Z" fill="var(--bg-page)"/></svg>
    </div>

    <CTAStrip
      :headline="$t('home.cta_headline')"
      :sub="$t('contact.phone_first_sub')"
      :primary-label="$t('contact.call_sales_now')"
      :primary-href="salesPhoneHref"
      :secondary-label="$t('home.cta_all_products')"
      :secondary-href="localePath('/products')"
    />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { salesPhoneHref } = useContactInfo()
const { emitOrganization, emitWebsite } = useSchemaOrg()

useSeoMeta({
  title: t('meta.default_title'),
  description: t('meta.default_description'),
  ogTitle: t('meta.default_title'),
  ogDescription: t('meta.default_description'),
})
emitOrganization()
emitWebsite()

const { data: featuredArticles } = await useAsyncData('home-articles', () =>
  queryContent('articles').where({ locale: locale.value }).sort({ date: -1 }).limit(4).find()
)


const applicationSegments = computed(() => locale.value === 'fa' ? [
  {
    badge: 'OT/IT',
    title: 'مرزبندی امن شبکه‌های عملیاتی',
    desc: 'انتقال یک‌طرفه داده از محیط‌های حساس به شبکه سازمانی، بدون مسیر برگشت نرم‌افزاری.',
    to: '/use-cases/one-way-data-transfer',
    tags: ['دیتادیود', 'یک‌طرفه', 'SCADA'],
  },
  {
    badge: 'AES',
    title: 'رمزنگاری لینک‌های حساس',
    desc: 'رمزنگاری سخت‌افزاری برای ارتباط بین سایت‌ها و لینک‌های زیرساختی با سطح حمله کوچک‌تر.',
    to: '/use-cases/aes-256-network-encryption',
    tags: ['AES-256', 'FPGA', 'بدون OS'],
  },
  {
    badge: 'QoS',
    title: 'پایش کیفیت شبکه سلولی',
    desc: 'اندازه‌گیری KPI، پوشش و کیفیت تجربه از ابزار میدانی تا گزارش متمرکز.',
    to: '/use-cases/cellular-quality-monitoring',
    tags: ['2G–5G', 'QoS', 'میدانی'],
  },
  {
    badge: 'SDH',
    title: 'انتقال مخابراتی و شبکه اپراتوری',
    desc: 'حفظ و نوسازی لایه‌های انتقال قدیمی و جدید با رابط‌های SDH، E1 و اترنت.',
    to: '/products/telecom-transmission',
    tags: ['SDH/E1', 'Carrier', 'Transport'],
  },
  {
    badge: 'Grid',
    title: 'زیرساخت‌های حیاتی و صنایع حساس',
    desc: 'الگوهای استقرار برای برق، آب، دولت و محیط‌های صنعتی با نیاز به مستندسازی فنی.',
    to: '/industries/power-grid',
    tags: ['زیرساخت حیاتی', 'OT', 'اعتماد'],
  },
  {
    badge: 'Water',
    title: 'پایش زیست‌محیطی و کیفیت آب',
    desc: 'تشخیص زودهنگام و هشدار بلادرنگ برای شبکه‌های توزیع و تأسیسات آب.',
    to: '/use-cases/water-toxicity-monitoring',
    tags: ['پایش آب', 'هشدار', 'بلادرنگ'],
  },
] : [
  {
    badge: 'OT/IT',
    title: 'Secure operational-network boundaries',
    desc: 'Move data from sensitive environments to enterprise networks with hardware-enforced one-way flow.',
    to: '/use-cases/one-way-data-transfer',
    tags: ['Data diode', 'One-way', 'SCADA'],
  },
  {
    badge: 'AES',
    title: 'Encrypt sensitive infrastructure links',
    desc: 'FPGA-native network encryption for inter-site and backbone links with a smaller software attack surface.',
    to: '/use-cases/aes-256-network-encryption',
    tags: ['AES-256', 'FPGA', 'OS-less'],
  },
  {
    badge: 'QoS',
    title: 'Measure cellular network quality',
    desc: 'Track coverage, KPIs, and QoE from field probes to centralized reporting.',
    to: '/use-cases/cellular-quality-monitoring',
    tags: ['2G–5G', 'QoS', 'Field'],
  },
  {
    badge: 'SDH',
    title: 'Modernize telecom transport',
    desc: 'Bridge legacy and modern transport layers with SDH, E1, and Ethernet interfaces.',
    to: '/products/telecom-transmission',
    tags: ['SDH/E1', 'Carrier', 'Transport'],
  },
  {
    badge: 'Grid',
    title: 'Support critical infrastructure teams',
    desc: 'Deployment patterns for power, water, government, and industrial environments that need technical proof.',
    to: '/industries/power-grid',
    tags: ['Critical infrastructure', 'OT', 'Trust'],
  },
  {
    badge: 'Water',
    title: 'Monitor environmental and water quality',
    desc: 'Early anomaly detection and realtime alerting for distribution networks and water facilities.',
    to: '/use-cases/water-toxicity-monitoring',
    tags: ['Water quality', 'Alerting', 'Realtime'],
  },
])

const productCategories = computed(() => [
  {
    key: 'data-diodes',
    title: t('products.categories.data-diodes'),
    image: '/photos/k200/photo-1.webp',
    stat: locale.value === 'fa' ? 'یک‌طرفه' : 'One-way',
    desc: locale.value === 'fa' ? 'انتقال قطعی و یک‌طرفه داده برای مرزبندی‌های با اطمینان بالا.' : 'Deterministic one-way data transfer for high-assurance boundaries.',
    chips: locale.value === 'fa'
      ? [{ label: 'مدل‌ها', value: '۵' }, { label: 'بیشینه سرعت', value: '۱۰ Gbps' }]
      : [{ label: 'Models', value: '5' }, { label: 'Max', value: '10 Gbps' }],
  },
  {
    key: 'network-encryption',
    title: t('products.categories.network-encryption'),
    image: '/photos/emx-6/photo-1.webp',
    stat: 'AES-256',
    desc: locale.value === 'fa' ? 'رمزنگاری خطی سخت‌افزاری با سطح حمله نرم‌افزاری نزدیک به صفر.' : 'Line-rate hardware encryption with near-zero software attack surface.',
    chips: locale.value === 'fa'
      ? [{ label: 'معماری', value: 'مبتنی بر FPGA' }, { label: 'سرعت لینک', value: '۱+ Gbps' }]
      : [{ label: 'Mode', value: 'FPGA-native' }, { label: 'Links', value: '1+ Gbps' }],
  },
  {
    key: 'cellular-monitoring',
    title: t('products.categories.cellular-monitoring'),
    image: '/photos/capella/photo-1.webp',
    stat: '2G-5G',
    desc: locale.value === 'fa' ? 'پایش KPI و QoS سلولی از ابزار میدانی تا گزارش متمرکز.' : 'Cellular KPI and QoS measurement from field probes to centralized reporting.',
    chips: locale.value === 'fa'
      ? [{ label: 'پوشش', value: 'سراسری' }, { label: 'شاخص‌ها', value: 'QoS + QoE' }]
      : [{ label: 'Coverage', value: 'Nationwide' }, { label: 'KPIs', value: 'QoS + QoE' }],
  },
  {
    key: 'network-switching-filtering',
    title: t('products.categories.network-switching-filtering'),
    image: '/photos/emx-9/photo-1.webp',
    stat: locale.value === 'fa' ? 'فیلترینگ' : 'Filtering',
    desc: locale.value === 'fa' ? 'سوئیچینگ و فیلترینگ صنعتی برای محیط‌های OT حساس.' : 'Industrial switching and filtering for sensitive OT environments.',
    chips: locale.value === 'fa'
      ? [{ label: 'لایه', value: 'L2/L3' }, { label: 'کاربرد', value: 'تفکیک شبکه' }]
      : [{ label: 'Mode', value: 'L2/L3' }, { label: 'Use', value: 'Segmentation' }],
  },
  {
    key: 'telecom-transmission',
    title: t('products.categories.telecom-transmission'),
    image: '/photos/sdx-1/photo-1.webp',
    stat: 'STM-1 / E1',
    desc: locale.value === 'fa' ? 'رابط‌ها و انتقال مخابراتی برای شبکه‌های قدیم و جدید.' : 'Telecom transport interfaces for legacy and modern network layers.',
    chips: locale.value === 'fa'
      ? [{ label: 'پروتکل', value: 'SDH / E1' }, { label: 'رده', value: 'اپراتوری' }]
      : [{ label: 'Transport', value: 'SDH / E1' }, { label: 'Fit', value: 'Carrier' }],
  },
  {
    key: 'bio-monitoring',
    title: t('products.categories.bio-monitoring'),
    image: '/photos/orazan/photo-1.webp',
    stat: locale.value === 'fa' ? 'هشدار' : 'Alerting',
    desc: locale.value === 'fa' ? 'پایش زیست‌محیطی برای کیفیت آب و تشخیص زودهنگام.' : 'Environmental monitoring for water quality and early anomaly detection.',
    chips: locale.value === 'fa'
      ? [{ label: 'حالت پایش', value: 'بلادرنگ' }, { label: 'کاربرد', value: 'شبکه‌های توزیع' }]
      : [{ label: 'Mode', value: 'Realtime' }, { label: 'Use', value: 'Utilities' }],
  },
])

const buildPillars = computed(() => [
  { icon: resolveComponent('IconFpgaChip'), title: t('common.fpga_native'), desc: locale.value === 'fa' ? 'منطق مسیر داده در سخت‌افزار پیاده‌سازی می‌شود، نه روی سیستم‌عامل عمومی.' : 'The data path is implemented in hardware logic, not on a general-purpose operating system.' },
  { icon: resolveComponent('IconAesLock'), title: t('common.os_less'), desc: locale.value === 'fa' ? 'صفحه کنترل بدون وابستگی به نرم‌افزار عمومی، با سطح حمله کوچک‌تر.' : 'Control surfaces avoid general-purpose software dependencies and reduce the attack surface.' },
  { icon: resolveComponent('IconComplianceCert'), title: t('trust.title'), desc: locale.value === 'fa' ? 'تصمیم‌های خرید با گواهی‌نامه، SLA و تعهد قطعات یدکی پشتیبانی می‌شوند.' : 'Buying decisions are supported with certifications, SLA details, and spare-parts commitments.' },
  { icon: resolveComponent('IconMadeInIran'), title: t('common.made_in_iran'), desc: locale.value === 'fa' ? 'طراحی، ساخت و آزمون در زنجیره مهندسی کنترل‌شده داخلی انجام می‌شود.' : 'Design, manufacturing, and validation stay inside a controlled domestic engineering chain.' },
])

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}
</script>
