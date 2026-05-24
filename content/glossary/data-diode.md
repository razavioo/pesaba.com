---
title: 'Data Diode'
title_fa: 'دیتادیود'
slug: 'data-diode'
short_definition: 'A hardware security device that enforces one-way data flow by physically eliminating any return path.'
category: 'data-diodes'
locale: en
related_products:
  - 'data-diode-a10'
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'data-diode-g300'
  - 'data-diode-k200'
related_articles:
  - 'what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer'
---

## Definition

A data diode is a hardware security device that enforces strictly unidirectional data flow between two networks by physically eliminating any return path. Unlike a software firewall — which can be misconfigured, patched incorrectly, or exploited — a data diode's security property derives from optical hardware: data enters on one fibre and exits on another, and no electrical or optical path exists for signals to travel in the opposite direction.

## How It Works

Most data diodes implement the one-way barrier using a pair of optical transceivers: a transmitter on the source-network side and a receiver on the destination-network side, with no reverse transceivers installed. Data arrives at the diode's source port, passes through a software bridge that repackages it for the destination protocol, traverses the one-way optical link, and is delivered to the destination network. The destination network has no physical means of transmitting anything back through the diode — the return transmitter simply does not exist.

## Why It Matters for Network Security

Any network intrusion that relies on remote code execution, command-and-control beaconing, or data exfiltration requires at least one byte to travel from the victim to the attacker. A data diode removes that capability permanently. No software update, misconfiguration, or exploit can create a return path through hardware that physically does not have one.

## Related Pesaba Products

- **A10** — Compact 100 Mbps diode for small OT segments and branch sites.
- **A100** — 1 Gbps diode for enterprise historian replication and compliance reporting.
- **G200** — 1 Gbps diode with multi-protocol bridging for SCADA environments.
- **G300** — High-throughput 1 Gbps diode supporting simultaneous multi-zone feeds.
- **K200** — Keyed diode with controlled bidirectional capability for maintenance windows.
