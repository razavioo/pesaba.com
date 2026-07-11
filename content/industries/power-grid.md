---
title: 'Power Grid'
title_fa: 'شبکه برق'
slug: 'power-grid'
description: 'Plan controlled SCADA data export and protected communications for power-generation and transmission networks.'
locale: en
products:
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'emx-6'
faqs:
  - q: 'Can a Pesaba data diode publish OPC-UA data to another network?'
    a: 'OPC-UA proxy support is not established by the current public product records. A one-way OPC-UA design normally requires independent source- and destination-side services with defined subscription, namespace, timestamp, quality, buffering, and recovery behaviour. Confirm a tested adapter for the exact product and software versions before specifying it.'
  - q: 'How should remote maintenance work when telemetry uses a one-way path?'
    a: 'Use a separately assessed maintenance path with explicit authorisation, strong authentication, session control and recording, time limits, logging, and a tested disable procedure. A data diode used for outbound telemetry should not be assumed to provide return-path maintenance access.'
  - q: 'What happens when traffic exceeds the selected diode capacity?'
    a: 'Interface rates are published per model, but overload, queueing, packet-loss, back-pressure, alarm, and recovery behaviour are not established by those rates. Size from measured peak traffic and test overload and downstream outages with the exact proxy and firmware configuration.'
---

## The Challenge

Power-generation and transmission operators use SCADA, protection, metering, historian, and energy-management systems with different timing and availability requirements. Monitoring and reporting data may need to leave a control zone, while commands and maintenance access need separate risk treatment. No single boundary device replaces system-level safety, protection, redundancy, and incident-recovery design.

## Why It Matters

- **Physical consequences:** Compromise or loss of control functions can contribute to outages, equipment stress, or unsafe operating conditions.
- **Documented zones and conduits:** IEC 62443, NERC CIP where applicable, and relevant Iranian requirements can inform the control baseline. Product deployment does not itself establish compliance or a particular security level.
- **Capacity and failure behaviour:** Metering, alarm, historian, and event streams can have different burst patterns; overload and outage behaviour must be known before connecting a control network.

## Where Pesaba May Fit

Pesaba's A100 and G200 records describe one-way Ethernet transfer at different interface rates, and EMX-6 is described as an FPGA-based AES-256 encryptor. These can be evaluated for selected outbound data flows and protected links. OPC-UA or other protocol adaptation, deterministic latency, high availability, environmental qualification, maintenance access, and regulatory acceptance require model-specific evidence and end-to-end testing.
