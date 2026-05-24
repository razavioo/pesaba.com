---
title: 'Defense'
title_fa: 'دفاع'
slug: 'defense'
description: 'Hardened, OS-less network security for defense infrastructure with the highest assurance levels.'
locale: en
products:
  - 'data-diode-k200'
  - 'data-diode-g300'
  - 'emx-6'
faqs:
  - q: 'Can the devices be independently evaluated for assurance?'
    a: 'Yes. Pesaba provides full hardware documentation, FPGA netlist review capability, and test fixtures for independent evaluation. We are pursuing EAL2+ Common Criteria evaluation.'
  - q: 'What is the physical security posture of the devices?'
    a: 'Devices include tamper-evident seals and the FPGA bitstream is encrypted and signed. Physical inspection procedures are documented in the security target.'
  - q: 'How are key management and rotation handled for EMX-6 in a defense environment?'
    a: 'EMX-6 supports external key injection via a local management port isolated from the data path. Key rotation can be scheduled or manually triggered; the device never transmits keying material over the data interface.'
---

## The Challenge

Defense networks require the highest levels of assurance for cross-domain data transfer. Intelligence data, command-and-control communications, and sensor feeds must be shared across classification boundaries — between classified tactical networks, unclassified logistics systems, and command infrastructure — without any possibility of data flowing in the unintended direction. The margin for error is zero.

## Why It Matters

- **No software-based assurance is sufficient:** Firewalls and security gateways are software — they can be misconfigured, exploited, or patched incorrectly. In defense environments, only hardware-enforced isolation provides the assurance required.
- **Cross-domain solution requirements:** Defense cross-domain solutions must be evaluated, documented, and operationally verified. Hardware data diodes provide a physically demonstrable one-way property that can be independently verified.
- **Operational continuity:** Under adversarial network conditions, defense systems must continue to operate. Hardware isolation devices with no software stack have no software to exploit and no patch cycle to manage.

## How Pesaba Solves It

Pesaba data diodes use FPGA-native optical hardware to implement a physically enforced one-way path. There is no CPU, no OS, no network stack, and no software on the data path — making the isolation property immune to software-based attack. Devices are manufactured in Iran, eliminating foreign supply-chain exposure. For encrypted high-assurance links, EMX-6 provides AES-256-GCM without a general-purpose processor on the encryption path.
