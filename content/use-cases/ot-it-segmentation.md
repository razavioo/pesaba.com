---
title: 'OT/IT Segmentation'
title_fa: 'تفکیک OT/IT'
slug: 'ot-it-segmentation'
description: 'Architect a hard security boundary between operational technology and information technology networks.'
tagline: 'Segment without sacrificing visibility.'
locale: en
products:
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'emx-4'
  - 'emx-5'
---

## What It Is

OT/IT segmentation is the practice of placing a verifiable, enforced security boundary between the operational technology network — PLCs, DCS controllers, SCADA systems, and field devices — and the corporate information technology network that is connected to the internet, enterprise applications, and user workstations. A meaningful segmentation boundary is not merely a VLAN or a firewall rule that can be misconfigured; it is a hardware-enforced barrier that guarantees no traffic class can traverse it unless explicitly permitted by the physical design. Pesaba data diodes and network encryptors provide the hardware layer that makes segmentation provable rather than assumed.

## Why It Matters

- **Preventing lateral movement from IT to OT:** Most industrial cyber incidents — including high-profile attacks on energy and manufacturing infrastructure — begin with a compromise of the IT network and then move laterally into OT through inadequately controlled boundaries. A hardware data diode at the boundary ensures that even a fully compromised IT environment cannot send commands or malware into OT.
- **Maintaining OT telemetry visibility without creating a return path:** Operators need to see sensor data, alarms, and historian records from OT on IT dashboards. A unidirectional gateway exports that telemetry into IT without creating any channel through which IT can reach OT — visibility without compromise of isolation.
- **Meeting IEC 62443 zone-and-conduit requirements:** The IEC 62443 standard requires that security zones with different security levels be separated by conduits with appropriate controls. A hardware data diode satisfies the highest conduit assurance level (SL 4) for unidirectional conduits in a way that firewall-only solutions cannot.

## How Pesaba Solves It

Pesaba's segmentation architecture combines a data diode for the primary OT-to-IT telemetry conduit with an encrypted management channel — using EMX-4 or EMX-5 — for the narrow set of bidirectional management traffic that must cross the boundary (firmware updates via jump server, time synchronisation). The data diode physically prevents any traffic from reaching OT from IT; the encrypted channel limits bidirectional exposure to a single, cryptographically authenticated path that is logged and audited. Together they implement a zone boundary that satisfies IEC 62443 zone separation requirements without forcing operators to choose between security and operational visibility.

## Recommended Products

- **A100** — 1 Gbps data diode with protocol proxy for OT-to-IT telemetry export; supports Modbus TCP, OPC-UA, and syslog.
- **G200** — 10 Gbps data diode for high-volume historian and alarm replication from large SCADA environments.
- **EMX-4** — 1 Gbps inline network encryptor for authenticated management channels crossing the OT/IT boundary.
- **EMX-5** — 10 Gbps inline encryptor for high-bandwidth encrypted inter-segment links where bidirectional traffic is unavoidable.

## Frequently Asked Questions

**Q: Why is a data diode better than a firewall for OT/IT segmentation?**
A: A firewall enforces policy through software rules that can be misconfigured, bypassed via zero-day exploits, or disabled by a compromised management system. A hardware data diode enforces unidirectionality through its physical construction — there is no rule to misconfigure and no software layer to exploit.

**Q: How do I get firmware updates into OT devices if the diode blocks all inbound traffic?**
A: The recommended architecture uses a strictly controlled jump server in a DMZ segment, connected to OT via an encrypted channel (EMX-4 or EMX-5) with explicit allow-list access controls. Firmware files are validated and queued by a human operator before delivery — they do not flow automatically from IT to OT.

**Q: Can the data diode handle real-time alarm forwarding with low enough latency?**
A: Yes. Pesaba data diodes introduce under 10 microseconds of forwarding latency. Alarm events forwarded via syslog or OPC-UA alarm subscription arrive at the IT SIEM with negligible delay relative to network transit times.

**Q: What happens to OT operations if the data diode fails?**
A: Pesaba diodes are designed to fail closed — they stop forwarding rather than passing traffic in an uncontrolled direction. OT operations continue unaffected because the diode is on the export path, not the control path; no operational commands travel through the diode.
