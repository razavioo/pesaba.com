---
title: 'Oil & Gas'
title_fa: 'نفت و گاز'
slug: 'oil-and-gas'
description: 'Secure upstream, midstream, and downstream OT networks against targeted attacks.'
locale: en
products:
  - 'data-diode-g300'
  - 'data-diode-k200'
  - 'emx-6'
faqs:
  - q: 'Can the diode handle intermittent satellite links?'
    a: 'Yes. Pesaba diodes buffer traffic during link outages and flush queued data when connectivity resumes, without introducing a return channel.'
  - q: 'How does the K200 key-switch work?'
    a: 'The K200 has a physical two-position key switch on the front panel. In the "one-way" position the device operates as a standard data diode. Turning the key to "bidirectional" enables a controlled two-way mode; the device logs the transition with a hardware timestamp.'
  - q: 'What protocols are supported for process historian replication?'
    a: 'OPC-UA, Modbus TCP, DNP3, and raw TCP/UDP streams are all supported. Protocol-specific bridges maintain session state on each side independently.'
---

## The Challenge

Oil and gas operations span thousands of kilometres — pipelines, compressor stations, offshore platforms, and onshore processing facilities — all connected through diverse communications infrastructure. SCADA and DCS systems controlling flow, pressure, and valve states are safety-critical: unplanned shutdowns or incorrect valve commands can cause spills, fires, or loss of containment. At the same time, operational efficiency demands near-real-time visibility into every node, creating relentless pressure to connect OT to corporate and cloud analytics systems.

## Why It Matters

- **Safety consequences:** Incorrect control-system commands in an oil and gas environment can cause hydrocarbon releases, ignition, or pressure-vessel failure. Cyber events in this sector have caused physical damage and prolonged production shutdowns.
- **Remote and isolated sites:** Compressor stations and wellheads may be unattended for weeks. Remote monitoring is essential; uncontrolled remote access is equally dangerous.
- **Regulatory classification:** Iran's oil and gas infrastructure is classified as critical national infrastructure. Security controls must meet or exceed AFTA category-1 requirements.

## How Pesaba Solves It

Pesaba data diodes allow production telemetry, process historian data, and alarm feeds to flow from the OT environment to corporate analytics platforms without creating an exploitable return path. For sites requiring authenticated remote access — such as DCS firmware updates or emergency remote intervention — the K200 provides a hardware-controlled bidirectional capability with a physical key-switch enable mechanism, ensuring that two-way access can only be activated deliberately and is logged at the hardware level.
