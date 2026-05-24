---
title: 'IDS'
title_fa: 'IDS'
slug: 'ids'
short_definition: 'Intrusion Detection System — monitors network traffic for suspicious activity and issues alerts.'
category: 'networking'
locale: en
---

## Definition

An IDS (Intrusion Detection System) is a device or software that monitors network traffic or host activity for signs of malicious behaviour and generates alerts when suspicious patterns are detected. A passive IDS monitors only; an IPS (Intrusion Prevention System) can also block detected traffic.

## How It Works

Network IDS systems (NIDS) capture traffic from a SPAN port or network tap and compare it against signatures of known attacks (signature-based detection) or statistical models of normal behaviour (anomaly-based detection). Host-based IDS (HIDS) monitors system logs, file integrity, and process activity on individual endpoints.

## Why It Matters for Network Security

IDS provides visibility into attacks that succeed in reaching the monitored network segment. In OT environments, IDS is typically deployed on the IT/OT boundary DMZ and on the OT network itself to detect anomalous traffic that may indicate compromise or misconfiguration.

## Related Pesaba Products

- **Saturn** — Full-packet capture enables passive IDS analysis by feeding packet data to external IDS platforms for signature and anomaly-based analysis.
