---
title: 'AES'
title_fa: 'AES'
slug: 'aes'
short_definition: 'Advanced Encryption Standard — the symmetric block cipher used in virtually all modern data encryption.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
  - 'upcryptor'
related_articles:
  - 'what-is-aes-algorithm'
---

## Definition

AES (Advanced Encryption Standard) is a symmetric block cipher standardised by NIST in 2001 (FIPS 197). It operates on 128-bit blocks and supports key lengths of 128, 192, and 256 bits. AES is the most widely deployed encryption algorithm in the world, used in TLS, VPNs, disk encryption, and hardware security devices.

## How It Works

AES operates through a series of substitution, permutation, and mixing operations applied in rounds — 10 rounds for AES-128, 12 for AES-192, and 14 for AES-256. Each round applies four transformations to the 128-bit state block: SubBytes (non-linear substitution using an S-box), ShiftRows (byte transposition), MixColumns (linear diffusion), and AddRoundKey (XOR with a round key derived from the master key). The result is a ciphertext that is computationally indistinguishable from random data without knowledge of the key.

## Why It Matters for Network Security

AES is the algorithm of choice for data-in-transit protection across all security levels, from consumer applications to classified government communications. Its hardware-friendly design makes it possible to implement in FPGA fabric without a general-purpose processor, eliminating the software attack surface that a CPU-based implementation introduces.

## Related Pesaba Products

- **EMX-6** — FPGA-native AES-256-GCM encryptor; the encryption engine lives entirely in FPGA logic.
- **Upcryptor** — Compact in-line AES-256 encryptor for branch and site-to-site links.
