<template>
  <div>
    <section class="page-hero">
      <div class="container-site pb-10 pt-12">
        <nav class="mb-6 flex items-center gap-2 text-xs text-white/40" :aria-label="$t('common.breadcrumb')">
          <NuxtLink :to="localePath('/legal')" class="transition-colors hover:text-white/70">{{ locale === 'fa' ? 'سیاست‌های وب‌سایت' : 'Website policies' }}</NuxtLink>
          <span>/</span>
          <span class="text-white/60">{{ policy.title }}</span>
        </nav>
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ policy.eyebrow }}</div>
          <h1 class="mb-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">{{ policy.title }}</h1>
          <p class="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{{ policy.intro }}</p>
          <p class="mt-5 text-xs text-white/40">{{ policy.updated }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article class="max-w-4xl">
          <div v-if="policy.notice" class="mb-8 border-s-4 border-amber-500 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
            {{ policy.notice }}
          </div>

          <section v-for="section in policy.sections" :key="section.heading" class="border-b border-[var(--border)] py-7 first:pt-0 last:border-b-0">
            <h2 class="mb-4 text-xl font-bold text-[var(--text-primary)]">{{ section.heading }}</h2>
            <div class="space-y-3">
              <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-sm leading-7 text-[var(--text-secondary)]">
                {{ paragraph }}
              </p>
            </div>
            <ul v-if="section.items?.length" class="mt-4 space-y-3">
              <li v-for="item in section.items" :key="item" class="list-dot text-sm leading-7 text-[var(--text-secondary)]">
                {{ item }}
              </li>
            </ul>
          </section>

          <div class="mt-8 border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
            <h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">{{ policy.contactTitle }}</h2>
            <p class="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{{ policy.contactText }}</p>
            <a :href="policy.contactHref" class="text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">
              {{ policy.contactLabel }}
            </a>
          </div>
        </article>

        <aside class="lg:border-s lg:border-[var(--border)] lg:ps-6">
          <div class="label-meta mb-4">{{ locale === 'fa' ? 'سیاست‌های مرتبط' : 'Related policies' }}</div>
          <nav class="flex flex-col gap-3">
            <NuxtLink
              v-for="item in relatedPolicies"
              :key="item.slug"
              :to="localePath(`/legal/${item.slug}`)"
              class="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface PolicySection {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

interface PolicyPage {
  eyebrow: string
  title: string
  intro: string
  updated: string
  notice?: string
  sections: PolicySection[]
  contactTitle: string
  contactText: string
  contactLabel: string
  contactHref: string
}

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const slug = String(route.params.slug)
const publicEmail = 'admin@pesaba.com'

const policies: Record<'fa' | 'en', Record<string, PolicyPage>> = {
  fa: {
    privacy: {
      eyebrow: 'حریم خصوصی',
      title: 'سیاست حریم خصوصی وب‌سایت',
      intro: 'این سیاست توضیح می‌دهد پرتو ارتباط صبا هنگام بازدید از pesaba.com یا ارسال درخواست، چه اطلاعاتی دریافت می‌کند و چگونه از آن استفاده می‌کند.',
      updated: 'آخرین بازبینی: ۲۰ تیر ۱۴۰۵',
      notice: 'فرم عمومی وب‌سایت برای اطلاعات طبقه‌بندی‌شده یا اسرار عملیاتی طراحی نشده است. رمز عبور، کلید رمزنگاری، پیکربندی شبکه، داده تولید یا اطلاعات شخص ثالث را در آن وارد نکنید.',
      sections: [
        {
          heading: 'مسئول پردازش اطلاعات',
          paragraphs: ['شرکت پرتو ارتباط صبا، با نام تجاری Pesaba، اطلاعاتی را که از طریق این وب‌سایت و کانال‌های تماس درج‌شده در آن دریافت می‌شود برای اهداف شرح‌داده‌شده در این سیاست مدیریت می‌کند.'],
        },
        {
          heading: 'اطلاعاتی که دریافت می‌کنیم',
          items: [
            'اطلاعاتی که خودتان در فرم تماس ارائه می‌کنید؛ مانند نام، ایمیل، تلفن، سازمان، سمت، کشور، محصول موردنظر و متن پیام.',
            'برای درخواست پشتیبانی، اطلاعات لازم برای شناسایی محصول مانند مدل، شماره سریال و نسخه نصب‌شده؛ فقط در حد لازم برای رسیدگی.',
            'لاگ‌های فنی و امنیتی معمول سرور مانند نشانی IP، زمان درخواست، مسیر درخواست‌شده، نوع مرورگر و خطاهای سامانه.',
            'کوکی ضروری ترجیح زبان با نام pesaba_locale تا نسخه فارسی یا انگلیسی انتخاب‌شده حفظ شود.',
          ],
        },
        {
          heading: 'هدف استفاده',
          items: [
            'پاسخ به درخواست فروش، دمو، همکاری، استخدام یا پشتیبانی فنی و پیگیری همان درخواست.',
            'تهیه پیشنهاد، تطبیق محصول و اجرای تعهدات قراردادی یا اقدامات پیش از قرارداد.',
            'حفاظت از وب‌سایت، جلوگیری از سوءاستفاده، عیب‌یابی و نگهداری سوابق امنیتی لازم.',
            'انجام تکالیف قانونی، حسابداری یا حل اختلاف در صورت لزوم.',
          ],
        },
        {
          heading: 'اشتراک‌گذاری و فروش اطلاعات',
          paragraphs: [
            'اطلاعات برای فروش به اشخاص ثالث جمع‌آوری نمی‌شود. ممکن است ارائه‌دهندگان میزبانی، ایمیل یا پشتیبانی فنی در حد لازم برای ارائه خدمت به اطلاعات دسترسی پردازشی داشته باشند و باید مطابق قرارداد و الزامات قابل اعمال از آن محافظت کنند.',
            'در صورت الزام قانونی یا برای حفاظت از حقوق و امنیت شرکت و کاربران، ممکن است اطلاعات لازم در اختیار مرجع صالح قرار گیرد.',
          ],
        },
        {
          heading: 'نگهداری و حفاظت',
          paragraphs: [
            'اطلاعات فقط تا زمانی نگهداری می‌شود که برای رسیدگی به درخواست، رابطه قراردادی، الزامات قانونی یا امنیت سامانه لازم باشد؛ سپس حذف، ناشناس‌سازی یا بایگانی محدود می‌شود.',
            'کنترل‌های فنی و سازمانی متناسب برای حفاظت از اطلاعات به‌کار می‌روند، اما هیچ انتقال اینترنتی یا سامانه ذخیره‌سازی را نمی‌توان کاملاً بدون ریسک دانست.',
          ],
        },
        {
          heading: 'درخواست‌های شما',
          paragraphs: ['می‌توانید درباره اطلاعاتی که مستقیماً ارائه کرده‌اید، درخواست دسترسی، اصلاح یا حذف ثبت کنید. انجام درخواست ممکن است تابع احراز هویت، تعهدات قراردادی، نگهداری قانونی و حقوق اشخاص دیگر باشد. این وب‌سایت برای افراد زیر ۱۸ سال طراحی نشده است.'],
        },
        {
          heading: 'تغییرات این سیاست',
          paragraphs: ['در صورت تغییر شیوه پردازش یا امکانات سایت، متن و تاریخ بازبینی این صفحه به‌روزرسانی می‌شود. نسخه منتشرشده در این صفحه، سیاست جاری وب‌سایت است.'],
        },
      ],
      contactTitle: 'درخواست حریم خصوصی',
      contactText: 'موضوع ایمیل را «درخواست حریم خصوصی» قرار دهید و فقط اطلاعات لازم برای شناسایی درخواست خود را ارسال کنید.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('درخواست حریم خصوصی')}`,
    },
    terms: {
      eyebrow: 'شرایط استفاده',
      title: 'شرایط استفاده از وب‌سایت',
      intro: 'با استفاده از pesaba.com این شرایط را می‌پذیرید. قراردادها، پیشنهادهای امضاشده و اسناد خرید مرتبط با هر پروژه بر اطلاعات عمومی وب‌سایت اولویت دارند.',
      updated: 'آخرین بازبینی: ۲۰ تیر ۱۴۰۵',
      sections: [
        {
          heading: 'هدف و ماهیت اطلاعات سایت',
          paragraphs: ['محتوای سایت برای معرفی عمومی شرکت، محصولات، راهکارها و منابع آموزشی ارائه می‌شود و به‌تنهایی پیشنهاد الزام‌آور، تضمین عملکرد، مشاوره امنیتی یا تعهد قراردادی نیست.'],
        },
        {
          heading: 'مشخصات، موجودی و ادعاهای فنی',
          paragraphs: ['مشخصات، سازگاری، قابلیت‌ها، موجودی، قیمت، زمان تحویل، گارانتی، سطح خدمت و چرخه عمر باید برای مدل، نسخه و سفارش موردنظر در پیشنهاد فنی یا قرارداد تأیید شوند. اشاره به استاندارد، الگوریتم یا چارچوب به معنی صدور گواهی نیست مگر مدرک دارای دامنه و اعتبار مشخص ارائه شود.'],
        },
        {
          heading: 'استفاده مجاز',
          items: [
            'از سایت برای اهداف قانونی و بدون ایجاد اختلال، دسترسی غیرمجاز یا نقض حقوق دیگران استفاده کنید.',
            'اسکن فعال، آزمون نفوذ، دورزدن کنترل‌ها، استخراج انبوه محتوا یا آزمون سامانه‌های مشتریان بدون مجوز کتبی مجاز نیست.',
            'در فرم‌ها محتوای مخرب، اطلاعات غیرقانونی یا داده‌ای که اختیار افشای آن را ندارید ارسال نکنید.',
          ],
        },
        {
          heading: 'مالکیت فکری',
          paragraphs: ['نام‌ها، علائم، متن، تصویر، نقشه، مستندات و سایر محتوای سایت متعلق به پرتو ارتباط صبا یا صاحبان مجوز مربوط است. مشاهده و ارجاع متعارف مجاز است؛ بازنشر، تغییر یا استفاده تجاری نیازمند اجازه قبلی است مگر قانون خلاف آن را مقرر کند.'],
        },
        {
          heading: 'پیوندها و خدمات ثالث',
          paragraphs: ['پیوند به وب‌سایت یا خدمت ثالث به معنی تأیید همه محتوای آن نیست. شرایط، حریم خصوصی و دسترس‌پذیری آن خدمات تحت کنترل ارائه‌دهنده مربوط است.'],
        },
        {
          heading: 'دسترس‌پذیری و مسئولیت',
          paragraphs: ['برای دقت و تداوم دسترسی تلاش می‌شود، اما سایت ممکن است برای نگهداری، خطا یا عوامل خارج از کنترل موقتاً در دسترس نباشد. حدود مسئولیت تابع قانون قابل اعمال و قرارداد کتبی مرتبط است و هیچ بخش این شرایط حقوق غیرقابل اسقاط قانونی را محدود نمی‌کند.'],
        },
        {
          heading: 'تغییرات و قانون قابل اعمال',
          paragraphs: ['ممکن است سایت یا این شرایط با درج تاریخ جدید تغییر کند. موضوعات قراردادی مطابق قرارداد امضاشده و سایر موارد مطابق قوانین و مراجع صالح قابل اعمال رسیدگی می‌شوند.'],
        },
      ],
      contactTitle: 'پرسش درباره شرایط استفاده',
      contactText: 'برای مجوز استفاده از محتوا یا پرسش درباره این شرایط با ما تماس بگیرید.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('شرایط استفاده از وب‌سایت')}`,
    },
    security: {
      eyebrow: 'افشای مسئولانه',
      title: 'گزارش آسیب‌پذیری امنیتی',
      intro: 'گزارش دقیق و مسئولانه مسائل امنیتی به ما کمک می‌کند ریسک را ارزیابی و اصلاح کنیم. این صفحه مجوز عمومی برای آزمون فعال سامانه‌ها صادر نمی‌کند.',
      updated: 'آخرین بازبینی: ۲۰ تیر ۱۴۰۵',
      notice: 'هیچ‌گاه داده واقعی مشتری، رمز عبور، کلید خصوصی، فایل پیکربندی یا اطلاعات طبقه‌بندی‌شده را با گزارش اولیه ارسال نکنید. ابتدا یک خلاصه کم‌خطر بفرستید تا در صورت نیاز مسیر مناسب تبادل هماهنگ شود.',
      sections: [
        {
          heading: 'دامنه گزارش',
          paragraphs: ['می‌توانید آسیب‌پذیری مشکوک در دامنه pesaba.com یا محصول فعلی پرتو ارتباط صبا را گزارش کنید، مشروط بر اینکه مالک سامانه باشید یا برای ارزیابی آن مجوز صریح داشته باشید. آزمون تجهیزات یا شبکه مشتریان و اشخاص ثالث خارج از دامنه است.'],
        },
        {
          heading: 'پیش از هر آزمون فعال',
          paragraphs: ['یافته‌های حاصل از مشاهده عادی یا بررسی غیرفعال را می‌توان مستقیماً گزارش کرد. برای اسکن، بهره‌برداری آزمایشی، آزمون احراز هویت یا هر اقدام فعال، ابتدا مجوز کتبی و محدوده آزمون دریافت کنید.'],
        },
        {
          heading: 'فعالیت‌های غیرمجاز',
          items: [
            'اختلال سرویس، حمله منع سرویس، تخریب یا تغییر داده و ایجاد حساب یا دسترسی پایدار.',
            'مهندسی اجتماعی، فیشینگ، آزمون فیزیکی، آزمون کارکنان، تأمین‌کنندگان یا مشتریان.',
            'دسترسی فراتر از حداقل اثبات، مشاهده داده اشخاص، انتقال فایل حساس یا انتشار پیش از هماهنگی.',
          ],
        },
        {
          heading: 'محتوای گزارش',
          items: [
            'دارایی، URL، مدل محصول و نسخه سخت‌افزار یا فریم‌ور در صورت ارتباط.',
            'شرح اثر امنیتی، پیش‌نیازها و مراحل بازتولید کم‌خطر و حداقلی.',
            'شواهد پاک‌سازی‌شده مانند درخواست و پاسخ نمونه، بدون داده شخصی یا اسرار.',
            'راه تماس و ترجیح شما درباره نام‌بردن یا ناشناس ماندن در صورت انتشار اطلاعیه.',
          ],
        },
        {
          heading: 'روند بررسی و افشا',
          paragraphs: ['دریافت گزارش به معنی تأیید آسیب‌پذیری نیست. گزارش بر اساس شدت و امکان بازتولید بررسی می‌شود و ممکن است اطلاعات تکمیلی درخواست شود. زمان پاسخ یا اصلاح ثابت تضمین نمی‌شود؛ در صورت تأیید، زمان‌بندی افشا با توجه به ریسک کاربران و آماده‌بودن راهکار هماهنگ خواهد شد.'],
        },
        {
          heading: 'پاداش و مجوز',
          paragraphs: ['در حال حاضر برنامه عمومی باگ‌بانتی یا پاداش تضمین‌شده اعلام نشده است. این سیاست مجوز آزمون سامانه مشتریان، خدمات ثالث یا فعالیتی فراتر از قانون و مجوز کتبی نیست.'],
        },
      ],
      contactTitle: 'ارسال گزارش اولیه',
      contactText: 'موضوع ایمیل را با [SECURITY] آغاز کنید و در پیام اول فقط خلاصه، دارایی درگیر و اثر احتمالی را بنویسید.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('[SECURITY] Vulnerability report')}`,
    },
    accessibility: {
      eyebrow: 'دسترس‌پذیری',
      title: 'بیانیه دسترس‌پذیری',
      intro: 'هدف ما این است که اطلاعات عمومی محصولات و شرکت برای طیف گسترده‌تری از کاربران، ابزارهای کمکی و روش‌های ورودی قابل استفاده باشد.',
      updated: 'آخرین بازبینی: ۲۰ تیر ۱۴۰۵',
      sections: [
        {
          heading: 'هدف دسترس‌پذیری',
          paragraphs: ['در توسعه و بازبینی سایت، WCAG 2.2 سطح AA به‌عنوان هدف فنی استفاده می‌شود. این بیان هدف است و به معنی ادعای انطباق کامل یا گواهی دسترس‌پذیری در وضعیت فعلی نیست.'],
        },
        {
          heading: 'اقدامات موردنظر',
          items: [
            'ساختار معنایی، عنوان‌های منظم، برچسب فرم و امکان استفاده با صفحه‌کلید.',
            'کنتراست خوانا، نمایش واضح فوکوس، چیدمان واکنش‌گرا و پشتیبانی از راست‌به‌چپ.',
            'متن جایگزین برای تصاویر معنادار و جلوگیری از وابستگی صرف به رنگ برای انتقال مفهوم.',
            'آزمون دوره‌ای صفحات و گردش‌های اصلی با ابزار خودکار و بررسی دستی.',
          ],
        },
        {
          heading: 'محدودیت‌های شناخته‌شده',
          paragraphs: ['برخی PDFها، نقشه‌های فنی، تصاویر قدیمی، جدول‌های عریض یا محتوای دریافت‌شده از منابع ثالث ممکن است هنوز جایگزین متنی کامل، ترتیب خواندن مناسب یا تجربه مطلوب در بزرگ‌نمایی بالا نداشته باشند. این موارد باید در چرخه بازبینی محتوا اصلاح شوند.'],
        },
        {
          heading: 'قالب جایگزین',
          paragraphs: ['اگر سند یا بخشی از سایت برای شما قابل استفاده نیست، نام صفحه یا فایل، فناوری کمکی و قالب موردنیاز را اعلام کنید. در حدی که محتوا و مجوز دسترسی اجازه دهد، نسخه متنی یا قالب جایگزین ارائه می‌شود.'],
        },
        {
          heading: 'بازخورد',
          paragraphs: ['گزارش شما باید شامل URL، شرح مانع، مرورگر یا ابزار کمکی و نتیجه موردانتظار باشد. اطلاعات پزشکی یا شخصی غیرضروری را ارسال نکنید.'],
        },
      ],
      contactTitle: 'گزارش مانع دسترس‌پذیری',
      contactText: 'موضوع ایمیل را «دسترس‌پذیری وب‌سایت» قرار دهید و URL صفحه و مانع مشاهده‌شده را ذکر کنید.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('دسترس‌پذیری وب‌سایت')}`,
    },
  },
  en: {
    privacy: {
      eyebrow: 'Privacy',
      title: 'Website privacy policy',
      intro: 'This policy explains what Partov Ertebat Saba receives when you visit pesaba.com or submit a request, and how that information is used.',
      updated: 'Last reviewed: 11 July 2026',
      notice: 'The public form is not designed for classified information or operational secrets. Do not submit passwords, cryptographic keys, network configurations, production data, or third-party information.',
      sections: [
        {
          heading: 'Who manages the information',
          paragraphs: ['Partov Ertebat Saba, trading as Pesaba, manages information received through this website and the contact channels listed on it for the purposes described in this policy.'],
        },
        {
          heading: 'Information we receive',
          items: [
            'Information you enter in the contact form, such as name, email, phone, organisation, role, country, product interest, and message.',
            'For support requests, identifiers needed to match a product, such as model, serial number, and installed version, only where required for the request.',
            'Ordinary server and security logs, such as IP address, request time, requested path, browser type, and system errors.',
            'The necessary pesaba_locale preference cookie used to retain your selected Persian or English version.',
          ],
        },
        {
          heading: 'Why we use it',
          items: [
            'To answer sales, demonstration, partnership, recruitment, or technical-support requests and follow up on the same request.',
            'To prepare proposals, assess product fit, and perform a contract or steps requested before a contract.',
            'To protect the website, prevent abuse, troubleshoot failures, and retain necessary security records.',
            'To meet legal, accounting, or dispute-resolution obligations where applicable.',
          ],
        },
        {
          heading: 'Sharing and sale',
          paragraphs: [
            'We do not collect information for sale to third parties. Hosting, email, or support providers may process the minimum information needed to deliver their service and should protect it under applicable contracts and requirements.',
            'Information may be provided to a competent authority where legally required or where necessary to protect the rights and security of the company and users.',
          ],
        },
        {
          heading: 'Retention and protection',
          paragraphs: [
            'Information is retained only while needed for the request, a contractual relationship, legal obligations, or system security, after which it is deleted, anonymised, or placed in restricted archives.',
            'Reasonable technical and organisational safeguards are used, but no internet transmission or storage system can be represented as entirely risk-free.',
          ],
        },
        {
          heading: 'Your requests',
          paragraphs: ['You may request access to, correction of, or deletion of information you submitted directly. Fulfilment may depend on identity verification, contractual duties, legal retention, and the rights of others. This website is not directed to people under 18.'],
        },
        {
          heading: 'Policy changes',
          paragraphs: ['If processing practices or site functionality change, this text and its review date will be updated. The version published here is the current website policy.'],
        },
      ],
      contactTitle: 'Privacy request',
      contactText: 'Use “Privacy request” as the subject and send only the information needed to identify your request.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('Privacy request')}`,
    },
    terms: {
      eyebrow: 'Terms',
      title: 'Website terms of use',
      intro: 'By using pesaba.com, you accept these terms. Signed contracts, proposals, and procurement documents for a project take precedence over general website information.',
      updated: 'Last reviewed: 11 July 2026',
      sections: [
        {
          heading: 'Purpose and nature of website information',
          paragraphs: ['Website content provides general information about the company, products, solutions, and educational resources. It is not, by itself, a binding offer, performance warranty, security advice, or contractual commitment.'],
        },
        {
          heading: 'Specifications, availability, and technical claims',
          paragraphs: ['Specifications, compatibility, features, availability, price, delivery, warranty, service level, and lifecycle must be confirmed for the relevant model, version, and order in a technical proposal or contract. A reference to a standard, algorithm, or framework does not mean certification unless scoped and valid evidence is supplied.'],
        },
        {
          heading: 'Permitted use',
          items: [
            'Use the site lawfully and without disrupting service, seeking unauthorised access, or infringing the rights of others.',
            'Active scanning, penetration testing, bypassing controls, bulk extraction, or testing customer systems is not permitted without prior written authorisation.',
            'Do not submit malicious content, unlawful material, or information you are not authorised to disclose.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: ['Names, marks, text, images, diagrams, documents, and other website content belong to Partov Ertebat Saba or the relevant licensors. Ordinary viewing and citation are permitted; republication, modification, or commercial use requires prior permission unless applicable law provides otherwise.'],
        },
        {
          heading: 'Third-party links and services',
          paragraphs: ['A link to a third-party website or service is not an endorsement of all its content. Its terms, privacy, security, and accessibility are controlled by the relevant provider.'],
        },
        {
          heading: 'Availability and liability',
          paragraphs: ['We work to maintain accuracy and availability, but the site may be unavailable for maintenance, faults, or events outside our control. Liability is governed by applicable law and any relevant written contract; nothing here excludes rights that cannot legally be excluded.'],
        },
        {
          heading: 'Changes and applicable law',
          paragraphs: ['The site or these terms may change with a revised date. Contractual matters are governed by the signed agreement; other matters are handled under applicable laws and by competent authorities.'],
        },
      ],
      contactTitle: 'Questions about these terms',
      contactText: 'Contact us for content-use permission or questions about these terms.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('Website terms of use')}`,
    },
    security: {
      eyebrow: 'Responsible disclosure',
      title: 'Security vulnerability reporting',
      intro: 'Accurate, responsible reports help us assess and remediate risk. This page does not grant general permission to perform active testing.',
      updated: 'Last reviewed: 11 July 2026',
      notice: 'Never include real customer data, passwords, private keys, configuration files, or classified information in an initial report. Send a low-risk summary first so an appropriate exchange channel can be arranged if needed.',
      sections: [
        {
          heading: 'Reporting scope',
          paragraphs: ['You may report a suspected vulnerability in pesaba.com or a current Pesaba product, provided you own the system or have explicit authorisation to assess it. Customer and third-party networks or devices are out of scope.'],
        },
        {
          heading: 'Before any active testing',
          paragraphs: ['Findings from normal use or passive review may be reported directly. Obtain written authorisation and a defined test scope before scanning, proof-of-concept exploitation, authentication testing, or any other active action.'],
        },
        {
          heading: 'Prohibited activity',
          items: [
            'Service disruption, denial of service, data destruction or alteration, and establishing persistent access.',
            'Social engineering, phishing, physical testing, or testing employees, suppliers, or customers.',
            'Access beyond the minimum proof, viewing other people’s data, transferring sensitive files, or publishing before coordination.',
          ],
        },
        {
          heading: 'What to include',
          items: [
            'The affected asset, URL, product model, and hardware or firmware version where relevant.',
            'Security impact, prerequisites, and minimal, low-risk reproduction steps.',
            'Redacted evidence such as a sample request and response, without personal data or secrets.',
            'A contact route and whether you prefer attribution or anonymity if an advisory is later published.',
          ],
        },
        {
          heading: 'Triage and disclosure',
          paragraphs: ['Receipt does not mean the issue is confirmed. Reports are reviewed based on impact and reproducibility, and more information may be requested. No fixed response or remediation time is guaranteed. For confirmed issues, disclosure timing will be coordinated around user risk and the availability of a remedy.'],
        },
        {
          heading: 'Rewards and authorisation',
          paragraphs: ['No public bug-bounty programme or guaranteed reward is currently offered. This policy does not authorise testing customer systems, third-party services, or activity beyond applicable law and written permission.'],
        },
      ],
      contactTitle: 'Send an initial report',
      contactText: 'Start the subject with [SECURITY] and include only a summary, the affected asset, and the likely impact in the first message.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('[SECURITY] Vulnerability report')}`,
    },
    accessibility: {
      eyebrow: 'Accessibility',
      title: 'Accessibility statement',
      intro: 'Our goal is to make public product and company information usable by a wider range of people, assistive technologies, and input methods.',
      updated: 'Last reviewed: 11 July 2026',
      sections: [
        {
          heading: 'Accessibility target',
          paragraphs: ['WCAG 2.2 Level AA is used as a technical target during site development and review. This is a target, not a claim of complete current conformance or accessibility certification.'],
        },
        {
          heading: 'Measures we aim to maintain',
          items: [
            'Semantic structure, orderly headings, form labels, and keyboard operation.',
            'Readable contrast, visible focus, responsive layout, and right-to-left support.',
            'Text alternatives for meaningful images and no reliance on colour alone to convey meaning.',
            'Periodic automated and manual checks of key pages and user journeys.',
          ],
        },
        {
          heading: 'Known limitations',
          paragraphs: ['Some PDFs, technical drawings, legacy images, wide tables, or third-party material may not yet provide complete text alternatives, an ideal reading order, or a good high-zoom experience. These items should be addressed through the content-review process.'],
        },
        {
          heading: 'Alternative formats',
          paragraphs: ['If a page or document is not usable for you, identify the page or file, your assistive technology, and the format needed. Where content and access permissions allow, we will provide a text or alternative version.'],
        },
        {
          heading: 'Feedback',
          paragraphs: ['Include the URL, the barrier, browser or assistive technology, and the expected outcome. Do not send unnecessary medical or personal information.'],
        },
      ],
      contactTitle: 'Report an accessibility barrier',
      contactText: 'Use “Website accessibility” as the subject and include the page URL and the barrier you encountered.',
      contactLabel: publicEmail,
      contactHref: `mailto:${publicEmail}?subject=${encodeURIComponent('Website accessibility')}`,
    },
  },
}

const language = computed<'fa' | 'en'>(() => locale.value === 'fa' ? 'fa' : 'en')
const initialPolicy = policies[language.value][slug]

if (!initialPolicy) {
  throw createError({ statusCode: 404, statusMessage: 'Policy not found' })
}

const policy = computed<PolicyPage>(() => policies[language.value][slug] || initialPolicy)

const policyLinks = computed(() => language.value === 'fa' ? [
  { slug: 'privacy', label: 'حریم خصوصی' },
  { slug: 'terms', label: 'شرایط استفاده' },
  { slug: 'security', label: 'گزارش آسیب‌پذیری' },
  { slug: 'accessibility', label: 'دسترس‌پذیری' },
] : [
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'terms', label: 'Terms of use' },
  { slug: 'security', label: 'Security disclosure' },
  { slug: 'accessibility', label: 'Accessibility' },
])

const relatedPolicies = computed(() => policyLinks.value.filter(item => item.slug !== slug))

useSeoMeta({
  title: computed(() => `${policy.value.title} | Pesaba`),
  description: computed(() => policy.value.intro),
})
</script>
