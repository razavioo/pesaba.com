# دستورالعمل عملیات production

این فایل برای اجرای Pesaba روی سرور شرکت است. مقادیر دامنه، مسیر و secret باید در secret manager یا environment runtime تنظیم شوند و نباید داخل image یا repository قرار بگیرند.

## اجرای Node

```bash
NODE_ENV=production \
NUXT_PUBLIC_SITE_URL=https://pesaba.com \
NUXT_PUBLIC_SITE_INDEXABLE=true \
NUXT_PUBLIC_CONTACT_FORM_ENABLED=true \
NUXT_APP_BASE_URL=/ \
node .output/server/index.mjs
```

قبل از اجرا، `NUXT_SMTP_*` و `NUXT_CONTACT_ALLOWED_ORIGINS=https://pesaba.com` را فقط در secret manager قرار دهید. health check باید به `GET /api/health` با انتظار `200` و `{"ok":true}` متصل باشد.

## Reverse proxy حداقلی Nginx

```nginx
server {
    listen 80;
    server_name pesaba.com www.pesaba.com;
    return 301 https://pesaba.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.pesaba.com;
    return 301 https://pesaba.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pesaba.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

TLS را با certificate معتبر، TLS 1.2+ و تمدید خودکار تنظیم کنید. HSTS پس از اطمینان از HTTPS برای تمام assetها فعال بماند.

## انتشار و rollback

1. `npm ci`، سپس `npm run check:secrets`، `npm run validate:content`، `npm run typecheck` و `npm run build`.
2. image یا artifact را با شناسه commit منتشر و `/api/health` را بررسی کنید.
3. درخواست‌های `GET /fa`، `GET /en`، `GET /robots.txt` و `GET /sitemap.xml` را از بیرون شبکه بررسی کنید.
4. در خطا، artifact قبلی را فعال کنید و cache reverse proxy را invalidate کنید؛ credentialها را در rollback دوباره وارد image نکنید.

## پایش روزانه

- uptime و statusهای 5xx برای `/fa`، `/en`، `/api/health` و `/sitemap.xml`؛
- انقضای TLS، رکوردهای SPF/DKIM/DMARC و redirect `www`؛
- Search Console: indexing، sitemap، manual action و Core Web Vitals؛
- نرخ `contact_submit`، خطای SMTP و latency API بدون ذخیرهٔ body یا PII؛
- هشدار برای تغییر ناخواستهٔ robots، canonical یا `noindex` production.

## شواهد محصول

هر claim حساس باید در [EVIDENCE-REGISTER.template.csv](./EVIDENCE-REGISTER.template.csv) با مدل، revision، دامنه، شماره سند و reviewer ثبت شود. تا وقتی وضعیت `approved` نشده، `evidence_reviewed: true` اضافه نشود؛ sanitizer build متن عمومی مشروط را نگه می‌دارد.

## DNS و ابزارها

- apex و `www` به reverse proxy شرکت اشاره کنند و `www` یک hop به apex redirect شود؛
- SPF فقط senderهای واقعی را مجاز کند؛ DKIM کلید اختصاصی داشته باشد؛ DMARC ابتدا `p=none` برای گزارش‌گیری و سپس با بررسی گزارش‌ها سخت‌گیرانه‌تر شود؛
- Search Console و Bing Webmaster برای `https://pesaba.com` ثبت و sitemap ارسال شوند؛
- analytics با consent و eventهای بدون PII فعال شود: `view_product`, `datasheet_request`, `contact_submit`, `phone_click`, `email_click`, `language_switch`.
