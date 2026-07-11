---
title: 'Saturn'
title_fa: 'سترن'
slug: 'saturn'
category: 'cellular-monitoring'
category_label: 'Cellular Monitoring'
category_label_fa: 'پایش شبکه سلولی'
description: 'Saturn is a large-scale, full-packet capturing, indexing, and database system.'
description_fa: ' Saturn DPI System یک سامانه جامع استخراج، اندیس‌گذاری و ذخیره‌‌سازی پکت‌های (بسته‌های) شبکه است.'
id: '7bb9a198-8fee-4084-9e15-6956accd6c3f'
active: true
priority: 0
specs:
  - label: 'Capture Engine'
    value: 'Full-packet PCAP capture and indexing'
  - label: 'Metadata Store'
    value: 'Elasticsearch for SPI/session metadata'
  - label: 'Web UI'
    value: 'Configuration centre + Saturn Viewer (PCAP search and playback)'
  - label: 'Access Security'
    value: 'HTTPS with password authentication; proxy-server authorization supported'
  - label: 'Export Format'
    value: 'Standard PCAP (compatible with Wireshark and all PCAP-capable tools)'
specs_fa:
  - label: 'پایگاه داده'
    value: 'موتور جستجوی Elasticsearch به عنوان پایگاه‌ داده‌ Saturn جهت ذخیره سازی و جستجوی فراداده‌ها (SPI data) به کار رفته است.'
  - label: 'واسط پیکره‌بندی تحت وب'
    value: 'یک واسط کاربری تحت وب که برای نظارت و مدیریت تنظیمات سرور میزبان به کار می‌رود.'
  - label: 'استخراج کننده'
    value: 'یک برنامه کاربردی است، که ترافیک شبکه را نظارت کرده و فایل های PCAP را بر روی دیسک ذخیره می‌کند و همزمان بسته‌های شبکه را آنالیز نموده و فراداده های استخراج شده (Session Profile Information) را در موتور جستجوی Elasticsearch ذخیره می‌کند.'
  - label: 'فرمت ذخیره‌سازی'
    value: 'فایل‌های استاندارد PCAP قابل تحلیل در Wireshark و سایر ابزارها'
  - label: 'امنیت دسترسی'
    value: 'HTTPS با رمز عبور؛ پشتیبانی از احراز هویت از طریق سرور پروکسی'
---

## Saturn DPI System | Product Overview

Saturn is a comprehensive network packet capture, indexing, and storage system. It continuously monitors network traffic and indexes the content in standard PCAP file format, while simultaneously extracting and storing session metadata (Session Profile Information — SPI data) in an Elasticsearch database for rapid search and retrieval.

Saturn is designed for network operations centres, security teams, and telecom operators that need full-fidelity visibility into network traffic — enabling forensic investigation, troubleshooting, quality monitoring, and security auditing at scale.

## Architecture

Saturn consists of three tightly integrated components:

**Capture Engine (Extractor)**
A high-performance packet capture application that monitors network traffic, writes full-payload PCAP files to disk, and simultaneously parses each packet stream to extract session metadata. Metadata is stored in Elasticsearch, providing sub-second search latency across large capture archives.

**Saturn Viewer**
A web-based user interface deployed on each capture host. Operators use it to search, filter, and inspect PCAP files — applying filters on IP address, port, protocol, time window, or session attributes. Results can be downloaded as standard PCAP files for further analysis in Wireshark or any other packet analysis tool.

**Configuration Centre**
A web-based management interface for monitoring capture host status, configuring capture filters and storage policies, and managing Elasticsearch cluster parameters. Access is protected by HTTPS with password authentication; proxy-based authorization is also supported for integration with enterprise identity systems.

## Key Features

- Full-packet capture at line rate with PCAP storage
- Elasticsearch-backed metadata indexing for high-speed search across large capture datasets
- Dual web interfaces: Configuration Centre (management) and Saturn Viewer (analysis)
- Standard PCAP output — compatible with Wireshark and all PCAP-capable analysis tools
- Secure HTTPS access with password and optional proxy-server authentication
- Scalable deployment across multiple capture hosts with centralised management
- Session-level KPI extraction for protocol analysis and subscriber-level troubleshooting
- Integration with the Venus Pioneer reporting platform for consolidated network quality dashboards
