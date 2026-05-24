---
title: 'Power Grid'
title_fa: 'شبکه برق'
slug: 'power-grid'
description: 'Protect power-generation and transmission SCADA from cyber threats with hardware-enforced isolation.'
locale: en
products:
  - 'data-diode-g200'
  - 'data-diode-g300'
  - 'emx-6'
faqs:
  - q: 'Can a data diode pass OPC-UA traffic?'
    a: 'Yes. Pesaba diodes include a software bridge that accepts OPC-UA on the source side and re-publishes subscribed items to an OPC-UA server on the destination side — without opening a return channel.'
  - q: 'How does remote maintenance work with a one-way diode in place?'
    a: 'Maintenance access is handled through a separate, controlled bidirectional path (often a jump server with session recording) isolated from the historian replication path. The diode path is strictly for outbound data.'
  - q: 'What happens to the diode if network traffic exceeds 1 Gbps?'
    a: 'Traffic is dropped at the input; the OT source is unaffected. The diode never introduces back-pressure into the control network.'
---

## The Challenge

Power-generation and transmission networks run SCADA systems that control physical equipment — turbines, switchgear, protection relays — where a successful cyberattack can cause generation outages, equipment damage, or cascading grid failures. These OT environments were designed for reliability, not security, and were never intended to connect to IP networks. The growth of remote monitoring, smart-grid integration, and energy-management systems has made that connection unavoidable. The challenge is allowing the necessary data flows — historian replication, monitoring, reporting — while keeping every adversary out of the control plane.

## Why It Matters

- **Physical consequences:** Unlike IT breaches, a compromised SCADA system controlling a substation can trip breakers, damage transformers, or cause uncontrolled load shedding. Recovery time is measured in days, not hours.
- **Regulatory pressure:** IEC 62443, NERC CIP (for international operators), and Iranian AFTA guidelines increasingly mandate documented security controls for level-2 and level-3 OT zones. Non-compliance carries licensing and operational risk.
- **Expanding attack surface:** The integration of metering, renewables, and distributed energy resources has added thousands of IP-connected endpoints to networks that once had none.

## How Pesaba Solves It

Pesaba data diodes enforce a hardware gap between the OT control zone and the corporate or monitoring network. Historian data, alarm streams, and process telemetry flow outward in one direction only — using FPGA optical hardware that physically removes the reverse path. No software patch can re-enable it. For links that require bidirectional flow — such as firmware delivery or remote-access jump servers — Pesaba's EMX-6 encrypts traffic at line rate, ensuring that even if a link is tapped, the payload is cryptographically protected.
