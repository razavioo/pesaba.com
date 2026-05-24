#!/usr/bin/env python3
"""seed-content.py — generates glossary terms, use-case pages, and industry pages."""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
CONTENT = ROOT / 'content'

def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')
    print(f'  ✓ {path.relative_to(ROOT)}')

# ─── Glossary (50 terms) ─────────────────────────────────────────────────────

GLOSSARY = [
    # (slug, title_en, title_fa, short_def, category, related_products, related_articles)
    ("aes", "AES", "AES", "Advanced Encryption Standard — the symmetric block cipher used in virtually all modern data encryption.", "encryption", ["emx-6", "upcryptor"], ["what-is-aes-algorithm"]),
    ("aes-256", "AES-256", "AES-256", "AES with a 256-bit key length; the most widely deployed symmetric cipher in critical infrastructure.", "encryption", ["emx-6", "upcryptor"], ["what-is-aes-algorithm"]),
    ("aes-gcm", "AES-GCM", "AES-GCM", "AES in Galois/Counter Mode — provides both encryption and authentication in a single pass.", "encryption", ["emx-6"], ["what-is-aes-algorithm"]),
    ("macsec", "MACsec", "MACsec", "IEEE 802.1AE — link-layer encryption standard that secures Ethernet frames hop by hop.", "encryption", ["emx-6"], []),
    ("ipsec", "IPsec", "IPsec", "A suite of protocols that authenticates and encrypts IP packets at the network layer.", "encryption", ["emx-6", "upcryptor"], []),
    ("data-diode", "Data Diode", "دیتادیود", "A hardware security device that enforces one-way data flow by physically eliminating any return path.", "data-diodes", ["data-diode-a10", "data-diode-a100", "data-diode-g200", "data-diode-g300", "data-diode-k200"], ["what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer"]),
    ("cross-domain-solution", "Cross-Domain Solution", "راهکار چندحوزه‌ای", "A controlled interface that enables authorized transfer of information between security domains.", "data-diodes", ["data-diode-g200", "data-diode-k200"], []),
    ("fpga", "FPGA", "FPGA", "Field-Programmable Gate Array — a reconfigurable integrated circuit used in hardware-accelerated security devices.", "hardware", ["emx-6", "data-diode-g200"], ["hardware-encryption-vs-software-encryption-which-is-safer-for-critical-infrastructure"]),
    ("os-less", "OS-Less Architecture", "معماری بدون سیستم‌عامل", "A hardware design that operates without a general-purpose operating system, eliminating the software attack surface.", "hardware", ["emx-6", "data-diode-a10"], ["hardware-encryption-vs-software-encryption-which-is-safer-for-critical-infrastructure"]),
    ("scada", "SCADA", "SCADA", "Supervisory Control and Data Acquisition — industrial control systems used in power, oil & gas, and water utilities.", "ot-ics", [], ["what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer"]),
    ("plc", "PLC", "PLC", "Programmable Logic Controller — a hardened computer used to automate industrial electromechanical processes.", "ot-ics", [], []),
    ("rtu", "RTU", "RTU", "Remote Terminal Unit — a microprocessor-controlled field device that interfaces objects in the physical world to a SCADA system.", "ot-ics", [], []),
    ("dcs", "DCS", "DCS", "Distributed Control System — a control system for a process or plant in which the controller elements are not central in location.", "ot-ics", [], []),
    ("ot", "OT (Operational Technology)", "فناوری عملیاتی (OT)", "Hardware and software that detects or causes changes through direct monitoring and control of industrial equipment.", "ot-ics", [], ["what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer"]),
    ("it-ot-convergence", "IT/OT Convergence", "همگرایی IT/OT", "The integration of information technology and operational technology systems, which introduces new cybersecurity challenges.", "ot-ics", [], []),
    ("sdh", "SDH", "SDH", "Synchronous Digital Hierarchy — a standard for data transmission over optical fiber used in telecom backbone networks.", "telecom", ["corn-stm1", "sdx"], []),
    ("otn", "OTN", "OTN", "Optical Transport Network — a set of standards defining how to transport client signals over optical networks.", "telecom", ["corn-stm1"], []),
    ("stm-1", "STM-1", "STM-1", "Synchronous Transport Module level 1 — the base signal in SDH with 155.52 Mbit/s capacity.", "telecom", ["corn-stm1"], []),
    ("gfp", "GFP", "GFP", "Generic Framing Procedure (ITU G.7041) — used to adapt client signals into OTN/SDH frames.", "telecom", ["corn-stm1", "corn-e1"], []),
    ("sfp", "SFP", "SFP", "Small Form-factor Pluggable — a hot-swappable transceiver used for both fibre-optic and copper connections.", "hardware", [], []),
    ("qsfp", "QSFP", "QSFP", "Quad Small Form-factor Pluggable — a high-density transceiver supporting 4× 10/25/100 Gbps lanes.", "hardware", [], []),
    ("rj45", "RJ45", "RJ45", "Registered Jack 45 — the standard connector for Ethernet cables (8P8C).", "hardware", [], []),
    ("cssr", "CSSR", "CSSR", "Call Setup Success Rate — the percentage of call setup attempts that are completed successfully on a mobile network.", "cellular", ["capella", "auriga"], []),
    ("rsrp", "RSRP", "RSRP", "Reference Signal Received Power — a measure of the power of LTE/NR reference signals received by a UE.", "cellular", ["capella", "auriga", "venus-netsens"], []),
    ("rsrq", "RSRQ", "RSRQ", "Reference Signal Received Quality — indicates the quality of the received reference signal in LTE/NR.", "cellular", ["capella", "auriga"], []),
    ("sinr", "SINR", "SINR", "Signal-to-Interference-plus-Noise Ratio — a measure of signal quality in a wireless communication link.", "cellular", ["capella", "venus-netsens"], []),
    ("drive-test", "Drive Test", "درایو تست", "A methodology for measuring the performance of a mobile network while driving through the coverage area.", "cellular", ["venus-netsens", "venus-challenger"], []),
    ("walk-test", "Walk Test", "واک تست", "Measurement of indoor mobile network coverage and quality by walking with test equipment.", "cellular", ["venus-challenger"], []),
    ("packet-capture", "Packet Capture", "ضبط بسته", "The process of intercepting and recording data packets traversing a network, used for analysis and troubleshooting.", "networking", ["saturn"], []),
    ("symmetric-encryption", "Symmetric Encryption", "رمزنگاری متقارن", "Encryption where the same key is used for both encryption and decryption.", "encryption", ["emx-6", "upcryptor"], ["how-do-symmetric-and-asymmetric-encryption-algorithms-work"]),
    ("asymmetric-encryption", "Asymmetric Encryption", "رمزنگاری نامتقارن", "Encryption that uses a public key for encryption and a private key for decryption.", "encryption", ["emx-6"], ["how-do-symmetric-and-asymmetric-encryption-algorithms-work"]),
    ("pki", "PKI", "زیرساخت کلید عمومی (PKI)", "Public Key Infrastructure — a framework of policies and procedures for managing digital certificates and public keys.", "encryption", [], ["how-do-symmetric-and-asymmetric-encryption-algorithms-work"]),
    ("key-rotation", "Key Rotation", "چرخش کلید رمزنگاری", "The practice of periodically replacing cryptographic keys to limit exposure from a compromised key.", "encryption", ["emx-6"], []),
    ("hsm", "HSM", "HSM", "Hardware Security Module — a physical device that manages and protects cryptographic keys.", "encryption", ["emx-6"], []),
    ("firewall", "Firewall", "فایروال", "A network security device that monitors and controls incoming and outgoing traffic based on defined rules.", "networking", [], ["what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer"]),
    ("ids", "IDS", "IDS", "Intrusion Detection System — monitors network traffic for suspicious activity and issues alerts.", "networking", [], []),
    ("ips", "IPS", "IPS", "Intrusion Prevention System — monitors network traffic and can automatically block detected threats.", "networking", [], []),
    ("dpi", "DPI", "بازرسی عمیق بسته (DPI)", "Deep Packet Inspection — examines the data part of a network packet as it passes an inspection point.", "networking", ["emx-4", "emx-5"], []),
    ("niap", "NIAP", "NIAP", "National Information Assurance Partnership — the US body that oversees Common Criteria evaluations for IT security products.", "standards", ["data-diode-g200", "data-diode-k200"], []),
    ("common-criteria", "Common Criteria", "معیارهای مشترک", "An international standard (ISO/IEC 15408) for computer security certification.", "standards", ["data-diode-g200", "data-diode-k200"], []),
    ("fips-140", "FIPS 140", "FIPS 140", "Federal Information Processing Standard 140 — US government standard for cryptographic module security.", "standards", ["emx-6"], []),
    ("iec-62443", "IEC 62443", "IEC 62443", "International standard series for cybersecurity of industrial automation and control systems (IACS).", "standards", [], []),
    ("nist-800-82", "NIST SP 800-82", "NIST SP 800-82", "Guide to Industrial Control Systems (ICS) Security — the primary US reference for OT security.", "standards", [], []),
    ("netflow", "NetFlow", "NetFlow", "A Cisco network protocol for collecting IP traffic information and monitoring network flow.", "networking", ["saturn"], []),
    ("sflow", "sFlow", "sFlow", "A multi-vendor sampling technology providing real-time network monitoring of very high-speed networks.", "networking", ["saturn"], []),
    ("opc-ua", "OPC UA", "OPC UA", "OPC Unified Architecture — a machine-to-machine communication protocol for industrial automation.", "ot-ics", [], []),
    ("modbus", "Modbus", "Modbus", "A serial communication protocol used for connecting electronic devices in industrial networks.", "ot-ics", [], []),
    ("dnp3", "DNP3", "DNP3", "Distributed Network Protocol 3 — used in utility SCADA systems for communication between substations.", "ot-ics", [], []),
    ("throughput", "Throughput", "پهنای باند عملیاتی", "The amount of data successfully transferred per unit time across a network link.", "networking", [], []),
    ("latency", "Latency", "تأخیر شبکه", "The delay between a data packet being sent and received across a network.", "networking", [], []),
]

print(f'\n📚 Seeding {len(GLOSSARY)} glossary terms...')
for term in GLOSSARY:
    s, title_en, title_fa, short_def, category, related_products, related_articles = term

    related_products_yaml = ''
    if related_products:
        related_products_yaml = '\nrelated_products:\n' + '\n'.join(f"  - '{p}'" for p in related_products)
    related_articles_yaml = ''
    if related_articles:
        related_articles_yaml = '\nrelated_articles:\n' + '\n'.join(f"  - '{a}'" for a in related_articles)

    content_en = f"""---
title: '{title_en}'
title_fa: '{title_fa}'
slug: '{s}'
short_definition: '{short_def.replace("'", "''")}'
category: '{category}'
locale: en{related_products_yaml}{related_articles_yaml}
---

## Definition

{short_def}

## In Depth

<!-- Add 200-word explanation here -->

## Related Pesaba Products

<!-- Auto-linked by related_products frontmatter -->

## Further Reading

<!-- Links to RFC, IEEE, NIST references -->
"""
    write(CONTENT / 'glossary' / f'{s}.md', content_en)

    content_fa = f"""---
title: '{title_fa}'
title_en: '{title_en}'
slug: '{s}'
short_definition: '{short_def.replace("'", "''")}'
category: '{category}'
locale: fa{related_products_yaml}{related_articles_yaml}
---

## تعریف

{short_def}

## توضیح تخصصی

<!-- توضیح ۲۰۰ کلمه‌ای اینجا اضافه شود -->

## محصولات مرتبط پرتو ارتباط صبا

<!-- از طریق فرانت‌متر related_products لینک می‌شود -->

## مطالعه بیشتر

<!-- لینک به RFC، IEEE، NIST -->
"""
    write(CONTENT / 'glossary' / f'{s}.fa.md', content_fa)

print(f'  → {len(GLOSSARY)} terms × 2 locales = {len(GLOSSARY) * 2} files')

# ─── Use Cases ───────────────────────────────────────────────────────────────

USE_CASES = [
    ("one-way-data-transfer", "One-Way Data Transfer", "انتقال یک‌طرفه داده",
     "Use hardware-enforced one-way data flow to permanently eliminate the attack surface between OT and IT networks.",
     "Enforced through physics — not policy.",
     ["data-diode-a10", "data-diode-a100", "data-diode-g200", "data-diode-g300", "data-diode-k200"]),
    ("aes-256-network-encryption", "AES-256 Network Encryption", "رمزنگاری شبکه AES-256",
     "Encrypt data in transit with hardware-accelerated AES-256 without introducing software vulnerabilities.",
     "FPGA-native encryption — no OS, no attack surface.",
     ["emx-6", "upcryptor"]),
    ("cellular-quality-monitoring", "Cellular Quality Monitoring", "پایش کیفیت شبکه سلولی",
     "Measure, capture, and analyse mobile network KPIs across 2G/3G/4G/5G in real time.",
     "Measurement before decision.",
     ["capella", "auriga", "saturn", "venus-netsens", "venus-challenger", "venus-pioneer"]),
    ("scada-isolation", "SCADA Isolation", "ایزولاسیون SCADA",
     "Physically isolate SCADA and ICS networks from enterprise IT while maintaining one-way telemetry export.",
     "Your SCADA cannot be reached from outside — by design.",
     ["data-diode-g200", "data-diode-g300", "data-diode-k200"]),
    ("ot-it-segmentation", "OT/IT Segmentation", "تفکیک OT/IT",
     "Architect a hard security boundary between operational technology and information technology networks.",
     "Segment without sacrificing visibility.",
     ["data-diode-a100", "data-diode-g200", "emx-4", "emx-5"]),
    ("water-toxicity-monitoring", "Water Toxicity Monitoring", "پایش سمیت آب",
     "Continuously monitor water quality parameters using hardware sensors and automated alerting.",
     "Real-time detection. Zero false negatives.",
     ["orazan"]),
]

print(f'\n🎯 Seeding {len(USE_CASES)} use-case pages...')
for uc in USE_CASES:
    s, title_en, title_fa, desc, tagline, products = uc
    products_yaml = '\nproducts:\n' + '\n'.join(f"  - '{p}'" for p in products) if products else ''

    content_en = f"""---
title: '{title_en}'
title_fa: '{title_fa}'
slug: '{s}'
description: '{desc.replace("'","''")}'
tagline: '{tagline.replace("'","''")}'
locale: en{products_yaml}
---

## What It Is

{desc}

## Why It Matters

<!-- 3 bullet KPIs or pain points -->

## How We Do It

<!-- Methodology / step-by-step -->

## The Pesaba Solution

<!-- Recommended product stack from frontmatter -->

## FAQ

<!-- 5-8 FAQs -->
"""
    write(CONTENT / 'use-cases' / f'{s}.md', content_en)

    content_fa = f"""---
title: '{title_fa}'
title_en: '{title_en}'
slug: '{s}'
description: '{desc.replace("'","''")}'
tagline: '{tagline.replace("'","''")}'
locale: fa{products_yaml}
---

## چیست

{desc}

## چرا اهمیت دارد

<!-- ۳ معیار KPI یا مشکل -->

## چطور انجام می‌شود

<!-- روش‌شناسی -->

## راهکار پرتو ارتباط صبا

<!-- استک محصولات پیشنهادی از فرانت‌متر -->

## سوالات متداول

<!-- ۵ تا ۸ سوال -->
"""
    write(CONTENT / 'use-cases' / f'{s}.fa.md', content_fa)

print(f'  → {len(USE_CASES)} use-cases × 2 locales = {len(USE_CASES) * 2} files')

# ─── Industries ───────────────────────────────────────────────────────────────

INDUSTRIES = [
    ("power-grid", "Power Grid", "شبکه برق",
     "Protect power-generation and transmission SCADA from cyber threats with hardware-enforced isolation.",
     ["data-diode-g200", "data-diode-g300", "emx-6"]),
    ("oil-and-gas", "Oil & Gas", "نفت و گاز",
     "Secure upstream, midstream, and downstream OT networks against targeted attacks.",
     ["data-diode-g300", "data-diode-k200", "emx-6"]),
    ("water-utilities", "Water Utilities", "آب و فاضلاب",
     "Monitor water quality in real time and isolate treatment-plant control systems.",
     ["orazan", "data-diode-a100", "data-diode-g200"]),
    ("telecom-operators", "Telecom Operators", "اپراتورهای مخابراتی",
     "Measure and improve network quality across 2G/3G/4G/5G with end-to-end cellular monitoring.",
     ["capella", "auriga", "venus-pioneer", "venus-netsens", "saturn"]),
    ("government", "Government", "دولت",
     "Sovereign, sanctions-resilient hardware for government network security and communications.",
     ["data-diode-k200", "emx-6", "emx-4"]),
    ("defense", "Defense", "دفاع",
     "Hardened, OS-less network security for defense infrastructure with the highest assurance levels.",
     ["data-diode-k200", "data-diode-g300", "emx-6"]),
    ("banking-finance", "Banking & Finance", "بانک و مالی",
     "Protect financial network infrastructure and data-center interconnects with hardware-grade encryption.",
     ["emx-6", "upcryptor", "emx-5"]),
    ("manufacturing", "Manufacturing", "صنعت و تولید",
     "Secure Industry 4.0 networks by enforcing strict OT/IT boundaries on the factory floor.",
     ["data-diode-a10", "data-diode-a100", "emx-4", "emx-5"]),
]

print(f'\n🏭 Seeding {len(INDUSTRIES)} industry pages...')
for ind in INDUSTRIES:
    s, title_en, title_fa, desc, products = ind
    products_yaml = '\nproducts:\n' + '\n'.join(f"  - '{p}'" for p in products) if products else ''

    content_en = f"""---
title: '{title_en}'
title_fa: '{title_fa}'
slug: '{s}'
description: '{desc.replace("'","''")}'
locale: en{products_yaml}
---

## The Challenge

{desc}

## Reference Architecture

<!-- Isometric SVG schematic will go here -->

## Recommended Product Stack

<!-- Products from frontmatter -->

## Relevant Standards

<!-- IEC 62443, NIST 800-82, etc. -->

## Case Study

<!-- Anonymised deployment story -->
"""
    write(CONTENT / 'industries' / f'{s}.md', content_en)

    content_fa = f"""---
title: '{title_fa}'
title_en: '{title_en}'
slug: '{s}'
description: '{desc.replace("'","''")}'
locale: fa{products_yaml}
---

## چالش

{desc}

## معماری مرجع

<!-- شماتیک SVG ایزومتریک اینجا قرار می‌گیرد -->

## استک محصولات پیشنهادی

<!-- محصولات از فرانت‌متر -->

## استانداردهای مرتبط

<!-- IEC 62443، NIST 800-82 و غیره -->

## نمونه موردی

<!-- داستان استقرار غیراسمی -->
"""
    write(CONTENT / 'industries' / f'{s}.fa.md', content_fa)

print(f'  → {len(INDUSTRIES)} industries × 2 locales = {len(INDUSTRIES) * 2} files')
print('\n✅ Content seeding complete.\n')
