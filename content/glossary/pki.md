---
title: 'PKI'
title_fa: 'زیرساخت کلید عمومی (PKI)'
slug: 'pki'
short_definition: 'Public Key Infrastructure — a framework of policies and procedures for managing digital certificates and public keys.'
category: 'encryption'
locale: en
related_articles:
  - 'how-do-symmetric-and-asymmetric-encryption-algorithms-work'
---

## Definition

PKI (Public Key Infrastructure) is a framework of policies, hardware, software, and procedures for creating, managing, distributing, and revoking digital certificates based on public-key cryptography. PKI underpins TLS/HTTPS, code signing, email encryption, and device authentication.

## How It Works

A PKI consists of a Certificate Authority (CA) that issues certificates, a Registration Authority (RA) that verifies identities before certificates are issued, a certificate store where issued certificates are published, and a revocation service (CRL or OCSP) where compromised certificates are listed. Each certificate binds a public key to an identity, signed by the CA's private key.

## Why It Matters for Network Security

PKI is the foundation for authenticated encryption in TLS, IPsec, and device onboarding. A compromised CA can issue fraudulent certificates for any identity, enabling man-in-the-middle attacks. In OT environments, device certificates authenticate PLCs and RTUs to SCADA masters, preventing impersonation of field devices.

## Related Pesaba Products

- **EMX-6** — Uses ECDH over elliptic curve P-384 for session key agreement; device identity is authenticated using pre-shared certificates or pre-configured keys.
