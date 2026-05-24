---
title: 'IPsec'
title_fa: 'IPsec'
slug: 'ipsec'
short_definition: 'A suite of protocols that authenticates and encrypts IP packets at the network layer.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
  - 'upcryptor'
---

## Definition

IPsec (Internet Protocol Security) is a suite of protocols (RFC 4301–4309) that provides cryptographic security services — authentication, integrity, and confidentiality — for IP packets at Layer 3. IPsec is used to build VPNs, protect site-to-site links, and secure remote access.

## How It Works

IPsec operates in two modes: Transport mode (encrypts only the IP payload, preserving the original IP header) and Tunnel mode (encapsulates the entire original IP packet inside a new IP packet, used for VPNs). The Internet Key Exchange (IKEv2) protocol handles authentication and key negotiation. Encryption is typically AES-GCM; integrity is provided by HMAC-SHA256 or by the GCM authentication tag.

## Why It Matters for Network Security

IPsec is the standard for site-to-site VPNs and is widely deployed for protecting traffic between OT sites and operations centres. Its main limitation in OT environments is that it runs on general-purpose processors, introducing an OS-dependent software stack on the data path. FPGA-native alternatives eliminate this dependency.

## Related Pesaba Products

- **EMX-6** — Provides IPsec-equivalent AES-256-GCM link encryption implemented entirely in FPGA, without a CPU or OS on the encryption path.
