---
title: 'Symmetric Encryption'
title_fa: 'رمزنگاری متقارن'
slug: 'symmetric-encryption'
short_definition: 'Encryption where the same key is used for both encryption and decryption.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
  - 'upcryptor'
related_articles:
  - 'how-do-symmetric-and-asymmetric-encryption-algorithms-work'
---

## Definition

Symmetric encryption is a cryptographic method in which the same key is used for both encryption and decryption. AES is the dominant symmetric cipher; symmetric encryption is used for bulk data encryption because it is orders of magnitude faster than asymmetric encryption.

## How It Works

A sender encrypts plaintext using the shared key and a cipher algorithm (AES-GCM), producing ciphertext. The receiver decrypts ciphertext using the same key. The security of symmetric encryption depends entirely on the secrecy of the shared key — if the key is known to an attacker, all encrypted data is readable.

## Why It Matters for Network Security

Symmetric encryption is used for all high-throughput data-in-transit protection. The challenge is key distribution: how do two parties securely share a key over an untrusted network? The answer is typically an asymmetric key exchange (ECDH, RSA) to establish the shared symmetric key, followed by symmetric encryption for the bulk data.

## Related Pesaba Products

- **EMX-6** — Implements AES-256-GCM (symmetric) for bulk data encryption after ECDH key agreement.
