---
title: 'HSM'
title_fa: 'HSM'
slug: 'hsm'
short_definition: 'Hardware Security Module — a physical device that manages and protects cryptographic keys.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
---

## Definition

An HSM (Hardware Security Module) is a physical device that manages, stores, and protects cryptographic keys and performs cryptographic operations in a tamper-resistant hardware environment. HSMs are used for key management, certificate signing, and high-security cryptographic processing.

## How It Works

HSMs store keys in secure non-volatile memory within a tamper-evident (and, at higher security levels, tamper-responsive) enclosure. Cryptographic operations are performed inside the module — keys never leave the HSM boundary in plaintext. HSMs expose a PKCS#11 or proprietary API for applications to request cryptographic services.

## Why It Matters for Network Security

Key security is the foundation of encryption security: if a key is compromised, all data protected with that key is compromised. HSMs provide the strongest available protection for high-value keys, including certificate authority keys, device identity keys, and session key material.

## Applying This to a Product

An encryptor should not be called an HSM or HSM-equivalent without evidence for the key boundary, interfaces, lifecycle, physical controls, and validation scope. Review the selected product's current key-management documentation instead of inferring those properties from FPGA use.
