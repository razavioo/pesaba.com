<template>
  <div v-if="v2Home">
    <ContentBlocks :blocks="v2Home.translation.blocks" :locale="locale === 'fa' ? 'fa' : 'en'" />
  </div>
  <div v-else>
    <TopologyHero :hero-image="homeData.heroImage" />

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
              <p>{{ locale === 'fa' ? 'پرتو ارتباط صبا به سازمان‌ها کمک می‌کند داده را با کنترل بیشتر جابه‌جا کنند، شبکه‌های حساس را از مسیرهای پرریسک جدا نگه دارند و کیفیت ارتباطات خود را بهتر ببینند.' : 'Pesaba helps organizations move data with greater control, separate sensitive networks from risky paths, and see the quality of their communications more clearly.' }}</p>
              <p>{{ locale === 'fa' ? 'از دیتا دیود و رمزکننده شبکه تا تجهیزات انتقال مخابراتی و پایش آب و شبکه سلولی، راهکارها برای محیط‌های صنعتی و زیرساخت‌های حیاتی ساخته شده‌اند. مشخصات دقیق هر مدل در صفحه همان محصول آمده است.' : 'From data diodes and network encryptors to telecom transport and water and cellular monitoring, our solutions are built for industrial environments and critical infrastructure. Exact model specifications are available on each product page.' }}</p>
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
                {{ locale === 'fa' ? 'وقتی شبکه حساس نباید مسیر برگشت داشته باشد، دیتا دیودهای سری G داده را فقط در جهت تعریف‌شده عبور می‌دهند. از صفحه محصولات، مدل مناسب سرعت، نوع شبکه و شیوه استقرار خود را پیدا کنید.' : 'When a sensitive network must not have a return path, G-Series data diodes move data only in the defined direction. Explore the product range to find the right model for your link speed, network, and deployment.' }}
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
            {{ locale === 'fa' ? 'لازم نیست از نام فناوری شروع کنید. مسئله خود را انتخاب کنید تا به راهکارها و محصولات مرتبط برسید.' : 'You do not need to start with a technology name. Choose the problem you need to solve and find the related solutions and products.' }}
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

const { get, list } = usePublicCms()
const { get: getV2 } = usePublicCmsV2()
const { data: v2Home } = await useAsyncData('home-page-v2', () => getV2('page', 'home', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const { data: homePage } = await useAsyncData('home-page', () => get('page', 'home', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const homeData = computed(() => {
  const data = homePage.value as { heroImage?: string; statsProductsImage?: string; statsCategoriesImage?: string; statsLocalesImage?: string } | null
  return {
    heroImage: data?.heroImage || '/images/hero-bg.png',
    statsProductsImage: data?.statsProductsImage || '/images/stats/products.png',
    statsCategoriesImage: data?.statsCategoriesImage || '/images/stats/categories.png',
    statsLocalesImage: data?.statsLocalesImage || '/images/stats/years.png',
  }
})
const { data: featuredArticles } = await useAsyncData('home-articles', async () =>
  (await list('article', locale.value as 'fa' | 'en')).sort((first: any, second: any) => String(second.date || second.updatedAt).localeCompare(String(first.date || first.updatedAt))).slice(0, 4), { watch: [locale] },
)
const featuredProductIds = ['g200', 'emx-6', 'g300', 'capella', 'orazan']
const featuredProductImages: Record<string, string> = { g200: '/photos/g200/photo-1.webp', 'emx-6': '/photos/emx-6/photo-1.webp', g300: '/photos/g300/photo-1.webp', capella: '/photos/capella/photo-1.webp', orazan: '/photos/orazan/photo-1.webp' }
const { data: productRecords } = await useAsyncData('home-featured-products', () => list('product', locale.value as 'fa' | 'en'), { watch: [locale] })


const applicationSegments = computed(() => locale.value === 'fa' ? [
  {
    badge: 'OT/IT',
    title: 'مرزبندی امن شبکه‌های عملیاتی',
    desc: 'فرستادن داده موردنیاز از محیط حساس به شبکه سازمانی، بدون باز گذاشتن مسیر برگشت.',
    to: '/use-cases/one-way-data-transfer',
    tags: ['دیتادیود', 'یک‌طرفه', 'SCADA'],
  },
  {
    badge: 'AES',
    title: 'رمزنگاری لینک‌های حساس',
    desc: 'محافظت از ارتباط بین سایت‌ها و لینک‌های زیرساختی در برابر شنود و دست‌کاری.',
    to: '/use-cases/aes-256-network-encryption',
    tags: ['AES-256', 'FPGA', 'بدون OS'],
  },
  {
    badge: 'QoS',
    title: 'پایش کیفیت شبکه سلولی',
    desc: 'پیدا کردن افت پوشش و کیفیت سرویس از طریق اندازه‌گیری میدانی و گزارش متمرکز.',
    to: '/use-cases/cellular-quality-monitoring',
    tags: ['2G/3G/4G', 'QoS', 'میدانی'],
  },
  {
    badge: 'SDH',
    title: 'انتقال مخابراتی و شبکه اپراتوری',
    desc: 'اتصال شبکه‌های قدیمی و جدید با رابط‌های SDH، E1 و اترنت، بدون تعویض شتاب‌زده زیرساخت.',
    to: '/products/telecom-transmission',
    tags: ['SDH/E1', 'Carrier', 'Transport'],
  },
  {
    badge: 'Grid',
    title: 'زیرساخت‌های حیاتی و صنایع حساس',
    desc: 'محافظت و پایش شبکه‌هایی که توقف یا نفوذ در آن‌ها هزینه سنگینی دارد.',
    to: '/industries/power-grid',
    tags: ['زیرساخت حیاتی', 'OT', 'اعتماد'],
  },
  {
    badge: 'Water',
    title: 'پایش زیست‌محیطی و کیفیت آب',
    desc: 'تشخیص زودهنگام تغییرات خطرناک آب و ارسال هشدار برای واکنش سریع‌تر.',
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

const featuredProducts = computed(() => featuredProductIds.flatMap((id, index) => {
  const record = (productRecords.value || []).find(item => item.slug === id)
  if (!record) return []
  const gallery = Array.isArray(record.gallery) ? record.gallery : []
  return [{ id, title: record.title, titleFa: record.title_fa || record.title, desc: record.description, image: typeof record.image === 'string' ? record.image : typeof gallery[0] === 'string' ? gallery[0] : featuredProductImages[id], to: localePath(`/products/${record.category}/${record.slug}`), class: index === 2 ? 'col-span-1 md:col-span-2' : 'col-span-1', isWide: index === 2 }]
}))

const buildPillars = computed(() => [
  { icon: resolveComponent('IconFpgaChip'), title: locale.value === 'fa' ? 'پردازش کنترل‌شده' : t('common.fpga_native'), desc: locale.value === 'fa' ? 'در مدل‌های منتخب، بخشی از پردازش داده در منطق سخت‌افزاری انجام می‌شود تا رفتار دستگاه سریع و قابل پیش‌بینی بماند.' : 'On selected models, parts of the data path use hardware logic for fast, predictable behaviour.' },
  { icon: resolveComponent('IconAesLock'), title: locale.value === 'fa' ? 'وابستگی کمتر به نرم‌افزار عمومی' : t('common.os_less'), desc: locale.value === 'fa' ? 'برخی محصولات مسیر داده را از سرویس‌های غیرضروری جدا می‌کنند تا نقاط قابل حمله و پیچیدگی نگهداری کمتر شود.' : 'Some products reduce dependence on unnecessary services to limit attack paths and maintenance complexity.' },
  { icon: resolveComponent('IconComplianceCert'), title: locale.value === 'fa' ? 'اطلاعات روشن' : t('trust.title'), desc: locale.value === 'fa' ? 'مشخصات، محدودیت‌ها و مدارک قابل ارائه را روشن بیان می‌کنیم تا تصمیم‌گیری شما بر پایه اطلاعات واقعی باشد.' : 'We make specifications, limitations, and available evidence clear so decisions are based on real information.' },
  { icon: resolveComponent('IconMadeInIran'), title: locale.value === 'fa' ? 'همراهی در مسیر اجرا' : t('common.made_in_iran'), desc: locale.value === 'fa' ? 'از انتخاب مدل تا اتصال و پشتیبانی، برای پیدا کردن مسیر مناسب استقرار کنار شما هستیم.' : 'We support the path from model selection through connection and deployment.' },
])

</script>
