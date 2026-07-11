<template>
  <div>
    <section class="page-hero">
      <div class="container-site pb-10 pt-12">
        <nav class="mb-6 flex items-center gap-2 text-xs text-white/40" :aria-label="$t('common.breadcrumb')">
          <NuxtLink :to="localePath('/trust')" class="transition-colors hover:text-white/70">{{ $t('trust.title') }}</NuxtLink>
          <span>/</span>
          <span class="text-white/60">{{ page.title }}</span>
        </nav>
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ page.eyebrow }}</div>
          <h1 class="mb-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            {{ page.title }}
          </h1>
          <p class="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {{ page.intro }}
          </p>
        </div>
      </div>
    </section>

    <section class="border-b border-[var(--border)]">
      <div class="container-site py-8">
        <div class="border-s-4 border-amber-500 bg-amber-50 p-5 text-amber-950">
          <div class="mb-2 text-xs font-bold uppercase text-amber-800">{{ page.reviewLabel }}</div>
          <p class="max-w-4xl text-sm leading-relaxed">{{ page.reviewNotice }}</p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <div class="label-meta mb-3">{{ page.readingEyebrow }}</div>
          <h2 class="mb-4 text-2xl font-bold text-[var(--text-primary)]">{{ page.readingTitle }}</h2>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ page.readingIntro }}</p>
        </div>
        <dl class="grid gap-5 sm:grid-cols-3">
          <div v-for="item in page.definitions" :key="item.term" class="border-s-2 border-[var(--border)] ps-4">
            <dt class="mb-2 text-sm font-semibold text-[var(--text-primary)]">{{ item.term }}</dt>
            <dd class="text-xs leading-relaxed text-[var(--text-secondary)]">{{ item.definition }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site">
        <div class="mb-8 max-w-3xl">
          <div class="label-meta mb-3">{{ page.frameworksEyebrow }}</div>
          <h2 class="mb-3 text-2xl font-bold text-[var(--text-primary)]">{{ page.frameworksTitle }}</h2>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ page.frameworksIntro }}</p>
        </div>

        <div class="grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
          <article v-for="framework in frameworks" :key="framework.name" class="bg-[var(--bg-elevated)] p-6">
            <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="text-base font-bold text-[var(--text-primary)]">{{ framework.name }}</h3>
                <p class="mt-1 text-xs text-[var(--text-muted)]">{{ framework.kind }}</p>
              </div>
              <span class="border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-800">
                {{ page.evidenceReview }}
              </span>
            </div>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ framework.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div class="label-meta mb-3">{{ page.evidenceEyebrow }}</div>
          <h2 class="mb-4 text-2xl font-bold text-[var(--text-primary)]">{{ page.evidenceTitle }}</h2>
          <p class="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">{{ page.evidenceIntro }}</p>
          <ul class="space-y-3">
            <li v-for="item in page.evidenceItems" :key="item" class="list-dot text-sm text-[var(--text-secondary)]">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8">
          <h2 class="mb-3 text-xl font-bold text-[var(--text-primary)]">{{ page.requestTitle }}</h2>
          <p class="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">{{ page.requestText }}</p>
          <p class="mb-6 border-s-2 border-amber-500 ps-3 text-xs leading-relaxed text-[var(--text-muted)]">
            {{ page.sensitiveNotice }}
          </p>
          <BaseButton :to="localePath('/company/contact') + '?dept=sales'" variant="primary" size="md">
            {{ page.requestCta }}
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const page = computed(() => locale.value === 'fa' ? {
  eyebrow: 'شفافیت مستندات',
  title: 'وضعیت مستندات انطباق',
  intro: 'این صفحه تفاوت میان هم‌راستایی فنی، گواهی محصول و گواهی سازمانی را روشن می‌کند. وضعیت هیچ محصولی تا انتشار مدرک قابل راستی‌آزمایی، «تأییدشده» نمایش داده نمی‌شود.',
  reviewLabel: 'در حال بازبینی شواهد',
  reviewNotice: 'انتشار عمومی ماتریس محصول‌به‌استاندارد موقتاً متوقف است. اشاره‌های قبلی به استانداردها یا نهادها به‌تنهایی اثبات‌کننده صدور گواهی، دامنه اعتبار یا پوشش همه مدل‌ها و نسخه‌ها نیستند.',
  readingEyebrow: 'راهنمای خواندن ادعاها',
  readingTitle: 'سه مفهوم متفاوت',
  readingIntro: 'در ارزیابی خرید، این سه وضعیت نباید به جای یکدیگر استفاده شوند. هر ادعا باید دقیقاً به محصول، نسخه، دامنه و مدرک مربوط متصل باشد.',
  definitions: [
    { term: 'هم‌راستایی فنی', definition: 'نگاشت قابلیت‌ها یا کنترل‌های محصول به یک راهنما یا الزام؛ به معنی صدور گواهی نیست.' },
    { term: 'گواهی محصول', definition: 'ارزیابی یک مدل یا نسخه مشخص توسط مرجع مشخص و در یک دامنه تعریف‌شده.' },
    { term: 'گواهی سازمانی', definition: 'گواهی یک سامانه مدیریتی یا دامنه سازمانی؛ خودبه‌خود به محصولات تسری پیدا نمی‌کند.' },
  ],
  frameworksEyebrow: 'چارچوب‌های مورد اشاره',
  frameworksTitle: 'نوع هر استاندارد و مدرک موردنیاز',
  frameworksIntro: 'فهرست زیر صرفاً ماهیت چارچوب‌ها را توضیح می‌دهد و ادعای انطباق یا گواهی برای محصولات پرتو ارتباط صبا نیست.',
  evidenceReview: 'مدرک عمومی منتشر نشده',
  evidenceEyebrow: 'حداقل شواهد',
  evidenceTitle: 'چه چیزی یک ادعا را قابل اتکا می‌کند؟',
  evidenceIntro: 'پیش از انتشار وضعیت تأییدشده، این اطلاعات باید قابل ارائه و راستی‌آزمایی باشند:',
  evidenceItems: [
    'شماره گواهی یا گزارش ارزیابی و نام مرجع صادرکننده یا آزمایشگاه',
    'نام دقیق دارنده، مدل محصول، نسخه سخت‌افزار و در صورت ارتباط نسخه فریم‌ور',
    'دامنه ارزیابی، پروفایل یا کنترل‌های پوشش‌داده‌شده و استثناها',
    'تاریخ صدور، تاریخ انقضا یا وضعیت اعتبار و مسیر راستی‌آزمایی مستقل',
  ],
  requestTitle: 'درخواست مستندات خرید',
  requestText: 'تیم فروش فنی پس از مشخص‌شدن محصول، نسخه و الزام پروژه، وضعیت مدارک قابل ارائه را اعلام می‌کند. ارائه هر سند تابع سطح دسترسی و شرایط قراردادی آن است.',
  sensitiveNotice: 'در فرم عمومی، رمز عبور، کلید رمزنگاری، پیکربندی عملیاتی، اطلاعات طبقه‌بندی‌شده یا داده مشتریان را ارسال نکنید. در صورت نیاز، ابتدا مسیر تبادل مناسب را هماهنگ کنید.',
  requestCta: 'ثبت درخواست مستندات',
} : {
  eyebrow: 'Evidence transparency',
  title: 'Compliance evidence status',
  intro: 'This page distinguishes technical alignment, product certification, and organisational certification. No product is presented as certified until verifiable evidence can be published.',
  reviewLabel: 'Evidence review in progress',
  reviewNotice: 'The public product-to-standard matrix is temporarily withdrawn. Previous references to standards or authorities do not, by themselves, prove certification, scope, validity, or coverage of every model and version.',
  readingEyebrow: 'How to read claims',
  readingTitle: 'Three distinct concepts',
  readingIntro: 'These states are not interchangeable during procurement. Every claim must be tied to the applicable product, version, scope, and evidence.',
  definitions: [
    { term: 'Technical alignment', definition: 'Mapping product capabilities or controls to guidance or requirements; this is not a certification.' },
    { term: 'Product certification', definition: 'Assessment of a specific model or version by an identified authority and within a defined scope.' },
    { term: 'Organisational certification', definition: 'Certification of a management system or organisational scope; it does not automatically cover products.' },
  ],
  frameworksEyebrow: 'Referenced frameworks',
  frameworksTitle: 'Framework type and required evidence',
  frameworksIntro: 'The list below explains the nature of common references. It is not a claim that Pesaba products comply with or are certified against them.',
  evidenceReview: 'No public evidence published',
  evidenceEyebrow: 'Minimum evidence',
  evidenceTitle: 'What makes a claim reliable?',
  evidenceIntro: 'Before a verified status is published, the following information must be available and independently checkable:',
  evidenceItems: [
    'Certificate or assessment-report number and the issuing authority or laboratory',
    'Exact holder, product model, hardware revision, and firmware version where relevant',
    'Assessment scope, profile or controls covered, and documented exclusions',
    'Issue date, expiry or current validity status, and an independent verification route',
  ],
  requestTitle: 'Request procurement evidence',
  requestText: 'Sales engineering will confirm which documents can be supplied after the product, version, and project requirement are identified. Access may depend on the document classification and contract terms.',
  sensitiveNotice: 'Do not submit passwords, cryptographic keys, operational configurations, classified information, or customer data through the public form. Coordinate an appropriate exchange channel first.',
  requestCta: 'Request documentation',
})

const frameworks = computed(() => locale.value === 'fa' ? [
  { name: 'IEC 62443', kind: 'مجموعه استاندارد امنیت سامانه‌های کنترل صنعتی', note: 'ادعای انطباق باید بخش دقیق استاندارد، نقش محصول، سطح یا الزامات ارزیابی‌شده و گزارش مربوط را مشخص کند.' },
  { name: 'NIST SP 800-82', kind: 'راهنمای امنیت OT', note: 'این سند راهنما است، نه برنامه صدور گواهی محصول. می‌توان کنترل‌های محصول را به توصیه‌های آن نگاشت کرد.' },
  { name: 'NERC CIP', kind: 'الزامات بهره‌برداران صنعت برق', note: 'مسئولیت انطباق بر عهده نهاد مشمول است. یک محصول می‌تواند از کنترل‌ها پشتیبانی کند، اما عبارت «دارای گواهی NERC CIP» نیازمند مبنای مستقل است.' },
  { name: 'Common Criteria', kind: 'ارزیابی امنیتی محصول', note: 'ادعا باید شماره گواهی، مرجع اعتباردهی، Security Target، سطح EAL و نسخه دقیق محصول را ارائه کند.' },
  { name: 'FIPS 140', kind: 'اعتبارسنجی ماژول رمزنگاری', note: 'استفاده از AES-256 معادل اعتبارسنجی FIPS نیست. شماره گواهی CMVP و مرز ماژول برای ادعا لازم است.' },
  { name: 'ISO/IEC 27001', kind: 'گواهی سامانه مدیریت امنیت اطلاعات', note: 'این گواهی معمولاً سازمان و دامنه ISMS را پوشش می‌دهد، نه اینکه یک محصول را به‌عنوان محصول امن تأیید کند.' },
  { name: 'ارزیابی‌های ملی / افتا', kind: 'ارزیابی یا مجوز ملی با دامنه مشخص', note: 'نوع مجوز، مرجع، شماره، دارنده، مدل و مدت اعتبار باید پیش از نمایش وضعیت تأییدشده مشخص باشند.' },
  { name: 'ITU-T', kind: 'توصیه‌های فنی مخابرات', note: 'سازگاری با یک توصیه مشخص باید با شماره سند و آزمون‌های مربوط بیان شود؛ اشاره کلی به ITU-T گواهی محصول نیست.' },
] : [
  { name: 'IEC 62443', kind: 'Industrial control-system security standards', note: 'Any conformity claim must identify the exact part, product role, assessed requirements or level, and the supporting report.' },
  { name: 'NIST SP 800-82', kind: 'OT security guidance', note: 'This publication is guidance, not a product-certification programme. Product controls may be mapped to its recommendations.' },
  { name: 'NERC CIP', kind: 'Requirements for covered power-sector entities', note: 'Compliance belongs to the regulated entity. A product may support controls, but a generic “NERC CIP certified” label requires an independent basis.' },
  { name: 'Common Criteria', kind: 'Product security evaluation', note: 'A claim requires a certificate number, scheme, Security Target, EAL, and the exact evaluated product version.' },
  { name: 'FIPS 140', kind: 'Cryptographic-module validation', note: 'Using AES-256 is not the same as FIPS validation. A CMVP certificate number and validated module boundary are required.' },
  { name: 'ISO/IEC 27001', kind: 'Information-security management certification', note: 'This normally covers an organisation and ISMS scope; it does not certify a product as secure.' },
  { name: 'National / AFTA assessments', kind: 'National evaluation or licence with a defined scope', note: 'The document type, authority, number, holder, model, and validity period must be known before a verified status is shown.' },
  { name: 'ITU-T', kind: 'Telecommunication recommendations', note: 'Compatibility must identify the applicable recommendation and tests. A generic ITU-T reference is not product certification.' },
])

useSeoMeta({
  title: computed(() => `${page.value.title} | Pesaba`),
  description: computed(() => page.value.intro),
  robots: 'noindex, nofollow',
})
</script>
