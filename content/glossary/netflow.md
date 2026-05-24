---
title: 'NetFlow'
title_fa: 'NetFlow'
slug: 'netflow'
short_definition: 'A Cisco network protocol for collecting IP traffic information and monitoring network flow.'
category: 'networking'
locale: en
related_products:
  - 'saturn'
---

## Definition

NetFlow (Cisco) and IPFIX (IETF RFC 7011) are network traffic accounting protocols that export flow-level statistics — source/destination IP, ports, protocol, packet count, byte count, timestamps — from routers and switches to a collection server. Flow data is used for network performance monitoring, capacity planning, and security analytics.

## How It Works

A NetFlow-capable device maintains a flow cache, creating an entry for each unique 5-tuple (source IP, destination IP, source port, destination port, protocol). When a flow terminates or the cache entry expires, the device exports a summary record to a NetFlow collector. Flow records do not contain packet payload — only metadata about the communication.

## Why It Matters for Network Security

NetFlow data provides network-wide visibility into traffic patterns without the storage requirements of full-packet capture. Security analytics platforms use NetFlow for anomaly detection, threat hunting, and network forensics — identifying unusual communication patterns that may indicate compromise.

## Related Pesaba Products

- **Saturn** — Exports IPFIX flow records alongside full-packet capture, providing both metadata and payload for security analysis.
