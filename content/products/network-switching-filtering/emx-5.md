---
title: 'EMX-5'
title_fa: 'EMX-5'
slug: 'emx-5'
category: 'network-switching-filtering'
category_label: 'Network Switching & Filtering'
category_label_fa: 'سوئیچینگ و فیلترینگ'
description: 'EMX-5 is an FPGA-based, OS-less SDH and 10G Ethernet analyser and probe — supporting up to 4 STM-64 / 10 GbE links with VC4-level demux, IP-based extraction, and GFP decoding.'
description_fa: 'دستگاه EMX5، یک سیستم شامل سخت افزار و نرم افزار است و به منظور تحلیل و پردازش اطلاعات شبکه های مبتنی بر فیبر نوری با نرخ 10Gbps مورد استفاده قرار می گیرد.'
id: '0c8857f7-f52f-483d-87dc-b8fbbc798617'
active: true
priority: 0
specs:
  - label: 'Optical Ports'
    value: '8 × front-panel optical ports (firmware-selectable: STM-64 or 10 GbE)'
  - label: 'Ethernet Ports'
    value: '5 × 1 Gbps Ethernet (rear panel) for VC4 or IP-based extraction output'
  - label: 'Maximum Link Capacity'
    value: 'Up to 4 × STM-64 or up to 4 × 10 GbE'
  - label: 'Cascading'
    value: 'STM-64 links cascadable from one system to another'
  - label: 'Demux Capability'
    value: 'E1 demux from programmed VC4s; GFP protocol demux and decode on programmed VC4s'
  - label: 'Configuration'
    value: '4-port DIP switch for instant configuration; console port for management software'
  - label: 'Memory'
    value: '4 GB DDR3 RAM'
  - label: 'Extras'
    value: 'Integrated GPS receiver; SDH analyser software included'
  - label: 'Firmware'
    value: 'Field-upgradable without opening the chassis'
  - label: 'Design'
    value: 'FPGA-based, OS-less'
specs_fa:
  - label: 'قابلیت دیماکس و استخراج'
    value: 'قابلیت دیماکس و استخراج E1 روی VC4 های برنامه ریزی شده'
  - label: 'پورت'
    value: '4-port DIP-Switch'
  - label: 'پورت اترنت'
    value: 'دارای 5 پورت اترنت 1Gbps به منظور تخصیص اطلاعات VC4 خاص یا IP خاص براساس پیکربندی'
  - label: 'نرم افزار کاربردی'
    value: 'نرم افزار کاربری به منظور تحلیل اطلاعات'
  - label: 'قابلیت برنامه ریزی'
    value: 'قابلیت برنامه ریزی برای جداسازی VC4 های خاص'
  - label: 'قابلیت اتصال'
    value: 'قابلیت اتصال به حداکثر 4 لینک STM64'
  - label: 'قابلیت عملکرد'
    value: 'روی پورت های اترنت 10Gbps'
  - label: 'قابلیت اتصال'
    value: 'قابلیت اتصال از طریق پورت کنسول به نرم افزار کاربری'
  - label: 'قابلیت بروزرسانی'
    value: 'قابلیت به روزرسانی Firmware بدون بازشدن سخت افزاری سیستم'
  - label: 'قابلیت آبشاری بودن لینک'
    value: 'قابلیت آبشاری بودن لینک های STM64 از یک سیستم به سیستم دیگر'
  - label: 'قابلیت دیماکس و دیکود'
    value: 'قابلیت دیماکس و دیکود پروتکل GFP روی VC4 های برنامه ریزی شده'
---

## EMX-5 (STM-64 / 10G Analyser) | Product Overview

EMX-5 is a combined SDH and 10G Ethernet analyser, probe, and monitoring device designed and manufactured by Partov Ertebat Saba. The system can operate either as an SDH analyser or as a 10G Ethernet probe — selectable per port via firmware loaded into the FPGA — making it a flexible measurement and tap platform for carrier-grade fibre networks.

EMX-5 is typically deployed as a passive tap on live fibre links for network monitoring and content analysis. It can extract specific data sections — identified by VC4 number or by IP address — and forward those extracted streams on a separate Ethernet output port for logging, deeper analysis, or detailed monitoring.

The system is built on the latest FPGA technology with no operating system in the data path. There is no general-purpose CPU, no Linux, and no Windows — eliminating the entire class of software-based attacks against the measurement tool itself.

## Architecture

- **Front panel:** 8 optical ports, firmware-selectable as either STM-64 or 10 GbE
- **Rear panel:** 5 × 1 Gbps Ethernet ports for output of extracted VC4 or IP traffic, plus 1 console port for management
- **Memory:** 4 GB DDR3 RAM for capture buffering
- **GPS:** integrated GPS receiver for accurate timestamping of measurements

## Key Features

- Up to 4 × STM-64 or 4 × 10 GbE link analysis simultaneously
- 5 × 1 Gbps Ethernet output ports — VC4 or IP-based traffic extraction by configuration
- Programmable VC4 separation and routing
- E1 demux and extraction from programmed VC4 channels
- GFP protocol demux and decode on programmed VC4 channels
- STM-64 link cascading from one system to another for chained capture
- Integrated GPS receiver for precise time-synchronised analysis
- 4-port DIP switch for instant runtime configuration
- Console port connection to dedicated management software
- SDH analyser software included
- Field firmware upgrade without opening the hardware chassis
- FPGA-based design with fast boot-up and zero OS attack surface
