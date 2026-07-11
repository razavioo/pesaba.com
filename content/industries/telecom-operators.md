---
title: 'Telecom Operators'
title_fa: 'اپراتورهای مخابراتی'
slug: 'telecom-operators'
description: 'Collect and analyse documented mobile-service and radio measurements across 2G, 3G, LTE, and TD-LTE.'
locale: en
products:
  - 'capella'
  - 'auriga'
  - 'venus-pioneer'
  - 'venus-netsens'
  - 'saturn'
faqs:
  - q: 'Does Venus Netsens support simultaneous multi-operator 5G measurement?'
    a: 'The current public record describes a smartphone drive-test application for radio, serving and neighbour-cell, RRC/NAS, voice, data, SMS, indoor, and outdoor measurements. It does not establish 5G NR support or simultaneous multi-SIM and multi-operator measurement. Confirm the target RAT, bands, handset models, modem access, operating-system build, and test concurrency before procurement.'
  - q: 'Does Saturn provide GTP-U or N3 subscriber analytics?'
    a: 'The current product record documents full-packet PCAP capture, session-metadata indexing, search, and export. It does not document GTP-U decapsulation, N3 support, subscriber correlation, lawful-interception functions, or a specific capture throughput. Treat those as separate requirements that need version-specific documentation, privacy review, capacity testing, and acceptance evidence.'
  - q: 'Can Capella ingest data from third-party probes?'
    a: 'The public record documents collection of mobile-service KPIs and integration with Venus Pioneer, but does not establish SNMP, IPFIX, NetFlow, REST, or arbitrary third-party ingestion. Request the current input schema and supported connector matrix for the exact release.'
---

## The Challenge

Mobile operators need repeatable field and network measurements for coverage, service quality, troubleshooting, planning, and reporting. Results are only comparable when devices, routes, time windows, SIM profiles, test scripts, radio technologies, software versions, and statistical methods are controlled and documented.

## Why It Matters

- **Subscriber experience:** Call setup, drops, data performance, latency, and application tests can help identify service degradation when measurement conditions are traceable.
- **Technology coverage:** The current Pesaba product records identify 2G, GPRS, UMTS, LTE, and TD-LTE capabilities for selected tools. Newer RAT or band support should not be inferred without current model and release evidence.
- **Privacy and regulatory scope:** Packet capture and subscriber-related measurements may process sensitive data. Legal basis, minimisation, access control, retention, deletion, and audit requirements need review for each deployment.

## Where Pesaba May Fit

The documented portfolio assigns distinct roles: Venus Netsens provides smartphone drive-test measurements; Auriga supports automated modem-based monitoring; Capella measures service-quality KPIs and KQIs; Venus Pioneer aggregates and reports measurements; and Saturn captures PCAP data and indexes session metadata. Exact RATs, bands, handset or modem compatibility, scale, throughput, third-party connectors, analytics, and reporting acceptance should be verified for the selected release and test design.
