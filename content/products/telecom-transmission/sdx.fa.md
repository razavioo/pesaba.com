---
title: 'SDX'
title_en: 'SDX'
slug: 'sdx'
category: 'telecom-transmission'
category_label: 'انتقال مخابراتی'
description: 'SDX یک مبدل چندسرویسه اترنت روی SDH است که شبکه‌های گیگابیت و فست اترنت کاربری را با کپسوله‌سازی GFP روی لینک‌های انتقال زیرساختی STM-16 یا STM-4 پل می‌زند.'
description_en: 'SDX is a multi-service Ethernet-over-SDH gateway that bridges Gigabit Ethernet and Fast Ethernet user networks onto STM-16 or STM-4 transmission infrastructure links using GFP encapsulation.'
id: '201f554a-4046-41d6-857f-780f7deb1440'
active: true
priority: 0
locale: fa
specs:
  - label: 'سمت شبکه (System)'
    value: '۱ لینک STM-16 یا ۲ لینک STM-4'
  - label: 'سمت کاربر (Client)'
    value: '۳۲ پورت Fast Ethernet + ۱ پورت GbE + ۱ لینک STM-1'
  - label: 'پروتکل کپسوله‌سازی'
    value: 'GFP (Generic Framing Procedure)'
  - label: 'گرانولاریته تخصیص ظرفیت'
    value: 'VC-12 و VC-4 روی لینک‌های سمت شبکه'
  - label: 'مدیریت'
    value: 'تحت وب از طریق Gigabit Ethernet؛ گزارش کامل آلارم و عملکرد'
  - label: 'فرم فاکتور'
    value: '2U × ۱۹ اینچ رک'
  - label: 'منبع تغذیه'
    value: '220VAC یا 48VDC'
photos:
  - '/photos/sdx/photo-1.webp'
  - '/photos/sdx/photo-2.webp'
  - '/photos/sdx/photo-3.webp'
  - '/photos/sdx/photo-4.webp'
schematic_pdfs:
  - '/schematics/sdx/SDX-2.pdf'
  - '/schematics/sdx/SDX-2-2.pdf'
diagram: '/schematics/sdx/diagram.webp'
---

## SDX | معرفی محصول

SDX (SDX2) یک مبدل چندسرویسه اترنت روی SDH است که به اپراتورها امکان می‌دهد ترافیک اترنت شبکه‌های کاربری را روی زیرساخت انتقال SDH موجود حمل کنند. این سامانه از کپسوله‌سازی GFP (Generic Framing Procedure) برای مالتی‌پلکس Fast Ethernet، گیگابیت اترنت و رابط‌های STM-1 کاربر روی لینک‌های پرظرفیت STM-16 یا STM-4 سمت شبکه استفاده می‌کند.

SDX برای اپراتورها و فراهم‌آورندگان شبکه‌ای طراحی شده است که نیاز به ارائه سرویس‌های اترنت به مکان‌های دور یا مشتریان سازمانی با استفاده از زیرساخت SDH موجود دارند — هزینه بک‌هال اختصاصی اترنت را حذف کرده و در عین حال از ظرفیت انتقال اثبات‌شده استفاده مجدد می‌شود.

## معماری

SDX دو سمت شبکه را به یکدیگر پل می‌زند:

**سمت شبکه (System)**
از طریق یک لینک STM-16 یا دو لینک STM-4 به شبکه انتقال SDH متصل می‌شود و تا 2.5Gbps ظرفیت حمل تجمیعی فراهم می‌کند.

**سمت کاربر (Client)**
۳۲ پورت Fast Ethernet، یک پورت گیگابیت اترنت و یک رابط STM-1 را به شبکه‌های کاربر ارائه می‌دهد. تخصیص ظرفیت به هر رابط کاربر با گرانولاریته VC-12 و VC-4 روی لینک‌های سمت شبکه قابل پیکربندی است و امکان تخصیص پهنای باند منعطف به ازای هر مشتری یا سرویس را فراهم می‌سازد.

## ویژگی‌های کلیدی

- اتصال سمت شبکه به‌صورت STM-16 یا دو STM-4
- ۳۲ پورت Fast Ethernet + ۱ پورت GbE + ۱ پورت STM-1 در سمت کاربر
- کپسوله‌سازی GFP برای حمل اترنت روی SDH بر اساس استاندارد
- گرانولاریته تخصیص پهنای باند VC-12 و VC-4
- رابط مدیریتی تحت وب متصل از طریق Gigabit Ethernet — تمامی پارامترهای عملکرد سیستم را نمایش و آلارم‌ها را گزارش می‌دهد
- فرم فاکتور 2U × ۱۹ اینچ رک
- منبع تغذیه دوگانه: 220VAC یا 48VDC
