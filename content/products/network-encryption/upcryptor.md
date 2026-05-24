---
title: 'Upcryptor'
title_fa: 'Upcryptor'
slug: 'upcryptor'
category: 'network-encryption'
category_label: 'Network Encryption'
category_label_fa: 'رمزنگاری شبکه'
description: 'Upcryptor is an FPGA-based, OS-less AES-256 Ethernet encryptor with 10 Gbps throughput and hardware-enforced traffic filtering for critical networks.'
description_fa: 'Upcryptor یک رمزکننده اطلاعات در فضای اترنت است. الگوریتم رمز استفاده شده در این سیستم AES256 است.'
id: 'ff293a73-29a0-429c-a86e-fd502981965e'
active: true
priority: 0
specs:
  - label: 'Encryption Algorithm'
    value: 'AES-256'
  - label: 'Data Ports'
    value: '2 × 10 Gbps Ethernet (one Electrical/Optical switchable)'
  - label: 'Console Port'
    value: '10/100 Mbps Ethernet'
  - label: 'Key Storage'
    value: 'User-programmable USB Dongle (encrypted key storage)'
  - label: 'Supported Modes'
    value: 'MACsec, IPsec, No-Sec'
  - label: 'Traffic Filtering'
    value: 'MAC Address, IP Address, Port, Protocol (inbound and outbound)'
  - label: 'Power Supply'
    value: '60 W / 220 VAC'
  - label: 'Design'
    value: 'FPGA-based, OS-less'
  - label: 'Management'
    value: 'SNMP, Syslog, Web-based management software'
  - label: 'Form Factor'
    value: '1U Rack Mount'
specs_fa:
  - label: 'الگوریتم رمزگذاری'
    value: 'AES256'
  - label: 'پورت داده'
    value: '۲ پورت 10Gbps اترنت (یکی Electrical/Optical)'
  - label: 'پورت کنسول'
    value: '10/100 Mbps'
  - label: 'ذخیره‌سازی کلید رمز'
    value: 'USB Dongle قابل برنامه‌ریزی توسط کاربر'
  - label: 'حالت‌های پشتیبانی‌شده'
    value: 'MACsec، IPsec، No-Sec'
  - label: 'فیلترینگ ترافیک'
    value: 'MAC، IP، Port، Protocol (ورودی و خروجی)'
  - label: 'منبع تغذیه'
    value: '60W / 220VAC'
  - label: 'طراحی'
    value: 'مبتنی بر FPGA، بدون سیستم‌عامل'
---

## Upcryptor | Product Overview

Upcryptor is a hardware-based Ethernet encryptor designed and manufactured by Partov Ertebat Saba. Built on FPGA architecture with no operating system on the data path, Upcryptor provides AES-256 encryption for 10 Gbps Ethernet links between secure and non-secure network segments — eliminating the software vulnerabilities inherent in general-purpose encryption appliances.

The device operates as an inline bump-in-the-wire encryptor: one 10 Gbps port connects to the secure (trusted) network and the other connects to the untrusted network or WAN. All traffic crossing the device is encrypted or decrypted at line rate using AES-256, with no CPU involved in the data path.

## Key Features

**AES-256 Hardware Encryption**
All data in transit is encrypted using AES-256. The encryption key is stored in an encrypted memory inside a user-programmable USB Dongle attached to the rear panel. The key never leaves the dongle in plaintext and is never transmitted over the data interface.

**Three Communication Modes**
Upcryptor supports three selectable communication modes:

- **MACsec** — IEEE 802.1AE Layer-2 encryption for point-to-point Ethernet links
- **IPsec** — Layer-3 IP-level encryption for routed environments
- **No-Sec** — Pass-through mode for testing or non-encrypted segments

**10 Gbps Optical and Electrical Connectivity**
One of the two 10 Gbps data ports supports both Electrical and Optical (SFP+) connections, making Upcryptor suitable for long-distance fibre links between facilities, data centres, or remote sites.

**Hardware Traffic Filtering**
Via the 10/100 Mbps console port and the included web-based management software, administrators can configure bidirectional packet filters based on:

- MAC Address
- IP Address
- Port number
- Protocol type

Filtering is applied at wire speed by FPGA logic — no software rule engine, no CVE exposure.

**OS-less FPGA Architecture**
No operating system runs on Upcryptor's data path. The FPGA fabric handles encryption, decryption, and filtering deterministically. There is no Windows, no Linux, no embedded OS to patch, exploit, or misconfigure. Firmware is upgradeable over the management interface without opening the hardware.

**Management and Monitoring**
System status is reported via SNMP and Syslog, and can be monitored in real time through the web-based management software. Form factor is standard 1U rack-mount, compatible with 19-inch rack enclosures.

## Relevant Internal Links

- How EMX-6 and Upcryptor compare for point-to-point encryption
- What is AES-256?
