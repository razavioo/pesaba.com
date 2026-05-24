---
title: 'IPS'
title_fa: 'IPS'
slug: 'ips'
short_definition: 'Intrusion Prevention System — monitors network traffic and can automatically block detected threats.'
category: 'networking'
locale: en
---

## Definition

An IPS (Intrusion Prevention System) is an active security control that not only detects malicious network traffic (like an IDS) but also blocks or alters it in real time. IPS is typically deployed inline on the network path.

## How It Works

An inline IPS receives traffic on one interface, inspects it against signatures and behavioural rules, and either forwards it to the output interface or drops/modifies it. Because IPS introduces latency and can block legitimate traffic on false positives, careful tuning is required. In OT environments, blocking mode must be used carefully to avoid disrupting time-sensitive control traffic.

## Why It Matters for Network Security

IPS provides active defence against known attacks crossing the inspection point. Combined with data diodes (which prevent inbound attacks entirely) and IDS (which detects anomalies), IPS forms one layer of a defence-in-depth OT security architecture.

## Related Pesaba Products

- **EMX-5** — FPGA-native filtering platform that can be configured with blocking rules to implement IPS-like behaviour at wire speed without software overhead.
