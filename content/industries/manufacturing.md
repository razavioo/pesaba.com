---
title: 'Manufacturing'
title_fa: 'صنعت و تولید'
slug: 'manufacturing'
description: 'Plan controlled OT-to-IT data transfer and passive network visibility for manufacturing environments.'
locale: en
products:
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'emx-4'
faqs:
  - q: 'Can Pesaba data diodes export OEE or PLC data?'
    a: 'Selected product records describe one-way messages, file or database transfer, Modbus, and Syslog services. OEE is an application data model rather than a transport protocol, and OPC-UA support is not established by the current public records. Document the PLC, gateway, MES, message semantics, acknowledgement, buffering, and recovery requirements, then validate the exact adapter and product release.'
  - q: 'Is EMX-4 a production-line segmentation switch?'
    a: 'No. The current product record describes EMX-4 as a passive Gigabit Ethernet tap that copies traffic to monitoring ports. It may support visibility for analysis or intrusion detection, but it should not be presented as a switch, firewall, or enforcement boundary.'
---

## The Challenge

Manufacturing connects PLCs, robotics, CNC equipment, process control, MES, quality systems, and enterprise planning. These integrations can improve production visibility, but they also introduce dependencies between systems with different safety, availability, and patching constraints. Timing requirements vary widely by control loop and should be measured for the actual process rather than generalised across manufacturing OT.

## Why It Matters

- **Production continuity:** Unauthorised traffic, failed integrations, or poorly tested changes can interrupt production and affect equipment or product quality.
- **Process and recipe protection:** PLC programs, recipes, and quality parameters can contain commercially sensitive information.
- **Controlled integration:** Each OT-to-IT exchange needs a named owner, permitted direction, protocol contract, capacity limit, failure behaviour, and recovery test.

## Where Pesaba May Fit

Pesaba's A100 and G200 records describe hardware-enforced one-way Ethernet transfer at different interface rates, with selected transfer services documented per model. EMX-4 is documented as a passive tap for copying traffic to monitoring tools. These capabilities can be evaluated as components of a broader OT architecture; compatibility with a specific PLC, OPC-UA server, MES, ERP, historian, or monitoring stack requires an integration design and acceptance test.
