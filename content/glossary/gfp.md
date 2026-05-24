---
title: 'GFP'
title_fa: 'GFP'
slug: 'gfp'
short_definition: 'Generic Framing Procedure (ITU G.7041) — used to adapt client signals into OTN/SDH frames.'
category: 'telecom'
locale: en
related_products:
  - 'corn-stm1'
  - 'corn-e1'
---

## Definition

GFP (Generic Framing Procedure, ITU-T G.7041) is a data-link protocol for encapsulating variable-length packet data (Ethernet, IP, ESCON) into a fixed-rate synchronous transport stream (SDH, OTN). It replaces older PoS (Packet over SONET/SDH) methods with a more efficient, standard encapsulation.

## How It Works

GFP frames consist of a 4-byte Core Header (payload length + HEC) and a Payload Header with PDU type, extension headers, and an optional FCS. Frame-Mapped GFP (GFP-F) carries one complete packet per GFP frame; Transparent GFP (GFP-T) carries fixed-sized blocks for low-latency, constant-bit-rate applications. A GFP receiver identifies frame boundaries using the Core HEC.

## Why It Matters for Network Security

GFP is the standard encapsulation method for carrying Ethernet over SDH/OTN circuits. Understanding GFP is necessary for configuring and troubleshooting Ethernet-over-SDH equipment such as Pesaba's CORN STM1.

## Related Pesaba Products

- **CORN STM1** — Uses GFP-F encapsulation to carry Ethernet frames over STM-1 circuits.
