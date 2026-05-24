---
title: 'Banking & Finance'
title_fa: 'بانک و مالی'
slug: 'banking-finance'
description: 'Protect financial network infrastructure and data-center interconnects with hardware-grade encryption.'
locale: en
products:
  - 'emx-6'
  - 'upcryptor'
  - 'emx-5'
faqs:
  - q: 'Can a data diode support SWIFT message archiving?'
    a: 'Yes. SWIFT messages can be replicated in one direction to an archive system using a Pesaba diode without exposing the SWIFT interface to inbound traffic from the archive environment.'
  - q: 'How does hardware filtering on EMX-4 differ from a software firewall?'
    a: 'EMX-4 filtering rules are implemented in FPGA logic and applied at wire speed without a CPU on the data path. There is no OS to compromise and no rule engine to bypass — the filter is deterministic and verifiable.'
---

## The Challenge

Banking and financial institutions operate both IT and OT environments — trading systems, ATM networks, core banking infrastructure, and physical security systems all converge in a single institution. Data flows between these systems are legally mandated for reporting, audit, and compliance purposes, but each crossing is a potential attack vector. Iranian banks and financial institutions face additional requirements around sovereign infrastructure and data localisation.

## Why It Matters

- **Regulatory reporting under PCI-DSS and local mandates:** Card transaction data, account records, and audit logs must flow to compliance systems without exposing the core banking network to inbound traffic.
- **ATM and physical network convergence:** ATM networks are increasingly IP-connected. A compromise of the ATM network that reaches core banking systems represents an existential threat.
- **Insider threat on privileged networks:** Financial networks are high-value targets for insider threats. Hardware isolation between operational segments means a compromised endpoint cannot pivot to more sensitive zones.

## How Pesaba Solves It

Pesaba data diodes enforce one-way data flow for compliance reporting, audit log export, and SWIFT message archiving — allowing these data flows to leave the secure environment without creating an inbound attack path. EMX-4/EMX-5 switching and filtering appliances provide hardware-level network segmentation between ATM, teller, and core banking segments.
