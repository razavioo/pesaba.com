---
title: 'AES-256 Network Encryption'
title_fa: 'رمزنگاری شبکه AES-256'
slug: 'aes-256-network-encryption'
description: 'Encrypt data in transit with hardware-accelerated AES-256 without introducing software vulnerabilities.'
tagline: 'FPGA-native encryption — no OS, no attack surface.'
locale: en
products:
  - 'emx-6'
  - 'upcryptor'
---

## What It Is

AES-256 network encryption protects data in transit between two network segments, ensuring that traffic intercepted on a physical link is cryptographically unreadable. When the encryption engine runs inside an FPGA rather than on a general-purpose processor, it operates without an operating system, without a software stack, and without the attack surface that comes with them. Pesaba's EMX-6 and Upcryptor implement AES-256-GCM directly in FPGA fabric, providing line-rate encryption with latency measured in microseconds.

## Why It Matters

- **Elimination of tap-and-intercept risk:** Fibre and copper links in data centres, between buildings, or along long-haul transmission routes are physically accessible. Hardware-encrypted traffic is worthless to any party without the session keys — intercepted ciphertext cannot be decrypted offline even with unbounded computing resources.
- **No software vulnerability surface:** Software-based TLS termination runs on operating systems that accumulate CVEs, require patch windows, and can be exploited. An FPGA crypto engine has no OS, no userspace, and no network stack outside the encryption path — the attack surface is orders of magnitude smaller.
- **Compliance with data-in-transit mandates:** Frameworks including ISO 27001, PCI-DSS, GDPR, and Iranian national security standards require strong encryption for sensitive data crossing untrusted links. AES-256 in a certified hardware implementation satisfies the most demanding interpretations of those requirements.

## How Pesaba Solves It

Pesaba encryption appliances implement AES-256-GCM entirely within the FPGA logic fabric. Key exchange uses ECDH over elliptic curve P-384, negotiated at session establishment and never exposed to the host system. The devices present a standard Ethernet interface on each side, making them transparent to routers, switches, and applications — no driver, no agent, no configuration change on existing equipment. Because the crypto engine runs synchronously with the line clock, throughput does not degrade under encryption load.

## Recommended Products

- **EMX-6** — 10 Gbps FPGA-native AES-256-GCM encryptor for data-centre interconnects, dark-fibre links, and leased-line protection. Supports up to six simultaneous encrypted tunnels.
- **Upcryptor** — Compact in-line encryptor for branch-to-hub and site-to-site links; ideal for protecting leased-line and metro-Ethernet circuits where a small form factor is required.

## Frequently Asked Questions

**Q: Does hardware encryption introduce latency?**
A: The FPGA pipeline adds a fixed latency of under 5 microseconds per packet regardless of packet size or traffic volume. For comparison, software-based TLS can add hundreds of microseconds under load.

**Q: How are encryption keys managed?**
A: Session keys are generated via ECDH on each device at startup and rotated on a configurable schedule (default: every 24 hours). Keys never leave the FPGA fabric — the management interface has no access to keying material.

**Q: Can an attacker recover plaintext if they capture ciphertext before obtaining one device?**
A: No. AES-256-GCM with forward-secret ECDH key exchange means that each session uses a unique key that is destroyed after rotation. Captured ciphertext from previous sessions cannot be decrypted even with physical access to both devices after the fact.

**Q: Are the devices transparent to existing network equipment?**
A: Yes. Both EMX-6 and Upcryptor operate as bump-in-the-wire devices. They present a standard Ethernet interface to switches and routers on each side and do not change the IP or MAC addresses of traffic passing through them.

**Q: What happens if one device loses power during operation?**
A: Traffic is dropped rather than passed in plaintext — the devices fail closed by design. When power is restored, a new key exchange is performed automatically before forwarding resumes.
