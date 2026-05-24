---
title: 'Firewall'
title_fa: 'فایروال'
slug: 'firewall'
short_definition: 'A network security device that monitors and controls incoming and outgoing traffic based on defined rules.'
category: 'networking'
locale: en
related_articles:
  - 'what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer'
---

## Definition

A firewall is a network security device or software that monitors and controls incoming and outgoing network traffic based on predetermined security rules. Traditional firewalls operate at Layer 3/4 (packet filtering on IP address and port); next-generation firewalls (NGFW) add application-layer inspection and identity-based rules.

## How It Works

A packet-filtering firewall examines each packet's source IP, destination IP, protocol, and port against a ruleset, forwarding or dropping the packet accordingly. Stateful firewalls maintain a connection table and allow reply packets for established connections. NGFWs add deep-packet inspection, TLS decryption, and application identification.

## Why It Matters for Network Security

Firewalls are the most common network security control, but they have fundamental limitations for OT environments: they run software that can be misconfigured or exploited; they allow bidirectional traffic flows; and their security properties depend on the correctness of their ruleset and software. Data diodes address the limitations of firewalls for the highest-consequence OT boundaries.

## Related Pesaba Products

- **Data Diodes** — Complement firewalls by providing hardware-enforced one-way control where firewalls cannot provide sufficient assurance.
- **EMX-4 / EMX-5** — FPGA-native filtering at Layer 2/3 without a general-purpose OS.
