---
title: 'FIPS 140'
title_fa: 'FIPS 140'
slug: 'fips-140'
short_definition: 'Federal Information Processing Standard 140 — US government standard for cryptographic module security.'
category: 'standards'
locale: en
related_products:
  - 'emx-6'
---

## Definition

FIPS 140-2/140-3 (Federal Information Processing Standard) is a US government standard for the security requirements of cryptographic modules. It defines four security levels (Level 1–4), with higher levels requiring physical tamper resistance and stronger key management.

## How It Works

A FIPS 140 validation involves testing by an accredited Cryptographic Module Testing Laboratory (CMTL) against the FIPS 140 standard. Validated modules are listed on the NIST Cryptographic Module Validation Program (CMVP) database. For government procurement in the US and many allied countries, FIPS 140 validation is mandatory for cryptographic equipment.

## Why It Matters for Network Security

FIPS 140 validation provides documented assurance that a cryptographic implementation is correct, secure, and has been independently verified. It is a common procurement requirement for encryption products used in government and regulated financial environments.

## Applying This to a Product

AES-256 use is not equivalent to FIPS 140 validation. A Pesaba product must not be described as FIPS-validated unless a current CMVP certificate identifies the exact module, version, boundary, and status.
