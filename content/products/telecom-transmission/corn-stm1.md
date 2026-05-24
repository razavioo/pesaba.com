---
title: 'Corn STM1'
title_fa: 'Corn STM1'
slug: 'corn-stm1'
category: 'telecom-transmission'
category_label: 'Telecom Transmission'
category_label_fa: 'انتقال مخابراتی'
description: "Saba's CORN-STM1 is an FPGA-based, OS-less modem for transmitting Gigabit Ethernet over STM-1 — supporting GFP/V-CAT, AES-256 encryption, and dual 155.52 Mbps optical/electrical interfaces for point-to-point, chain, ring, or network-tap topologies."
description_fa: 'مودم CORN STM1 یک مودم بدون سیستم عامل مبتنی بر FPGA است که به منظور ارسال داده‌های اترنت 1Gbps بر روی بستر STM1 طراحی و ساخته شده است.'
id: 'c5848fca-8f28-4f3f-bed4-9234a1a66e1a'
active: true
priority: 0
specs:
  - label: 'Network Interface'
    value: '2 × pluggable 155.52 Mbps optical/electrical (STM-1) interfaces'
  - label: 'LAN Interface'
    value: '10/100 Base-T Ethernet at 10 Mbps direct connect'
  - label: 'Maximum Transmission Rate'
    value: '150 Mbps Gigabit Ethernet over STM-1 per link (typical 140 Mbps usable)'
  - label: 'Supported Protocols'
    value: 'GFP (Generic Framing Procedure), V-CAT (Virtual Concatenation)'
  - label: 'Encryption'
    value: 'AES-256 (selectable per session)'
  - label: 'Authentication'
    value: 'USB Dongle on rear panel for hardware-based authentication'
  - label: 'Console Port'
    value: '10/100 Mbps Ethernet console for link-quality reporting'
  - label: 'Use Cases'
    value: 'TAP for network monitoring, point-to-point, chain, or ring topology'
  - label: 'Design'
    value: 'FPGA-based, OS-less (no operating system on the data path)'
  - label: 'Certification'
    value: 'Approved by the Iranian Telecommunications Regulatory Authority'
specs_fa:
  - label: 'قابلیت ها'
    value: 'قابلیت استفاده به عنوان TAP برای مانیتورینگ'
  - label: 'پشتیبانی از پروتکل'
    value: 'GFP و V_CAT'
  - label: 'نحوه صحت سنجی'
    value: 'دانگل USB به منظور صحت سنجی سخت افزاری'
  - label: 'نحوه ارسال و دریافت'
    value: 'ارسال و دریافت داده های اترنت 1Gbps بر روی بستر STM 1 که نرخ حداکثری انتقال در آن 15Mbps است'
  - label: 'نحوه پیاده سازی'
    value: 'مبتنی بر FPGA بدون به کارگیری سیستم عامل'
  - label: 'رمزگذاری'
    value: 'AES256'
  - label: 'پورت کنسول'
    value: 'Mbps 100/10'
---

## Gigabit-over-STM-1 Modem | Product Overview

Saba's CORN-STM1 is an FPGA-based, OS-less modem designed for transmitting Gigabit Ethernet traffic over STM-1 telecommunications links. It uses two pluggable 155.52 Mbps optical/electrical interfaces, providing a compact, cost-effective, and flexible solution for connecting Ethernet networks over carrier-grade SDH transport.

The device supports multiple deployment topologies — point-to-point, chain, ring, or network-tap — by reloading the appropriate firmware onto the FPGA. This makes a single hardware platform suitable for use as a WAN bridge, a redundant ring node, or a passive network monitoring tap, depending on the deployment.

For secure communication, all connections can optionally be encrypted using AES-256, providing a confidential point-to-point link across the SDH transport. A USB Dongle on the rear panel provides hardware-based authentication, ensuring that only authorised devices can establish a secure session.

CORN STM1 is approved by the Iranian Telecommunications Regulatory Authority for deployment on operator networks.

## Key Features

- Transmits and receives Gigabit Ethernet over STM-1 — maximum 150 Mbps per link (typical 140 Mbps usable)
- Two pluggable 155.52 Mbps optical or electrical SDH interfaces
- Direct connection to 10/100 Base-T LAN at 10 Mbps
- GFP (Generic Framing Procedure) protocol support
- V-CAT (Virtual Concatenation) protocol support
- AES-256 encryption — selectable per session for secure links
- USB Dongle hardware authentication
- 10/100 Mbps Ethernet console port for link-quality monitoring
- Configurable as a TAP for passive network monitoring
- FPGA-based, OS-less design — no operating system, no remote-exploit surface
- Iranian Telecommunications Regulatory Authority approved

## Use Cases

- Branch-to-headquarters Ethernet bridging over carrier SDH infrastructure
- Secure inter-site connectivity across leased STM-1 circuits
- Ring or chain topology Ethernet-over-SDH transport for resilience
- Passive network tap on STM-1 links for monitoring and analysis
