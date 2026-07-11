# نقشه‌راه نهایی SEO و لانچ Pesaba

این سند مرجع اجرایی راه‌اندازی `pesaba.com` است. هدف فقط افزایش رتبه نیست؛ هدف ساخت یک دارایی قابل اعتماد برای خریدهای B2B و دولتی، تولید سرنخ قابل اندازه‌گیری، و جلوگیری از ادعاهایی است که بدون مدرک فنی یا قراردادی منتشر می‌شوند.

## 1. تصمیم‌های پایه

- دامنه‌ی canonical: `https://pesaba.com`؛ نسخه‌ی `www` باید پس از آماده‌سازی DNS با `301` به apex هدایت شود.
- زبان‌ها: `/fa/...` زبان اصلی فعلی و `/en/...` نسخه‌ی انگلیسی. هر صفحه‌ی قابل index باید canonical، `hreflang` متقابل و `x-default` مشخص داشته باشد.
- سرور تولید: زیرساخت شرکت، اجرای Nuxt با preset `node-server` پشت reverse proxy با TLS. GitHub Pages فقط preview است و با `noindex` تولید می‌شود.
- sitemap فقط URLهایی را شامل می‌شود که `200`، canonical یکتا و فایل/route واقعی دارند. صفحات draft، inactive، `noindex` و compliance matrix در sitemap نیستند.
- هر ادعای محصولی باید به یکی از این منابع متصل باشد: frontmatter/spec جاری، دیتاشیت با شماره نسخه، گزارش آزمون، گواهی با شناسه و دامنه، پیشنهاد فنی یا قرارداد. بدون منبع، متن عمومی باید توصیفی و مشروط باشد.

## 2. ممیزی قابل تکرار سایت قبلی

این مشاهدات در ۱۱ ژوئیهٔ ۲۰۲۶ با `curl` از `https://pesaba.com` ثبت شده‌اند و باید پیش از تغییر DNS در بایگانی مهاجرت نگه‌داری شوند:

- `/` با `301` به `/fa` می‌رود؛ پاسخ فعلی هدرهای `x-powered-by: Nuxt` و `server: Liara` دارد.
- `robots.txt` فقط `/admin` را مسدود می‌کند و sitemap قدیمی را معرفی می‌کند؛ محیط staging نباید هرگز چنین فایل indexable داشته باشد.
- sitemap قدیمی ۵۳ `<loc>` داشت و ۲۸ URL دارای double-encoding (`%25...`) بودند. نمونه‌ها شامل مسیرهای قدیمی `/articles/...` و `/products/...` با نام‌های دارای فاصله و علامت سؤال است.
- sitemap قدیمی `lastmod`های نامعتبر/قدیمی مانند `1970-01-01` و مسیرهای محصول با encoding ناهماهنگ داشت.
- نتیجه‌ی قابل اقدام: redirect map باید قبل از انتشار در Search Console تست شود؛ URLهای قدیمی نباید دوباره در sitemap یا canonical ظاهر شوند.

منبع زنده: [robots.txt](https://pesaba.com/robots.txt)، [sitemap.xml](https://pesaba.com/sitemap.xml)، [صفحه انگلیسی](https://pesaba.com/en). رتبه یا ترافیک واقعی بدون دسترسی به Search Console/Analytics قابل ادعا نیست؛ اعداد باید از export رسمی آن ابزارها بیایند.

## 3. benchmark رقابتی و شکاف محتوا

فهرست زیر benchmark موضوعی است، نه ادعای رتبه‌بندی. قبل از هر تصمیم تجاری، با کشور هدف و زبان جست‌وجو دوباره SERP capture شود.

| حوزه | نمونه‌های قابل بررسی | چیزی که باید از آن‌ها یاد بگیریم | فرصت Pesaba |
|---|---|---|---|
| Data diode و OT | [Waterfall Security](https://waterfall-security.com/)، [Owl Cyber Defense](https://owlcyberdefense.com/)، [Advenica](https://advenica.com/)، [INFODAS](https://www.infodas.com/) | معماری مرز اعتماد، دیاگرام deployment، پروتکل/bridge، case study و evidence pack | صفحه‌ی مدل‌محور برای G/A/K، ماتریس «قابلیت در برابر نسخه»، دیاگرام نصب و سناریوی SCADA با شواهد داخلی |
| رمزنگاری شبکه و cross-domain | [Rohde & Schwarz Cybersecurity](https://www.rohde-schwarz.com/)، [Thales](https://cpl.thalesgroup.com/)، [Secunet](https://www.secunet.com/) | تفکیک certification از alignment، مدیریت کلید، lifecycle و مستندات procurement | evidence register، فرم درخواست سند رسمی، توضیح دقیق مرز مدیریت/داده و عدم ادعای FIPS/CC بدون شناسه |
| پایش سلولی و drive test | [Keysight Nemo](https://www.keysight.com/)، [VIAVI](https://www.viavisolutions.com/)، [Rohde & Schwarz Mobile Network Testing](https://www.rohde-schwarz.com/) | KPI/KQI glossary، workflow میدانی، export/report، نسخه و باند پشتیبانی‌شده | صفحات جدا برای Capella/Auriga/Venus، فعلاً فقط 2G/3G/LTE/TD-LTE تا تأیید 5G، نمونه گزارش بدون داده مشتری |
| پایش زیستی آب | [bbe Moldaenke](https://www.bbe-moldaenke.de/)، [Hach](https://www.hach.com/) | تعریف روش آزمون، محدودیت سنسور، کالیبراسیون، هشدار و مسئولیت اپراتور | صفحه Orazan با روش، شرایط محیطی، سطح اطمینان و تفکیک «هشدار» از «تشخیص قطعی» |

### شکاف‌های مشترک رقبا

1. برای هر محصول باید یک صفحه‌ی `problem → architecture → interfaces → limits → evidence → CTA` داشته باشیم.
2. ادعاهای «امن/بومی/بدون OS» بدون model/revision کافی نیستند؛ مزیت ما باید شفافیت دامنه‌ی ادعا باشد.
3. محتوای فارسی فنی باید اصطلاحات جست‌وجوشده‌ی واقعی را با معادل انگلیسی و نام مدل پوشش دهد، نه ترجمه‌ی تحت‌اللفظی.
4. case study باید با اجازه‌ی کتبی، بازه‌ی زمانی، صنعت، مسئله، deployment و نتیجه‌ی قابل اندازه‌گیری منتشر شود؛ لوگوی مشتری بدون اجازه ممنوع است.

## 4. معماری اطلاعات و technical SEO

### URL و indexation

- URLهای جدید: `/fa/products/{category}/{slug}`، `/en/products/{category}/{slug}`، `/fa/blog/{slug}` و معادل انگلیسی.
- trailing slash، حروف کوچک، percent-encoding و query canonical باید یکدست باشند.
- root redirect، legacy articles/products، A100 و double-encoded pathها باید `301` به تنها URL جدید برسند؛ زنجیره‌ی redirect حداکثر یک hop.
- `404` واقعی برای locale/route نامعتبر؛ صفحه‌ی خطا نباید status `200` بدهد.
- staging/preview: `X-Robots-Tag: noindex, nofollow` یا meta `noindex`، sitemap غیرقابل index و Basic Auth در صورت دسترسی عمومی.
- صفحات فیلتر، search، compare با query و فرم‌های تماس در sitemap نیستند مگر URL مستقل و ارزش جست‌وجویی داشته باشند.

### head و structured data

- هر route: یک `title` یکتا (حدود ۴۵–۶۵ کاراکتر)، description طبیعی (حدود ۱۲۰–۱۶۰)، canonical مطلق، `og:image` PNG 1200×630، `twitter:card`.
- `Organization`/`WebSite` در صفحات مناسب، `BreadcrumbList` در صفحات عمیق، `Product` فقط با مشخصات واقعی همان مدل، و `Article` فقط با نویسنده/تاریخ قابل تأیید.
- FAQ schema فقط برای FAQی که همان‌طور در HTML قابل مشاهده است و پاسخ آن ادعای حقوقی/گواهی بدون مدرک ندارد.
- `hreflang` فقط وقتی دو نسخه واقعاً هم‌معنی‌اند؛ صفحه‌ی ناقص نباید به‌زور alternate شود.
- تصویر محصول باید alt توصیفی، ابعاد ثابت، `loading` مناسب و منبع داخلی داشته باشد. تصویر مفهومی با عنوان تأسیسات واقعی منتشر نشود.

### performance و accessibility

- هدف Core Web Vitals: LCP ≤ 2.5s، INP ≤ 200ms، CLS ≤ 0.1 در p75 کاربران واقعی؛ برای فارسی و موبایل جداگانه گزارش شود.
- تصاویر با AVIF/WebP، ابعاد responsive و preload فقط برای hero واقعی؛ JavaScript غیرضروری و فونت‌های تکراری حذف شود.
- target فنی WCAG 2.2 AA: keyboard، focus، contrast، RTL، نام accessible کنترل‌ها، alt، table heading و reduced motion.
- بودجه bundle فعلی در CI حفظ شود؛ هر افزایش باید با trace و دلیل کسب‌وکاری بررسی شود.

## 5. برنامه‌ی محتوا

### خوشه‌های اولویت‌دار

- `data diode / دیتادیود / انتقال یک‌طرفه داده / ایزولاسیون SCADA / OT IT segmentation`
- `network encryption / رمزنگاری لینک / AES-256 / MACsec / IPsec / Ethernet encryptor`
- `industrial network security / امنیت شبکه صنعتی / historian replication / OPC-UA / Modbus`
- `cellular drive test / پایش کیفیت شبکه موبایل / KPI KQI / RSRP RSRQ SINR / LTE TD-LTE`
- `water toxicity monitoring / پایش سمیت آب / biomonitoring / هشدار کیفیت آب`
- نام مدل‌ها و ترکیب intent: `{model} datasheet`, `{model} specs`, `{model} deployment`, `{model} comparison`.

### استاندارد هر صفحه

- مخاطب و مسئله‌ی مشخص، نه مقدمه‌ی عمومی طولانی.
- تعریف محدودیت‌ها و مواردی که محصول جایگزین firewall، SIEM، فرآیند ایمنی یا certification نیست.
- جدول مشخصات با واحد، revision و تاریخ بازبینی.
- دیاگرام ساده‌ی source/destination/trust boundary و مسیر مدیریت.
- CTA واحد: درخواست دیتاشیت/بررسی فنی/دمو؛ فرم باید consent و هشدار اطلاعات محرمانه داشته باشد.
- لینک داخلی به category، glossary، use-case، محصول مرتبط و یک منبع مستقل معتبر.
- author/reviewer، تاریخ انتشار و `updated` واقعی؛ stale content پس از ۱۸۰ روز وارد صف بازبینی.

### دروازه شواهد محتوا

بدنه‌ی تفصیلی محصول تا ثبت `evidence_reviewed: true` و تأیید owner محصول منتشر نمی‌شود. برای هر ادعا در register این فیلدها لازم است: متن ادعا، مدل/نسخه، منبع، شماره سند، صادرکننده/آزمایشگاه، دامنه، تاریخ اعتبار، reviewer و تاریخ بازبینی. ادعاهای Common Criteria، EAL، FIPS، AFTA، پدافند، «ساخت کامل ایران»، «بدون آسیب‌پذیری»، «تضمین»، «همیشه/هرگز» و عددهای throughput/latency بدون این رکورد ممنوع‌اند.

## 6. اندازه‌گیری و ابزارها

### پیش از انتشار

- Google Search Console و Bing Webmaster Tools برای apex و هر دو locale؛ sitemap جدید و change-of-address/migration annotation.
- GA4 یا Matomo با consent، بدون ثبت PII؛ eventهای `view_product`, `datasheet_request`, `contact_submit`, `phone_click`, `email_click`, `language_switch`.
- Search Console query/page export هفتگی، crawl stats، Page Indexing و Core Web Vitals.
- Lighthouse/CrUX، Playwright smoke، axe، `npm run check:secrets`, `validate:content`, `validate:output`, bundle budget، `typecheck` و ESLint در CI.
- مانیتور uptime/HTTP status، TLS expiry، SPF/DKIM/DMARC، sitemap و robots؛ alert برای 5xx و افت conversion.

### KPIهای ۹۰ روز اول

- Index coverage: درصد URLهای canonical که `200` و قابل index هستند؛ هدف ≥ 98%.
- Sitemap validity: zero duplicate، zero double-encoding، zero missing artifact.
- Organic qualified leads: درخواست دیتاشیت/جلسه فنی با source و locale؛ هدف را بعد از baseline دو هفته‌ای تعیین کنید.
- Non-brand impressions/clicks برای هر خوشه، CTR صفحه، position median و assisted conversion.
- CWV p75 و نرخ خطای فرم/ارسال ایمیل؛ هیچ KPIی بدون تفکیک فارسی/انگلیسی و device معتبر نیست.

## 7. زیرساخت و امنیت عملیاتی

- اجرای production با Node preset پشت Nginx/HAProxy یا reverse proxy شرکت، TLS 1.2+، HSTS پس از اطمینان از HTTPS کامل، Brotli/Gzip، cache immutable برای assets و `no-store` برای API.
- secretها فقط environment/secret manager runtime؛ SMTP credential فعلی که قبلاً افشا شده باید فوراً revoke/rotate شود، سپس cache و buildهای حاوی آن invalidate شوند. purge تاریخچه Git فقط با تأیید مالک repository.
- DNS: `A/AAAA` apex، `www`، SPF/DKIM/DMARC، reverse proxy و health check. `www` پس از آماده‌سازی با `301` به apex.
- contact API: allowlist origin، size/content-type/body validation، honeypot، consent، rate limit، hash IP، request ID، TLS-required SMTP و عدم log کردن PII.
- backup رمزگذاری‌شده، restore drill فصلی، dependency update ماهانه و incident runbook برای فرم، DNS، robots و credential exposure.
- legal: privacy/terms/security disclosure/accessibility؛ هیچ داده‌ی محرمانه، کلید، نقشه شبکه، فایل config یا اطلاعات طبقه‌بندی‌شده در فرم عمومی دریافت نشود.

## 8. تقسیم کار و cadence

| مالک | مسئولیت | cadence |
|---|---|---|
| Product owner | صحت specs، revision، evidence register، approval متن محصول | هر release و هر ۹۰ روز |
| SEO/content lead | keyword map، brief، internal links، refresh، localization QA | هفتگی/ماهانه |
| Engineering | performance، schema، redirects، CI، security، uptime | هر PR و ماهانه |
| Sales/CS | intent و objections، lead quality، permission برای case study | هفتگی |
| Legal/procurement | گواهی، صادرات، privacy، claims approval | قبل از انتشار هر claim حساس |

## 9. ترتیب اجرا

### روز ۰ تا ۳۰: launch gate

1. rotate SMTP، تنظیم DNS/TLS و `www → apex`.
2. اجرای static preview با `noindex` و production Node با site URL canonical.
3. اتمام redirect inventory از sitemap و access log؛ تست هر مسیر legacy با status/final URL.
4. تکمیل evidence register برای محصولات اولویت‌دار و باقی‌ماندن متن بررسی‌نشده پشت gate.
5. اتصال Search Console/Bing/analytics، ارسال sitemap و ثبت baseline.
6. اجرای CI و smoke در desktop/mobile و هر دو زبان؛ launch فقط با zero blocking finding.

### روز ۳۱ تا ۶۰: اعتبار و تقاضا

1. انتشار ۶ صفحه use-case و ۱۲ مقاله‌ی مسئله‌محور با reviewer و source.
2. ساخت comparison واقعی، application diagram، request-datasheet flow و دو case study مجاز.
3. digital PR و لینک‌سازی از انجمن‌ها/همایش‌های صنعتی واقعی؛ خرید لینک و guest-post انبوه ممنوع.
4. بهبود title/description بر اساس query واقعی، نه حدس تیم.

### روز ۶۱ تا ۹۰: مقیاس

1. تکمیل صفحات مدل‌هایی که evidence دارند و افزودن revision/date.
2. توسعه فارسی/انگلیسی برای intentهای جدید بر اساس conversion و gap رقبا.
3. dashboard ماهانه KPI، CWV، crawl/index، lead quality و content decay.
4. audit امنیت، dependency، accessibility، backup restore و claims قبل از هر کمپین.

## 10. چک‌لیست امضای لانچ

- [ ] SMTP credential قدیمی revoke و credential جدید خارج از build/history فعال شده است.
- [ ] `https://pesaba.com/fa` و `/en`، canonical، hreflang و sitemap نهایی بررسی شده‌اند.
- [ ] `www`، HTTP، trailing slash، legacy و double-encoded redirects تست شده‌اند.
- [ ] staging/preview `noindex` است و production indexable است.
- [ ] صفر missing asset، صفر duplicate/double-encoded sitemap و صفر missing artifact.
- [ ] 404 واقعی، health endpoint، security headers، no PII logs و rate limit تأیید شده‌اند.
- [ ] صفحات محصول فقط claimهای evidence-reviewed یا متن مشروط دارند.
- [ ] Search Console/Bing/analytics، consent و conversion events فعال‌اند.
- [ ] owner و تاریخ بازبینی برای هر claim حساس ثبت شده است.
- [ ] rollback، backup و contact incident runbook تمرین شده است.

## 11. artifactهای اجرایی repository

- [دستورالعمل عملیات production](./PRODUCTION-OPERATIONS.fa.md) شامل اجرای Node، reverse proxy، health check، rollback، DNS و پایش است.
- [قالب evidence register](./EVIDENCE-REGISTER.template.csv) منبع لازم برای فعال‌کردن `evidence_reviewed: true` روی هر مدل است.
- [گزارش launch gate](./LAUNCH-GATE-REPORT.fa.md) وضعیت قابل‌اثبات repository و اقدامات external را جدا می‌کند.
- sanitizer محتوای Nitro در زمان parse و در cache static، بدنه و description محصولات بررسی‌نشده را با متن مشروط جایگزین می‌کند؛ بنابراین محصول تا ثبت شواهد وارد copy تفصیلی عمومی نمی‌شود.

این سند جایگزین مدرک محصول، قرارداد یا مشاوره حقوقی نیست؛ هر جا بین copy بازاریابی و سند جاری اختلاف است، سند جاری و تأیید owner محصول ملاک انتشار است.
