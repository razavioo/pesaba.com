---
title: 'CORN E1'
title_fa: 'CORN E1'
slug: 'corn-e1'
category: 'telecom-transmission'
category_label: 'Telecom Transmission'
category_label_fa: 'انتقال مخابراتی'
description: 'CORN E1 is an FPGA-based, OS-less Ethernet-over-E1 secure modem that bridges remote LAN sites over up to 4 × E1 links with AES-128 encryption — a smart, economical alternative to dedicated WAN circuits.'
description_fa: 'مودم CORN E1 یک مودم بدون سیستم عامل مبتنی بر FPGA است که به منظور ایجاد شبکه WAN و اتصال دو شبکه محلی LAN به یکدیگر طراحی شده است.'
id: 'b3cd49cd-efa5-4df5-9c89-75bcb9c3f107'
active: true
priority: 0
specs:
  - label: 'WAN Interface'
    value: '4 × E1 channels (4 RX + 4 TX) — supports 75 Ω or 120 Ω E1 lines'
  - label: 'WAN Connectors'
    value: '8 × BNC connectors for E1 (4 TX + 4 RX)'
  - label: 'LAN Interface'
    value: '1 × 10/100 Mbps Ethernet (10 Mbps PPP throughput)'
  - label: 'Maximum WAN Throughput'
    value: '8.192 Mbps over 4 × E1 (n × 56/64 kbps scalable up to 8.192 Mbps)'
  - label: 'Encapsulation Protocol'
    value: 'GFP (Generic Framing Procedure) — bonding and encapsulation'
  - label: 'Encryption'
    value: 'AES-128 (key stored on USB Dongle or in modem configuration)'
  - label: 'Form Factor'
    value: 'Standalone desktop or 1U rack mount'
  - label: 'Power Supply'
    value: '5 VDC'
  - label: 'Design'
    value: 'FPGA-based, OS-less (no operating system, no software exploitation surface)'
specs_fa:
  - label: 'نحوه ارسال اطلاعات'
    value: 'Ethernet بر بستر E1'
  - label: 'نوع و تعداد پورت'
    value: '8 پورت BNC برای ورودی و خروجی E1 ها'
  - label: 'منبع تغذیه'
    value: '5VDC'
  - label: 'خطوط پشتیبانی'
    value: 'پشتیبانی از خطوط 120 یا 75 اهم E1'
  - label: 'ابعاد (دو سایز)'
    value: 'مناسب برای رومیزی و رک'
  - label: 'پورت اترنت'
    value: 'یک پورت Ethernet 10/100 Mbps'
  - label: 'پروتکل های قابل پشتیبانی'
    value: 'GFP'
  - label: 'پشتیبانی کانال E1'
    value: 'پشتیبانی از 4xE1 (چهار ورودی و چهار خروجی)'
---

## CORN E1 | Product Overview

CORN E1 is a secure Ethernet-over-E1 modem designed and manufactured by Partov Ertebat Saba. Built on FPGA architecture with no operating system, it provides a smart, economical, and reliable way to bridge remote LAN sites — for example, connecting branch offices to a head-office network — over standard E1 telecommunications circuits.

The modem connects directly to a 10/100 Base-T LAN at 10 Mbps and forwards traffic across up to 4 × E1 channels in parallel, with combined throughput up to 8.192 Mbps. Connection speed scales in n × 56/64 kbps increments, allowing operators to balance cost against bandwidth requirement.

For secure communication, all data is encrypted using AES-128. The encryption key can be stored on a USB Dongle attached to the rear panel — for hardware-level key protection — or written into the modem configuration via the management interface. With no general-purpose CPU and no operating system, CORN E1 has no software-based attack surface and no patch cycle.

## Key Features

- High-speed PPP data connection over WAN at scalable n × 56/64 kbps up to 8.192 Mbps
- 4 × E1 channels (4 TX + 4 RX) — supports both 75 Ω and 120 Ω E1 lines
- 8 × BNC connectors for E1 connectivity
- 1 × 10/100 Base-T Ethernet LAN port at 10 Mbps PPP throughput
- AES-128 encryption for secure point-to-point connectivity
- GFP (Generic Framing Procedure) bonding and encapsulation
- Flexible connection speed configuration
- Available as standalone desktop unit or 1U rack-mount form factor
- 5 VDC power supply
- FPGA-based, OS-less design — no software vulnerabilities, no remote exploit surface

## Use Cases

- Branch-office to head-office LAN interconnection over leased E1 circuits
- Secure point-to-point connectivity between facilities using existing telco infrastructure
- Backup and overflow links for ISP and enterprise WAN topologies
- Industrial network extension where E1 is the most reliable available transport
