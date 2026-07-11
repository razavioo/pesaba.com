# گزارش launch gate

این گزارش وضعیت قابل‌اثبات repository و وضعیت external را جدا می‌کند تا «build سبز» با «لانچ واقعی» اشتباه نشود.

| گیت | وضعیت | شاهد |
|---|---|---|
| build production با `node-server` | آماده | `npm run build` موفق |
| static preview با base `/pesaba.com/` | آماده | `validate:output`: 1500 فایل، 242 URL |
| محتوای محصول بدون evidence | آماده | sanitizer منبع/API/cache و `tests/api.spec.ts` |
| secrets و dependency surface | آماده | `check:secrets`، bundle budget، audit در CI |
| API تماس و health | آماده | 33 تست API موفق |
| SEO head/sitemap/redirect/404 | آماده | Playwright SEO و output validator |
| DNS و TLS دامنهٔ production | در انتظار اجرای شرکت | DNS فعلی فقط apex A دارد؛ `www` redirect نهایی تأیید نشده |
| SMTP credential rotation | در انتظار اجرای شرکت | secret واقعی در این workspace موجود نیست |
| Search Console/Bing/analytics | در انتظار حساب شرکت | نیازمند مالکیت سرویس و consent configuration |

## شرط بازکردن گیت نهایی

پس از انجام سه ردیف external، این دستورات را روی artifact نهایی اجرا کنید:

```bash
curl -fsS https://pesaba.com/api/health
curl -fsSI https://www.pesaba.com/en
curl -fsS https://pesaba.com/robots.txt
curl -fsS https://pesaba.com/sitemap.xml
```

سپس در Search Console و Bing sitemap `https://pesaba.com/sitemap.xml` را ثبت کنید و در گزارش indexing، canonical، CWV و conversion baseline را ثبت کنید. تا زمانی که این پاسخ‌ها از production جدید نیایند، وضعیت launch gate باید «در انتظار external» بماند.
