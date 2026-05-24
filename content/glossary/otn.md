---
title: 'OTN'
title_fa: 'OTN'
slug: 'otn'
short_definition: 'Optical Transport Network — a set of standards defining how to transport client signals over optical networks.'
category: 'telecom'
locale: en
related_products:
  - 'corn-stm1'
---

## Definition

OTN (Optical Transport Network) is an ITU-T G.709 standard for digital wrapping of client signals (Ethernet, SDH, SONET) into a forward-error-corrected optical transport frame. OTN provides stronger FEC, richer OAM than SDH, and is the dominant transport technology for 10 Gbps and above links.

## How It Works

An OTN frame consists of an Optical Channel Data Unit (ODU) carrying the client signal, wrapped in an Optical Channel Transport Unit (OTU) that adds FEC (Reed-Solomon or LDPC). OTN rates: OTU1 (2.67 Gbps), OTU2 (10.71 Gbps), OTU4 (111.81 Gbps). OTN adds robust operations, administration, and maintenance (OAM) channels for tandem connection monitoring and performance management.

## Why It Matters for Network Security

OTN's stronger FEC and richer OAM make it the preferred transport for long-haul and submarine links. OTN carries the aggregated traffic of multiple SDH and Ethernet customers, making its security and reliability critical to the entire network hierarchy above it.

## Related Pesaba Products

- **SDX** — Pesaba's SDH/OTN switching and cross-connect platform for managing existing legacy transport infrastructure.
