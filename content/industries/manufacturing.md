---
title: 'Manufacturing'
title_fa: 'صنعت و تولید'
slug: 'manufacturing'
description: 'Secure Industry 4.0 networks by enforcing strict OT/IT boundaries on the factory floor.'
locale: en
products:
  - 'data-diode-a10'
  - 'data-diode-a100'
  - 'emx-4'
  - 'emx-5'
faqs:
  - q: 'Can Pesaba diodes pass real-time OEE data from PLCs?'
    a: 'Yes. Modbus TCP and OPC-UA are both supported. The diode bridges the protocol on each side independently, maintaining the one-way constraint while allowing standard SCADA protocols.'
  - q: 'How does the EMX-4 segment production lines without adding latency?'
    a: 'EMX-4 switching is implemented in FPGA logic with deterministic forwarding latency under 1 microsecond — orders of magnitude lower than software-based switches running on embedded Linux.'
---

## The Challenge

Modern manufacturing combines industrial automation — PLCs, robotics, CNC machines, process control — with enterprise systems for production planning, quality management, and supply-chain integration. Industry 4.0 initiatives push for real-time visibility into the shop floor, but every connection between the OT floor and IT systems is a potential attack vector. A ransomware event that reaches PLC-level systems can halt production lines and damage physical equipment.

## Why It Matters

- **Production continuity:** Manufacturing OT systems operate on microsecond timing cycles. Any network interference — whether from a cyberattack or from uncontrolled IT traffic — can disrupt production and damage tooling.
- **IP and recipe protection:** Manufacturing processes encode valuable intellectual property in PLC programs, CNC recipes, and quality parameters. Exfiltration of this data is a competitive and national-security concern.
- **Supply-chain integration pressure:** ERP systems, supplier portals, and logistics platforms must connect to production systems for just-in-time manufacturing, but each integration point extends the attack surface.

## How Pesaba Solves It

Pesaba data diodes enforce a one-way boundary between the OT production floor and the IT enterprise network. Production telemetry, quality data, and OEE metrics flow outward to MES and ERP systems without creating an inbound path. FPGA-native switching on EMX-4 and EMX-5 segments the production network at Layer 2, isolating individual production lines from each other and from the enterprise backbone.
