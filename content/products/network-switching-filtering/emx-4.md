---
title: 'EMX-4'
title_fa: 'EMX-4'
slug: 'emx-4'
category: 'network-switching-filtering'
category_label: 'Network Switching & Filtering'
category_label_fa: 'سوئیچینگ و فیلترینگ'
description: 'EMX-4 is an FPGA-based, OS-less Ethernet tap that passively copies traffic from up to two independent Gigabit Ethernet links to monitoring or analysis ports — with no impact on live traffic.'
description_fa: 'EMX-4 یک سیستم TAP اترنت مبتنی بر FPGA است که بدون هیچ تأثیری بر ترافیک زنده، یک کپی از اطلاعات عبوری را برای تحلیل و مانیتورینگ فراهم می‌کند.'
id: '4f2264e0-ee6c-4505-ae68-582bb1fbd68b'
active: true
priority: 0
specs:
  - label: 'Port Count'
    value: '7 × 1 Gbps Ethernet'
  - label: 'Tap Blocks'
    value: '2 independent tap blocks (ports 6–7 and port 5)'
  - label: 'Mirror Ports'
    value: 'Ports 1, 2, 3 (copy output)'
  - label: 'Physical Mode'
    value: 'Electrical (default) or Optical (jumper-selectable per port)'
  - label: 'Power Supply'
    value: '220 VAC'
  - label: 'Design'
    value: 'FPGA-based, OS-less (no processor, no operating system)'
  - label: 'Configuration'
    value: 'Zero-configuration default; optional console and DIP switches on request'
specs_fa:
  - label: 'تعداد پورت'
    value: '۷ پورت اترنت 1Gbps'
  - label: 'بلاک‌های TAP'
    value: '۲ بلاک TAP مستقل (پورت‌های ۶-۷ و پورت ۵)'
  - label: 'پورت‌های خروجی کپی'
    value: 'پورت‌های ۱، ۲ و ۳'
  - label: 'حالت فیزیکی'
    value: 'الکتریکی (پیش‌فرض) یا نوری (با جامپر)'
  - label: 'منبع تغذیه'
    value: '220 VAC'
  - label: 'طراحی'
    value: 'مبتنی بر FPGA، بدون سیستم‌عامل'
---

## EMX-4 | Product Overview

EMX-4 is a passive Ethernet tap system designed by Partov Ertebat Saba for non-intrusive network traffic analysis and monitoring. It provides a real-time copy of all traffic traversing up to two independent Gigabit Ethernet links, forwarding those copies to dedicated monitoring ports — without disrupting or modifying the live traffic flow in any way.

The device is built on FPGA architecture with no processor or operating system on the data path. This eliminates any risk of the tap itself becoming a vulnerability or introducing latency into the monitored link. EMX-4 is suitable for network monitoring, security analysis, intrusion detection, protocol analysis, and troubleshooting in industrial, government, and carrier environments.

## Architecture

EMX-4 provides two independent tap blocks:

- **Block 1:** Ports 6 and 7 are tapped (optically or electrically). Copies of traffic on these ports appear on ports 1 and 2.
- **Block 2:** Port 5 is tapped electronically. Copies of traffic on this port appear on port 3.

All seven ports are 1 Gbps Ethernet. By default, ports 6 and 7 operate in electrical mode. To use optical connectivity, the jumper beside the relevant port is moved to optical mode — this requires opening the system enclosure.

In standard configuration, EMX-4 requires no console port or DIP switch setup, making deployment zero-touch. If additional configuration flexibility is needed, a console port and DIP switches can be added as a hardware customisation.

## Key Features

- Passive tapping of two independent 1 Gbps Ethernet blocks simultaneously
- Electrical or optical mode selectable per port via internal jumper
- Zero-configuration default — no software setup required
- FPGA-based design using the latest FPGA series for maximum efficiency
- No processor and no operating system — eliminates all software-based attack vectors
- Hardware customisation available based on specific customer requirements
- 220 VAC power supply
