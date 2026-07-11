---
title: 'Defense'
title_fa: 'دفاع'
slug: 'defense'
description: 'Network isolation and encryption options for organisations evaluating controlled data transfer in defence environments.'
locale: en
products:
  - 'data-diode-k200'
  - 'data-diode-g300'
  - 'emx-6'
faqs:
  - q: 'Can the devices be independently evaluated for assurance?'
    a: 'Evaluation scope and available evidence are product- and project-specific. Request current design documentation, test evidence, third-party reports, and certificate identifiers for the exact model and version. Do not infer Common Criteria or another certification unless a current certificate names that product and version.'
  - q: 'What is the physical security posture of the devices?'
    a: 'Physical-security features vary by model and configuration. Define requirements for tamper evidence or response, bitstream and boot protection, key zeroisation, enclosure inspection, and chain of custody, then verify each requirement against the supplied product documentation and test evidence.'
  - q: 'How are key management and rotation handled for EMX-6 in a defense environment?'
    a: 'Confirm the required key-injection, storage, rotation, recovery, audit, and role-separation workflow for the exact EMX-6 hardware and firmware release. Request the current key-management documentation and acceptance-test procedure before deployment.'
---

## The Challenge

Defence organisations may need to move selected data between networks with different trust or classification levels while constraining return traffic. The required assurance depends on the information classification, threat model, approved architecture, operational process, and applicable procurement rules.

## Why It Matters

- **Risk reduction, not immunity:** Software gateways can be misconfigured or affected by vulnerabilities. A hardware-enforced one-way path can reduce reverse-path risk, but overall assurance still depends on implementation, interfaces, configuration, connected services, and verification.
- **Evidence must match the deployment:** Security documentation, test results, approvals, and certificates should identify the exact model, hardware revision, firmware release, configuration, and evaluated boundary.
- **Operational continuity:** A reduced software stack on the data path may reduce some patching and exploit exposure. Availability and recovery objectives still require architecture review, environmental qualification, redundancy planning, and acceptance testing.

## How Pesaba Solves It

Pesaba's data-diode portfolio is described as using hardware separation and, on selected models, optical links and FPGA processing to constrain data flow to one direction. These controls can reduce reverse-path and general-purpose operating-system exposure, but assurance depends on the selected model, proxy services, management interfaces, configuration, and verification. EMX-6 is documented as an FPGA-based AES-256 network encryptor; encryption mode, throughput, key management, and any cryptographic validation must be confirmed for the exact hardware and firmware release. Manufacturing scope and component origin are project-specific and should be recorded in procurement evidence.
