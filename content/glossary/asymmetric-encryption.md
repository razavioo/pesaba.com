---
title: 'Asymmetric Encryption'
title_fa: 'رمزنگاری نامتقارن'
slug: 'asymmetric-encryption'
short_definition: 'Encryption that uses a public key for encryption and a private key for decryption.'
category: 'encryption'
locale: en
related_products:
  - 'emx-6'
related_articles:
  - 'how-do-symmetric-and-asymmetric-encryption-algorithms-work'
---

## Definition

Asymmetric encryption (public-key cryptography) uses mathematically related key pairs: a public key (shared freely) for encryption or signature verification, and a private key (kept secret) for decryption or signing. RSA and ECC are the dominant asymmetric algorithms.

## How It Works

In RSA, security derives from the difficulty of factoring the product of two large primes. In ECC (Elliptic Curve Cryptography), security derives from the discrete logarithm problem on elliptic curves. Asymmetric encryption is used primarily for key exchange and digital signatures — establishing a shared secret over an untrusted channel — rather than for bulk data encryption, because asymmetric operations are 100–1000× slower than symmetric ones.

## Why It Matters for Network Security

Asymmetric cryptography solves the key distribution problem: two parties who have never met can establish a shared secret using only public information. This is the foundation of TLS, IPsec IKE, and SSH — the protocols that secure virtually all internet and enterprise communications.

## Related Pesaba Products

- **EMX-6** — Uses ECDH over P-384 for session key agreement, establishing the AES-256-GCM symmetric key without a pre-shared secret.
