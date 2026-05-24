---
title: 'STM-1'
title_fa: 'STM-1'
slug: 'stm-1'
short_definition: 'Synchronous Transport Module level 1 — the base signal in SDH with 155.52 Mbit/s capacity.'
category: 'telecom'
locale: en
related_products:
  - 'corn-stm1'
---

## Definition

STM-1 (Synchronous Transport Module Level 1) is the basic SDH signal rate at 155.52 Mbps. It is the fundamental building block of SDH networks and is widely deployed as a leased-line circuit between telecom operators, utilities, and government facilities across Iran and the Middle East.

## How It Works

An STM-1 frame is 2430 bytes transmitted every 125 microseconds, carrying 270 columns × 9 rows. The Section Overhead (SOH) occupies columns 1–9 and provides OAM functions; the Administrative Unit (AU) in column 9, row 1 carries a pointer to the start of the Virtual Container (VC-4) payload. The VC-4 payload carries 149.76 Mbps of tributary traffic.

## Why It Matters for Network Security

Many critical-infrastructure sites in Iran have STM-1 circuits as their primary or backup connectivity. Pesaba's CORN STM1 product allows Ethernet traffic — including SCADA data, historian replication, and encrypted management traffic — to be carried over these existing STM-1 circuits without replacing the physical infrastructure.

## Related Pesaba Products

- **CORN STM1** — Ethernet-over-STM-1 interface; supports multiple GFP-encapsulated Ethernet streams over a single STM-1 circuit.
