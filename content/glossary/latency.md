---
title: 'Latency'
title_fa: 'تأخیر شبکه'
slug: 'latency'
short_definition: 'The delay between a data packet being sent and received across a network.'
category: 'networking'
locale: en
---

## Definition

Latency in a network context is the time elapsed from when a packet is transmitted by the sender to when it is received by the receiver. It is measured in milliseconds (ms) or microseconds (μs) and is a critical parameter for real-time applications including VoIP, video conferencing, industrial control, and financial trading.

## How It Works

Network latency consists of several components: propagation delay (speed-of-light across the physical link), serialisation delay (time to transmit the packet bits at the line rate), processing delay (time spent in router/switch queues and forwarding engines), and, for wireless links, access delay (waiting for a channel slot).

## Why It Matters for Network Security

For OT networks, latency affects the responsiveness of SCADA control loops. For cellular networks, round-trip latency (RTT) determines user experience for real-time applications. Hardware-based network devices (FPGA switches, data diodes) have deterministic, microsecond-scale latency; software-based devices introduce variable, millisecond-scale latency.

## Related Pesaba Products

- **Data Diodes (all models)** — Fixed latency under 1 ms added by the diode bridge; no variable queuing delay on the one-way optical path.
- **EMX-4 / EMX-5** — FPGA switching with sub-microsecond forwarding latency.
