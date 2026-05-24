---
title: 'Packet Capture'
title_fa: 'ضبط بسته'
slug: 'packet-capture'
short_definition: 'The process of intercepting and recording data packets traversing a network, used for analysis and troubleshooting.'
category: 'networking'
locale: en
related_products:
  - 'saturn'
---

## Definition

Packet capture (PCAP) is the process of recording all network packets traversing an interface or tap point for subsequent analysis. Packet capture is used for protocol analysis, security incident investigation, performance troubleshooting, and compliance recording.

## How It Works

A packet capture device (or software agent) receives copies of all frames on a network segment via a SPAN port, optical tap, or dedicated capture interface, and writes them to a file or stream in PCAP format. High-speed capture at 10 Gbps or faster requires specialised hardware with dedicated FPGA or SmartNIC assist to avoid packet drops.

## Why It Matters for Network Security

Full-packet capture provides the forensic record needed to reconstruct the sequence of events in a security incident. It is the primary tool for incident response investigations and is required by many compliance frameworks for post-incident analysis.

## Related Pesaba Products

- **Saturn** — Hardware packet capture appliance supporting full-packet recording at up to 10 Gbps without drops, with hardware timestamping.
