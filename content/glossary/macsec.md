---
title: 'MACsec'
title_fa: 'MACsec'
slug: 'macsec'
short_definition: 'IEEE 802.1AE — link-layer encryption standard that secures Ethernet frames hop by hop.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
---

## Definition

MACsec (IEEE 802.1AE) is a Layer-2 encryption standard that provides hop-by-hop confidentiality and integrity protection for Ethernet frames between directly connected network devices. It operates at the MAC layer, below IP, and is transparent to routers and Layer-3 equipment.

## How It Works

MACsec uses AES-GCM (128 or 256-bit) to encrypt the payload of each Ethernet frame between two MACsec-capable endpoints (Security Associations). A MACsec Key Agreement (MKA) protocol, based on IEEE 802.1X, handles key negotiation and rotation. Each frame receives a Secure Channel Identifier, a Packet Number for anti-replay, and a 16-byte ICV (Integrity Check Value). Frames that fail ICV verification are dropped before delivery to higher layers.

## Why It Matters for Network Security

MACsec protects against physical wiretapping of Ethernet segments — including data-centre cross-connects, campus backbones, and metro-Ethernet circuits — at wire speed without modifying IP addressing or routing. It is the preferred link-layer protection for environments where IPsec overhead is unacceptable or where encryption must be transparent to network management.

## Related Pesaba Products

- **EMX-6** — Supports MACsec-equivalent FPGA-native AES-256-GCM link encryption as a bump-in-the-wire between standard Ethernet equipment.
