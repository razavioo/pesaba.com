---
title: 'Throughput'
title_fa: 'پهنای باند عملیاتی'
slug: 'throughput'
short_definition: 'The amount of data successfully transferred per unit time across a network link.'
category: 'networking'
locale: en
---

## Definition

Throughput is the actual rate at which useful data is successfully transferred across a network link or through a network device, measured in bits per second (bps). Throughput is typically less than the nominal link speed due to protocol overhead, retransmissions, and queuing.

## How It Works

Maximum throughput is bounded by the Nyquist–Shannon theorem and the modulation scheme: a 1 Gbps Ethernet link can carry at most ~940 Mbps of payload after subtracting Ethernet, IP, and TCP headers. In wireless networks, throughput is further limited by the available spectrum, SINR, MIMO spatial streams, and the modulation and coding scheme negotiated between UE and base station.

## Why It Matters for Network Security

Throughput is the primary metric for evaluating whether a network device meets performance requirements. Security appliances that perform deep-packet inspection, encryption, or protocol bridging can become bottlenecks if their throughput is insufficient. FPGA-based devices achieve throughput that matches the line rate of the attached interfaces without a processing bottleneck.

## Related Pesaba Products

- **Data Diode G200 / G300** — 1 Gbps sustained throughput, matching the line rate of 1 Gbps Ethernet interfaces.
- **EMX-6** — 10 Gbps AES-256-GCM encryption at wire rate.
