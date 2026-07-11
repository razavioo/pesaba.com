---
title: 'Government'
title_fa: 'دولت'
slug: 'government'
description: 'Network-isolation, encryption, and monitoring options for evidence-led government procurement.'
locale: en
products:
  - 'data-diode-k200'
  - 'emx-6'
  - 'emx-4'
faqs:
  - q: 'Can Pesaba products operate without internet connectivity?'
    a: 'Offline operation must be confirmed per model and firmware release. Ask for an interface inventory and demonstrate startup, normal operation, administration, licensing, time synchronisation, logging, and firmware update in the intended disconnected environment; do not infer this property across the entire portfolio.'
  - q: 'What supply-chain evidence should procurement request?'
    a: 'Request the bill of materials scope, component-origin records, design and assembly locations, subcontractor controls, firmware provenance, secure-delivery process, and change history for the exact unit. A local brand or assembly statement is not a substitute for model-specific evidence.'
  - q: 'Are Pesaba devices certified under Common Criteria?'
    a: 'No current certificate identifier is published in this repository. Treat Common Criteria, EAL, AFTA, or other approval claims as unverified unless a current issuer record names the exact product, hardware revision, firmware release, evaluated configuration, and certificate scope.'
---

## The Challenge

Government organisations may connect citizen services, administrative systems, inter-agency platforms, operational networks, and higher-trust environments. The required controls depend on information classification, threat model, service availability, procurement rules, and the approved architecture. Security and supply-chain claims therefore need evidence that matches the exact delivered configuration.

## Why It Matters

- **Boundary control:** Selected outbound data may need to cross a trust boundary while return traffic remains constrained.
- **Sovereignty and lifecycle:** Component origin, firmware ownership, update delivery, support continuity, and external dependencies should be recorded rather than assumed.
- **Operational resilience:** Reduced software on a data path can reduce some exposure, but availability still depends on redundancy, monitoring, maintenance, recovery, and tested operating procedures.

## Where Pesaba May Fit

Pesaba's public product records describe one-way data-diode models, an FPGA-based AES-256 encryptor, and the EMX-4 passive Ethernet tap. These products can be evaluated respectively for controlled outbound transfer, protected point-to-point links, and non-intrusive traffic visibility. Assurance, offline operation, cryptographic validation, supply-chain scope, environmental qualification, and certification must be verified for the selected model and release before procurement.
