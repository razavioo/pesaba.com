---
title: 'What is AES algorithm?'
title_fa: 'الگوریتم AES چیست؟'
slug: 'what-is-aes-algorithm'
description: 'AES (Advanced Encryption Standard) algorithm was developed by Vincent Rijmen and Joan Daemen in 1998. This algorithm was first known under the name Rijndael and finally it was chosen as the official standard of security communication. This'
date: '2024-10-24'
updated: '2026-02-14'
author: 'Pesaba Engineering'
locale: en
image: '/images/blog/aes-algorithm-cover-v2.png'
---

AES (Advanced Encryption Standard) algorithm was developed by Vincent Rijmen and Joan Daemen in 1998. This algorithm was first known under the name Rijndael and finally it was chosen as the official standard of security communication. This algorithm was first used in various security systems such as Wi-Fi Protected Access (WPA) and VPN.

AES (Advanced Encryption Standard) is one of the most popular and secure symmetric encryption algorithms. This algorithm was chosen by NIST (National Institute of Standards and Technology) as the encryption standard.

**Key Characteristics and Parameters of AES:**

The AES algorithm processes input messages in 128-bit blocks and repeats the encryption process in multiple cycles (Rounds) based on the chosen key size. The key differences between the variants are summarized below:

| Algorithm Variant | Key Size | Block Size | Number of Rounds | Possible Key Combinations | Security Level & Typical Use |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AES-128** | 128 bits (16 bytes) | 128 bits (16 bytes) | 10 Rounds | ~3.4 × 10^38 | Very High (Standard commercial & consumer use) |
| **AES-192** | 192 bits (24 bytes) | 128 bits (16 bytes) | 12 Rounds | ~6.2 × 10^57 | Extremely High (Securing highly sensitive government data) |
| **AES-256** | 256 bits (32 bytes) | 128 bits (16 bytes) | 14 Rounds | ~1.1 × 10^77 | Military Grade (Quantum-resistant security level) |

**Internal Encryption Process per Round:**

Each encryption round in AES involves four key mathematical transformation steps:
1. **SubBytes**: Every byte is replaced using a fixed lookup table (S-Box) to introduce non-linearity.
2. **ShiftRows**: The rows of the state matrix are shifted periodically to increase diffusion.
3. **MixColumns**: The columns of the matrix are mathematically mixed to spread the influence of each byte.
4. **AddRoundKey**: The state matrix is XORed with a round subkey derived from the primary secret key.

* **High Performance & Efficiency**: AES is designed to execute extremely fast and with minimal CPU overhead on both dedicated hardware (like FPGA accelerators) and general software platforms.
* **Absolute Security**: Because of the vast key space (especially in AES-256), a brute-force attack to break the key would take billions of years with modern computing power.

AES (Advanced Encryption Standard) is used in various fields. Some of its practical applications are:

- Web browsers: for security of communication between browser and servers.
- Unsupervised payment systems: for financial information security.
- Covert communication systems: for confidential and secure communication.
- Content delivery systems: for digital content security.
- Government Information Systems: To maintain the security of sensitive information.The AES algorithm is known as one of the most secure cryptographic algorithms, and no major hacks that directly break this algorithm have been reported so far. However, side-channel attacks and implementation weaknesses can compromise the security of systems that use AES. For example, timing attacks and power analysis attacks can extract information from AES-encrypted systems.

A practical example of side attack related to AES is Timing Attack. In this type of attack, the attacker obtains information by observing the different times that the system takes to perform different cryptographic operations. For example, if an attacker can observe the different times the system takes to encrypt different blocks, he may have the ability to identify weaknesses in the system's configuration.

A real-life example of this attack was an attack carried out in 2019 by a group of scientists known as a timing attack. . In this attack, by observing the different times the system takes to perform different encryption operations, the attacker was able to obtain information that helped him identify the encryption key.

**Timing Attack**

In this type of attack, by measuring the times that a system takes to perform cryptographic operations, the attacker can deduce information that is sufficient to break the cryptographic system.

**Steps of a timing attack:**

Observing encryption times: The attacker repeatedly sends requests to the system and measures the response times.

Difference Analysis: By analyzing the time differences for different requests, an attacker may be able to deduce parts of the encryption key.

Creating a temporal model: The attacker uses the collected temporal data to create a model of how the system processes cryptographic operations.

Key derivation: By using the temporal model, the attacker can deduce parts of the key or the entire key.

**Countering timing attacks**

To deal with this type of attack, it is recommended to:

Time-constant implementations: Implement algorithms in such a way that their execution time is constant for all inputs.

Adding noise: Adding noise to response times can make it more difficult for an attacker to analyze the times.

More rigorous security testing: Implementations must undergo rigorous security testing to identify and fix vulnerabilities.

We will talk more about encryption algorithms in the future.
