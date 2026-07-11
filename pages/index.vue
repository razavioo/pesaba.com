<template>
  <div>
    <TopologyHero />

    <!-- Advenica-signature: sector cards with grayscale-to-color hover -->
    <IndustrySectors />

    <!-- Intro tagline + CTA — matches Advenica: text then single button after sector cards -->
    <section class="section pt-4 md:pt-8">
      <div class="container-site max-w-4xl">
        <p class="text-[1.75rem] md:text-[3rem] leading-[1.24] font-medium text-[#093544] mb-8">
          {{ $t('home.hero_sub') }}
        </p>
        <BaseButton variant="outline" size="lg" :to="localePath('/company/contact')">
          {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
        </BaseButton>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="section bg-[var(--bg-page)] relative overflow-hidden">
      <div class="container-site">
        <div class="mb-10 flex items-center gap-6 relative">
          <!-- Dot grid SVG -->
          <svg class="text-[#AAC5D0]/40 w-12 h-12 hidden sm:block" viewBox="0 0 80 80" fill="currentColor">
            <circle cx="10" cy="10" r="3" />
            <circle cx="30" cy="10" r="3" />
            <circle cx="50" cy="10" r="3" />
            <circle cx="70" cy="10" r="3" />
            <circle cx="10" cy="30" r="3" />
            <circle cx="30" cy="30" r="3" />
            <circle cx="50" cy="30" r="3" />
            <circle cx="70" cy="30" r="3" />
            <circle cx="10" cy="50" r="3" />
            <circle cx="30" cy="50" r="3" />
            <circle cx="50" cy="50" r="3" />
            <circle cx="70" cy="50" r="3" />
            <circle cx="10" cy="70" r="3" />
            <circle cx="30" cy="70" r="3" />
            <circle cx="50" cy="70" r="3" />
            <circle cx="70" cy="70" r="3" />
          </svg>
          <div>
            <h2 class="text-3xl md:text-[4rem] font-medium leading-[1.15] text-[var(--blue-deep)]">
              {{ $t('home.featured_products') }}
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[29rem]">
          <NuxtLink
            v-for="p in featuredProducts"
            :key="p.id"
            :to="p.to"
            :class="[
              p.class,
               'product-card card-halo group relative flex flex-col justify-between overflow-hidden p-7 pb-24 md:p-9 md:pb-24 transition-colors duration-300'
            ]"
          >
            <!-- Blue dot indicator in top corner -->
            <span class="absolute top-6 end-6 w-2.5 h-2.5 rounded-full bg-[#1F7994] transition-transform duration-300 group-hover:scale-125" />

            <template v-if="p.isWide">
              <div class="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-8 items-center w-full h-full">
                <div class="flex flex-col">
                  <h3 class="text-2xl md:text-[1.75rem] font-medium text-[var(--blue-deep)] mb-3 leading-snug group-hover:text-[#1F7994] transition-colors">
                    {{ locale === 'fa' ? p.titleFa : p.title }}
                  </h3>
                  <p class="text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                    {{ p.desc }}
                  </p>
                </div>
                <div class="flex justify-center items-center h-64 w-full">
                  <NuxtImg
                    :src="p.image"
                    :alt="p.title"
                    class="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </template>

            <template v-else>
                <div class="flex flex-col h-full justify-between">
                <div>
                  <h3 class="text-2xl md:text-[1.75rem] font-medium text-[var(--blue-deep)] mb-3 leading-snug group-hover:text-[#1F7994] transition-colors">
                    {{ locale === 'fa' ? p.titleFa : p.title }}
                  </h3>
                  <p class="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] mb-8">
                    {{ p.desc }}
                  </p>
                </div>
                <div class="flex justify-center items-center h-56 w-full mt-auto">
                  <NuxtImg
                    :src="p.image"
                    :alt="p.title"
                    class="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </template>
          </NuxtLink>
        </div>

        <div class="mt-12 flex justify-center">
          <NuxtLink
            :to="localePath('/products')"
            class="group inline-flex items-center gap-4 text-base font-medium text-[#1F7994] hover:text-[#165368] transition-colors"
          >
            <span>{{ $t('home.explore_all_products_solutions') }}</span>
            <span class="grid h-11 w-11 place-items-center bg-[#093544] text-white transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true">
              <svg v-if="locale === 'fa'" width="23" height="23" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 6L5 12L11 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter" />
              </svg>
              <svg v-else width="23" height="23" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter" />
              </svg>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About section — Advenica pattern: 2-col split, text left, image right -->
    <section class="section pt-8">
      <div class="container-site">
        <div class="mx-auto max-w-3xl">
          <div>
            <h2 class="text-3xl md:text-[4rem] font-medium leading-[1.15] text-[var(--text-primary)] mb-7">
              {{ locale === 'fa' ? 'درباره پرتو ارتباط صبا' : 'About Pesaba' }}
            </h2>
            <div class="space-y-5 text-base leading-relaxed text-[var(--text-secondary)]">
              <p>{{ locale === 'fa' ? 'پرتو ارتباط صبا در ایران محصولات سخت‌افزاری و نرم‌افزاری حوزه انتقال داده، امنیت شبکه، مخابرات و پایش را توسعه می‌دهد. کاتالوگ سایت برای هر مدل، مشخصات منتشرشده و مسیر دریافت اطلاعات تکمیلی را ارائه می‌کند.' : 'Partov Ertebat Saba develops hardware and software products in Iran for data transfer, network security, telecommunications, and monitoring. The site catalogue presents the published specifications and route to further information for each model.' }}</p>
              <p>{{ locale === 'fa' ? 'تاریخچه ثبتی، دامنه ساخت، وضعیت گواهی، شرایط خدمات و تناسب استقرار باید با اسناد جاری و برای همان مدل، نسخه و پروژه تأیید شوند. مرکز اعتماد سایت موارد قابل انتشار و موارد نیازمند بررسی خرید را از هم جدا می‌کند.' : 'Corporate history, build scope, certification status, service terms, and deployment fit must be confirmed from current records for the specific model, revision, and project. The Trust Center separates published evidence from items that require procurement review.' }}</p>
            </div>
            <div class="flex justify-start rtl:justify-end">
              <NuxtLink :to="localePath('/company/about')" class="mt-6 inline-block text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                {{ locale === 'fa' ? 'اطلاعات بیشتر درباره شرکت' : 'Learn more about Pesaba' }} {{ locale === 'fa' ? '←' : '→' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Spotlight — Advenica pattern: H2 + description + CTA -->
    <section class="section bg-[var(--bg-page)] overflow-hidden">
      <div class="container-site">
        <div class="relative flex flex-col md:flex-row md:items-end">
          <div class="relative z-20 order-2 bg-[#093544] px-6 py-16 text-[#FCFCFD] md:order-1 md:mt-24 md:w-[62%] md:px-12 md:py-20 lg:px-16">
            <div class="max-w-xl">
              <h2 class="mb-5 text-3xl md:text-[4rem] font-medium leading-[1.15] text-[#FCFCFD]">
                {{ locale === 'fa' ? 'دیتا دیودهای سری G' : 'Data Diode G-Series' }}
              </h2>
              <p class="mb-7 text-base leading-relaxed text-[#D7E6EC]">
                {{ locale === 'fa' ? 'دیتا دیودهای سری G برای انتقال یک‌طرفه میان شبکه‌ها عرضه می‌شوند. نوع جداسازی، مرز سخت‌افزاری، سرویس‌های جانبی، توان عملیاتی و آزمون پذیرش باید از مستندات مدل و نسخه انتخابی تأیید شوند.' : 'Pesaba G-Series data diodes are offered for one-way transfer between networks. Separation method, hardware boundary, ancillary services, throughput, and acceptance tests must be confirmed from the selected model and revision documentation.' }}
              </p>
              <BaseButton variant="primary" size="lg" :to="localePath('/products/data-diodes')">
                {{ locale === 'fa' ? 'مشاهده دیتا دیودها' : 'Explore Data Diodes' }}
              </BaseButton>
            </div>
          </div>
          <div class="relative z-30 order-1 ms-auto w-[78%] max-w-[520px] md:order-2 md:-ms-16 md:w-[42%]">
            <NuxtImg src="/photos/g200/reflected.webp" alt="Pesaba data diode" class="border-8 border-white bg-[#EFF4F6] object-contain p-8" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

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
            class="card-halo group flex h-full flex-col overflow-hidden p-6 transition-colors duration-300"
          >
            <div class="mb-5 flex items-start justify-between gap-3">
              <span class="label-accent inline-block border border-[var(--accent)]/25 bg-[var(--accent)]/6 px-2.5 py-1">
                {{ item.badge }}
              </span>
              <span class="text-[var(--text-muted)] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-hover:translate-x-0">{{ locale === 'fa' ? '←' : '→' }}</span>
            </div>
            <h3 class="mb-2.5 text-lg font-bold text-[var(--text-primary)] leading-snug">{{ item.title }}</h3>
            <p class="mb-5 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="label-meta border border-[var(--border)] bg-[var(--bg-page)] px-2.5 py-1"
              >
                {{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section bg-[var(--bg-page)]">
      <div class="container-site">
        <h2 class="mb-12 text-3xl md:text-[4rem] font-medium leading-[1.15] text-[var(--text-primary)]">{{ locale === 'fa' ? 'چرا می‌توانید اعتماد کنید' : 'Why you can trust us' }}</h2>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="pillar in buildPillars" :key="pillar.title" class="space-y-3 border-t border-[var(--border)] pt-6">
            <component :is="pillar.icon" class="h-9 w-9 text-[#1F7994]" />
            <h3 class="text-lg font-medium text-[var(--text-primary)]">{{ pillar.title }}</h3>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ pillar.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-[var(--bg-elevated)]">
      <div class="container-site">
        <div class="mb-8 flex items-end justify-between gap-6">
          <div>
            <div class="section-label mb-3">{{ locale === 'fa' ? 'تازه‌ها' : 'From the Lab' }}</div>
            <h2 class="text-3xl md:text-[4rem] font-medium leading-[1.15] text-[var(--text-primary)]">{{ locale === 'fa' ? 'تازه‌ترین خبرها' : 'Latest news' }}</h2>
          </div>
          <NuxtLink :to="localePath('/blog')" class="text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] underline-photon">
            {{ $t('common.view_all') }}
          </NuxtLink>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard
            v-for="article in featuredArticles?.slice(0, 3)"
            :key="article._path"
            :title="article.title || ''"
            :slug="article.slug || ''"
            :href="localePath(`/blog/${article.slug}`)"
            :description="article.description"
            :date="article.date"
            :image="article.image"
          />
        </div>
      </div>
    </section>

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
    tags: ['2G/3G/4G', 'QoS', 'میدانی'],
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
    tags: ['2G/3G/4G', 'QoS', 'Field'],
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

const featuredProducts = computed(() => [
  {
    id: 'g200',
    title: 'Data Diode G200',
    titleFa: 'دیتا دیود G200',
    desc: locale.value === 'fa' ? 'انتقال یک‌طرفه سخت‌افزاری مبتنی بر FPGA برای شبکه‌های صنعتی OT/SCADA.' : 'FPGA-native one-way data transfer for industrial OT/SCADA systems.',
    image: '/photos/g200/photo-1.webp',
    to: localePath('/products/data-diodes/g200'),
    class: 'col-span-1',
    isWide: false,
  },
  {
    id: 'emx-6',
    title: 'Network Encryptor EMX-6',
    titleFa: 'رمزکننده شبکه EMX-6',
    desc: locale.value === 'fa' ? 'رمزنگاری سخت‌افزاری AES-256 و فیلترینگ ترافیک؛ قابلیت‌های دقیق باید برای نسخه دستگاه تأیید شوند.' : 'Hardware AES-256 encryption and traffic filtering; exact capabilities must be confirmed for the device revision.',
    image: '/photos/emx-6/photo-1.webp',
    to: localePath('/products/network-encryption/emx-6'),
    class: 'col-span-1',
    isWide: false,
  },
  {
    id: 'g300',
    title: 'Data Diode G300',
    titleFa: 'دیتا دیود G300',
    desc: locale.value === 'fa' ? 'دیتا دیود ۱U راک‌مونت با کارایی بالا و منبع تغذیه پشتیبان دوگانه.' : 'High-throughput 1U rackmount data diode with dual redundant power supplies.',
    image: '/photos/g300/photo-1.webp',
    to: localePath('/products/data-diodes/g300'),
    class: 'col-span-1 md:col-span-2',
    isWide: true,
  },
  {
    id: 'capella',
    title: 'Cellular Monitor Capella',
    titleFa: 'پایشگر سلولی Capella',
    desc: locale.value === 'fa' ? 'اندازه‌گیری شاخص‌های کیفیت خدمات و تجربه در شبکه‌های 2G، 3G، LTE و TD-LTE.' : 'QoS and QoE measurement across 2G, 3G, LTE, and TD-LTE networks.',
    image: '/photos/capella/photo-1.webp',
    to: localePath('/products/cellular-monitoring/capella'),
    class: 'col-span-1',
    isWide: false,
  },
  {
    id: 'orazan',
    title: 'Biomonitor Orazan',
    titleFa: 'زیست‌پایشگر اورازان',
    desc: locale.value === 'fa' ? 'تشخیص زودهنگام سمیت و پایش زیست‌محیطی بلادرنگ کیفیت آب.' : 'Early toxicity warning and real-time biological water quality monitoring.',
    image: '/photos/orazan/photo-1.webp',
    to: localePath('/products/bio-monitoring/orazan'),
    class: 'col-span-1',
    isWide: false,
  },
])

const buildPillars = computed(() => [
  { icon: resolveComponent('IconFpgaChip'), title: t('common.fpga_native'), desc: locale.value === 'fa' ? 'در مدل‌های مستندشده، بخشی از مسیر داده در منطق FPGA پیاده‌سازی می‌شود؛ مرز دقیق معماری در دیتاشیت همان مدل مشخص است.' : 'On documented models, parts of the data path use FPGA logic; the applicable datasheet defines the exact architecture boundary.' },
  { icon: resolveComponent('IconAesLock'), title: t('common.os_less'), desc: locale.value === 'fa' ? 'برخی مدل‌ها وابستگی مسیر داده به سیستم‌عامل عمومی را کاهش می‌دهند؛ رابط مدیریت و سرویس‌های جانبی باید جداگانه ارزیابی شوند.' : 'Some models reduce general-purpose OS dependencies on the data path; management and ancillary services still require separate review.' },
  { icon: resolveComponent('IconComplianceCert'), title: t('trust.title'), desc: locale.value === 'fa' ? 'هر ادعای گواهی، سطح خدمت یا چرخه عمر باید با مدرک دارای مدل، نسخه، دامنه و اعتبار مشخص پشتیبانی شود.' : 'Certification, service-level, and lifecycle claims require evidence with a defined model, version, scope, and validity.' },
  { icon: resolveComponent('IconMadeInIran'), title: t('common.made_in_iran'), desc: locale.value === 'fa' ? 'دامنه طراحی، مونتاژ، آزمون و منشأ قطعات برای محصول و سفارش موردنظر در فرایند خرید تأیید می‌شود.' : 'Design, assembly, testing, and component-origin scope are confirmed for the specific product and order during procurement.' },
])

</script>
