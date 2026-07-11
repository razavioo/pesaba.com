---
title: 'OT/IT Segmentation'
title_fa: 'تفکیک OT/IT'
slug: 'ot-it-segmentation'
description: 'Design explicit zones, conduits, one-way exports, monitoring, and maintenance paths between OT and IT.'
tagline: 'Segment by architecture, then verify every permitted path.'
locale: en
products:
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'emx-4'
  - 'emx-6'
---

## What It Is

OT/IT segmentation separates systems by consequence, trust, function, and operational need, then permits only documented communications between zones. VLANs, firewalls, one-way links, encryption, passive monitoring, jump hosts, identity controls, and physical procedures can each contribute. No single product makes segmentation complete or proves that every alternative route has been removed.

## Why It Matters

- **Limit lateral movement:** Fewer and better-controlled conduits can reduce the paths available after an IT or OT endpoint is compromised.
- **Preserve necessary visibility:** Selected telemetry can be exported while maintenance, command, and emergency access use separately assessed paths.
- **Make requirements testable:** IEC 62443 zone-and-conduit concepts can structure the design, but a product does not automatically satisfy a security level. Asset scope, threat model, foundational requirements, configuration, operations, and evidence all matter.

## Where Pesaba May Fit

- **A100 and G200** are documented one-way Ethernet products at 100 Mbps and 1 Gbps respectively, with selected services varying by model.
- **EMX-4** is documented as a passive Gigabit Ethernet tap for copying traffic to monitoring tools. It is not an encryptor, firewall, or segmentation switch.
- **EMX-6** is documented as an FPGA-based AES-256 network encryptor with traffic filtering. Its exact mode, throughput, authentication, key management, and interoperability require release-specific verification.

These components can support a segmentation design, but the architecture must also define DMZs, identity, maintenance access, time sources, logging, update import, removable media, failover, and incident isolation.

## Frequently Asked Questions

**Q: Is a data diode always better than a firewall?**
A: No. A diode is appropriate when a particular flow can be one-way. A firewall is needed where controlled bidirectional communication remains necessary. Selection follows the data-flow and safety requirements, not a universal product ranking.

**Q: How should firmware enter OT?**
A: Define a separate controlled process with authorised source, signature and provenance checks, malware inspection, staging, approval, transfer media or guarded path, rollback, and audit. EMX-4 and EMX-5 should not be used as named encrypted channels; their current records describe monitoring and analysis functions.

**Q: Can alarms be exported in real time?**
A: Potentially, but current evidence does not establish sub-10-microsecond latency or OPC-UA alarm bridging. Measure the complete source, adapter, diode, proxy, network, SIEM, queue, and outage path against the required alarm deadline.

**Q: What happens if an export path fails?**
A: That depends on topology and implementation. Ensure control does not depend on the reporting path, then test loss of power, link, proxy, storage, and destination. Define alarms, buffering, recovery, duplicate handling, and the effect on OT before launch.
