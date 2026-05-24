---
title: 'Key Rotation'
title_fa: 'چرخش کلید رمزنگاری'
slug: 'key-rotation'
short_definition: 'The practice of periodically replacing cryptographic keys to limit exposure from a compromised key.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
---

## Definition

Key rotation is the practice of periodically replacing cryptographic keys with new ones. Regular rotation limits the amount of data encrypted under any single key and reduces the window of exposure if a key is compromised.

## How It Works

In symmetric encryption (AES), key rotation involves both parties generating a new session key and replacing the current key with minimal traffic disruption. In asymmetric systems (PKI), key rotation involves generating a new key pair, obtaining a new certificate, and updating trust stores before the old certificate expires.

## Why It Matters for Network Security

Even if a key is not known to be compromised, rotation limits the blast radius: an attacker who obtained a key from a past period can only decrypt traffic from that period, not subsequent traffic. Some standards (PCI-DSS, NIST 800-57) mandate annual or more frequent key rotation for sensitive data.

## Related Pesaba Products

- **EMX-6** — Performs automatic session key rotation on a configurable schedule (default: 24 hours); keys are rotated in-place without dropping traffic.
