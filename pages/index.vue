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
               'product-card card-halo group relative flex flex-col justify-between overflow-hidden p-7 md:p-9 transition-colors duration-300'
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
            class="group inline-flex items-center gap-3 text-base font-medium text-[#1F7994] hover:text-[#165368] transition-colors"
          >
            <span>{{ $t('home.explore_all_products_solutions') }}</span>
            <span class="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              {{ locale === 'fa' ? '←' : '→' }}
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
              <p>{{ locale === 'fa' ? 'پرتو ارتباط صبا (پصبا) یک شرکت دانش‌بنیان ایرانی است که از سال ۱۳۸۷ در زمینه طراحی و ساخت سخت‌افزارهای امنیت شبکه و تجهیزات مخابراتی فعالیت می‌کند. مأموریت ما ارائه راهکارهای مهندسی‌شده داخلی برای چالش‌های امنیت شبکه در محیط‌های صنعتی، دولتی و اپراتوری است.' : 'Partov Ertebat Saba (Pesaba) is an Iranian knowledge-based company founded in 2008, specialising in the design and manufacture of network security hardware. Our mission is to deliver domestically engineered solutions to the most demanding network security challenges in industrial, governmental, and operator environments.' }}</p>
              <p>{{ locale === 'fa' ? 'تیم ما متشکل از فارغ‌التحصیلان دکتری و کارشناسی ارشد از دانشگاه‌های برتر ایران است که برای بومی‌سازی فناوری‌های امنیت شبکه فعالیت می‌کنند. با بیش از یک دهه تجربه در حوزه مخابرات و امنیت، پصبا مجموعه‌ای از محصولات شامل رمزکننده‌های سخت‌افزاری، دیتا دیودها، تجهیزات پایش شبکه و انتقال مخابراتی را ارائه می‌دهد.' : 'Our team of PhD and MSc graduates from Iran\'s leading universities works to localise critical network security technology. With over a decade of experience in communications and security, Pesaba delivers hardware encryption devices, data diodes, network monitoring equipment, and telecom transmission systems.' }}</p>
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
                {{ locale === 'fa' ? 'دیتا دیودهای سری G پرتو ارتباط صبا جداسازی فیزیکی تضمین‌شده بین شبکه‌های حساس و شبکه‌های با سطح اطمینان پایین‌تر را فراهم می‌کنند. معماری مبتنی بر FPGA انتقال یک‌طرفه داده را بدون مسیر برگشت نرم‌افزاری enforce می‌کند.' : 'Pesaba G-Series data diodes provide guaranteed physical separation between sensitive networks and lower-trust environments. FPGA-native architecture enforces one-way data transfer without a software return path.' }}
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
              <span class="inline-block border border-[var(--accent)]/25 bg-[var(--accent)]/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
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
                class="border border-[var(--border)] bg-[var(--bg-page)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-muted)]"
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
            :title="article.title"
            :slug="article.slug"
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
    desc: locale.value === 'fa' ? 'رمزنگاری خطی سخت‌افزاری با سطح حمله نرم‌افزاری نزدیک به صفر.' : 'Line-rate hardware encryption with near-zero software attack surface.',
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
    desc: locale.value === 'fa' ? 'اندازه‌گیری شاخص‌های کیفیت خدمات و تجربه (QoS/QoE) در شبکه‌های نسل ۲ تا ۵.' : 'Real-time QoS and QoE measurement in 2G to 5G networks.',
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
  { icon: resolveComponent('IconFpgaChip'), title: t('common.fpga_native'), desc: locale.value === 'fa' ? 'منطق مسیر داده در سخت‌افزار پیاده‌سازی می‌شود، نه روی سیستم‌عامل عمومی.' : 'The data path is implemented in hardware logic, not on a general-purpose operating system.' },
  { icon: resolveComponent('IconAesLock'), title: t('common.os_less'), desc: locale.value === 'fa' ? 'صفحه کنترل بدون وابستگی به نرم‌افزار عمومی، با سطح حمله کوچک‌تر.' : 'Control surfaces avoid general-purpose software dependencies and reduce the attack surface.' },
  { icon: resolveComponent('IconComplianceCert'), title: t('trust.title'), desc: locale.value === 'fa' ? 'تصمیم‌های خرید با گواهی‌نامه، SLA و تعهد قطعات یدکی پشتیبانی می‌شوند.' : 'Buying decisions are supported with certifications, SLA details, and spare-parts commitments.' },
  { icon: resolveComponent('IconMadeInIran'), title: t('common.made_in_iran'), desc: locale.value === 'fa' ? 'طراحی، ساخت و آزمون در زنجیره مهندسی کنترل‌شده داخلی انجام می‌شود.' : 'Design, manufacturing, and validation stay inside a controlled domestic engineering chain.' },
])

</script>
