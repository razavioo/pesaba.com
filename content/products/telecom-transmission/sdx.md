---
title: 'SDX'
title_fa: 'SDX'
slug: 'sdx'
category: 'telecom-transmission'
category_label: 'Telecom Transmission'
category_label_fa: 'انتقال مخابراتی'
description: 'SDX is a multi-service Ethernet-over-SDH gateway that bridges Gigabit Ethernet and Fast Ethernet user networks onto STM-16 or STM-4 transmission infrastructure links using GFP encapsulation.'
description_fa: 'SDX یک دستگاه مبدل چندسرویسه اترنت-بر-SDH است که شبکه‌های کاربری اترنت را روی زیرساخت انتقال SDH با پروتکل GFP پل می‌زند.'
id: '201f554a-4046-41d6-857f-780f7deb1440'
active: true
priority: 0
specs:
  - label: 'Network Side (System)'
    value: '1 × STM-16 link or 2 × STM-4 links'
  - label: 'Client Side (User)'
    value: '32 × Fast Ethernet + 1 × GbE + 1 × STM-1'
  - label: 'Encapsulation Protocol'
    value: 'GFP (Generic Framing Procedure)'
  - label: 'Capacity Allocation'
    value: 'VC-12 and VC-4 granularity on network-side links'
  - label: 'Management'
    value: 'Web-based management via Gigabit Ethernet; full alarm and performance reporting'
  - label: 'Form Factor'
    value: '2U × 19-inch rack'
  - label: 'Power Supply'
    value: '220 VAC or 48 VDC'
specs_fa:
  - label: 'سمت شبکه (System)'
    value: '۱ لینک STM-16 یا ۲ لینک STM-4'
  - label: 'سمت کاربر (Client)'
    value: '۳۲ Fast Ethernet + ۱ GbE + ۱ STM-1'
  - label: 'پروتکل캡سول‌سازی'
    value: 'GFP (Generic Framing Procedure)'
  - label: 'تخصیص ظرفیت'
    value: 'VC-12 و VC-4 روی لینک‌های سمت شبکه'
  - label: 'مدیریت'
    value: 'تحت وب از طریق Gigabit Ethernet؛ گزارش کامل آلارم و عملکرد'
  - label: 'فرم فاکتور'
    value: '2U × 19 اینچ رک'
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

## SDX | Product Overview

SDX (SDX2) is a multi-service Ethernet-over-SDH gateway that allows operators to carry Ethernet traffic from user networks over existing SDH transmission infrastructure. The system uses GFP (Generic Framing Procedure) encapsulation to multiplex Fast Ethernet, Gigabit Ethernet, and STM-1 client interfaces onto high-capacity STM-16 or STM-4 network-side links.

SDX is designed for carriers and network operators who need to deliver Ethernet services to remote locations or enterprise customers using existing SDH infrastructure — avoiding the cost of dedicated Ethernet backhaul while reusing proven transmission capacity.

## Architecture

SDX bridges two network sides:

**Network Side (System)**
Connects to the SDH transmission network via one STM-16 link or two STM-4 links, providing up to 2.5 Gbps of aggregated transport capacity.

**Client Side (User)**
Presents 32 Fast Ethernet ports, one Gigabit Ethernet port, and one STM-1 interface to user networks. Capacity allocation to each client interface is configurable in VC-12 and VC-4 granularity on the network-side links, allowing flexible bandwidth assignment per customer or service.

## Key Features

- STM-16 or dual STM-4 network-side connectivity
- 32 × Fast Ethernet + 1 × GbE + 1 × STM-1 on the client side
- GFP encapsulation for standards-based Ethernet-over-SDH transport
- VC-12 and VC-4 bandwidth allocation granularity
- Web-based management interface connected via Gigabit Ethernet — displays all system performance parameters and reports all alarms
- 2U × 19-inch rack form factor
- Dual power supply options: 220 VAC or 48 VDC
