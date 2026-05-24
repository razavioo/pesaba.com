---
title: 'AES-GCM'
title_fa: 'AES-GCM'
slug: 'aes-gcm'
short_definition: 'AES in Galois/Counter Mode — provides both encryption and authentication in a single pass.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
related_articles:
  - 'what-is-aes-algorithm'
---

## Definition

AES-GCM (Galois/Counter Mode) is an authenticated encryption with associated data (AEAD) mode of operation for AES. It combines AES in counter mode for confidentiality with the GHASH function for integrity and authenticity, producing both ciphertext and a 128-bit authentication tag in a single pass.

## How It Works

AES-GCM runs two parallel operations: a CTR-mode AES stream cipher for encryption, and a GHASH polynomial evaluation over the ciphertext and any associated unencrypted header data. The GHASH output is encrypted with a one-time pad derived from AES under the nonce to produce the authentication tag. A receiver verifies the tag before decrypting — any modification to the ciphertext or headers causes tag verification to fail and the plaintext is rejected.

## Why It Matters for Network Security

AES-GCM is the dominant AEAD mode in TLS 1.3, MACsec, and IPsec, because it provides both confidentiality and integrity in a single efficient operation, is parallelisable (unlike CBC-HMAC constructions), and is natively supported by AES-NI hardware instructions and FPGA implementations.

## Related Pesaba Products

- **EMX-6** — Implements AES-256-GCM in FPGA fabric; the GCM authentication tag is verified on every received packet before forwarding.
