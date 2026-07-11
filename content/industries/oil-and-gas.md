---
title: 'Oil & Gas'
title_fa: 'نفت و گاز'
slug: 'oil-and-gas'
description: 'Evaluate controlled telemetry export and protected links for distributed oil-and-gas OT environments.'
locale: en
products:
  - 'data-diode-g200'
  - 'data-diode-k200'
  - 'emx-6'
faqs:
  - q: 'Can a data diode handle an intermittent satellite or radio link?'
    a: 'A one-way physical path does not by itself provide durable buffering or store-and-forward recovery. Those behaviours depend on the sending and receiving proxies, storage capacity, queue policy, duplicate handling, and link-failure logic. Confirm them in the proposed solution and test an outage longer than the design threshold.'
  - q: 'Does K200 provide a physical switch for bidirectional maintenance access?'
    a: 'No such capability is documented in the current public K200 record. It describes a one-way data diode. Treat maintenance access as a separate controlled architecture unless model-specific documentation and acceptance testing explicitly establish another mode.'
  - q: 'Which historian and industrial protocols are supported?'
    a: 'Current records for selected diode models mention one-way messaging, file or database transfer, Modbus, and Syslog. They do not establish blanket support for OPC-UA, DNP3, raw TCP sessions, or every historian. Obtain the service matrix for the exact model and firmware, including direction, session handling, acknowledgements, buffering, licensing, and tested software versions.'
---

## The Challenge

Oil and gas operations can span production sites, pipelines, compressor stations, processing facilities, and control centres connected through several communications technologies. SCADA and DCS functions may affect flow, pressure, shutdown, and valve state, while operations teams still need telemetry, alarms, and maintenance information outside the control zone.

## Why It Matters

- **Process safety:** Incorrect commands or unavailable control functions can contribute to loss of containment, shutdown, or equipment damage.
- **Remote sites:** Unattended locations need dependable monitoring, but remote connectivity should not become an uncontrolled path into the control environment.
- **Requirement traceability:** Critical-infrastructure and sector rules vary by operator and project. Map each applicable AFTA, safety, cybersecurity, and records requirement to a design control and named evidence item.

## Where Pesaba May Fit

Pesaba's G200 and K200 records describe one-way Ethernet products at different interface rates, while EMX-6 is described as an FPGA-based AES-256 network encryptor. They can be evaluated for selected outbound data flows or protected links. Historian replication, satellite buffering, remote maintenance, protocol conversion, environmental suitability, redundancy, and failover are solution-level requirements and must not be inferred from the base device name.
