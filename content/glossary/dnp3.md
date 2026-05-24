---
title: 'DNP3'
title_fa: 'DNP3'
slug: 'dnp3'
short_definition: 'Distributed Network Protocol 3 — used in utility SCADA systems for communication between substations.'
category: 'ot-ics'
locale: en
---

## Definition

DNP3 (Distributed Network Protocol 3) is a communication protocol used in SCADA systems, particularly in the electric utility and water treatment sectors. It was designed for reliable, efficient communication between control centres and field devices over unreliable serial or IP links.

## How It Works

DNP3 uses a master/outstation model. The SCADA master polls outstations (RTUs, PLCs, IEDs) for data or receives unsolicited reports. DNP3 supports data integrity (CRC checksums), time synchronisation, and a range of data types including binary inputs/outputs, analogue inputs/outputs, and counters. DNP3 Secure Authentication (SA) extensions add HMAC-based message authentication.

## Why It Matters for Network Security

DNP3 was designed for reliability, not security. Without Secure Authentication, DNP3 messages can be spoofed or replayed by an attacker with access to the network. Even with SA, the protocol requires IP-level network isolation to prevent direct attacks on the master or outstations.

## Related Pesaba Products

- **Data Diode G200** — Includes a DNP3 protocol bridge, forwarding DNP3 data streams in one direction from the RTU network to the SCADA master historian without exposing the RTU network to inbound traffic.
