---
title: 'Water Utilities'
title_fa: 'آب و فاضلاب'
slug: 'water-utilities'
description: 'Evaluate continuous biological toxicity monitoring and controlled OT data export for water utilities.'
locale: en
products:
  - 'orazan'
  - 'data-diode-a100'
  - 'data-diode-g200'
faqs:
  - q: 'What does Orazan measure?'
    a: 'The current product record describes behavioural analysis of live fish, including movement speed, swimming height, path characteristics, spacing, grouping, growth, and count. It is a biological warning signal, not identification or quantification of a specific contaminant. Detection performance must be established for the target water, species, baseline, contaminants, and alarm thresholds.'
  - q: 'Can Orazan integrate with an existing SCADA or historian?'
    a: 'The product record mentions local, network, and SMS alarms and a network alarm to SCADA or an operations centre, but it does not specify 4–20 mA, RS-485, Modbus, OPC-UA, or historian compatibility. Confirm the electrical interface, protocol, data model, timestamping, alarm acknowledgement, cybersecurity controls, and supported software versions.'
  - q: 'How quickly does Orazan detect contamination?'
    a: 'No validated universal alarm time is published in the current evidence. Biological response varies with contaminant, concentration, water chemistry, temperature, species condition, baseline learning, and alarm logic. Use an agreed test panel and report sensitivity, specificity, false-alarm rate, detection time, and recovery time before operational use.'
---

## The Challenge

Water treatment and distribution rely on dosing, pumping, reservoir, laboratory, telemetry, and SCADA functions. Utilities may need earlier indication of broad toxic effects as well as chemical measurements, while operational and reporting data can cross from control environments to business or external systems. Biological monitoring complements rather than replaces validated chemical, microbiological, process, and security controls.

## Why It Matters

- **Public-health protection:** A warning system must have a defined response plan, confirmatory sampling, escalation threshold, responsible operator, and documented limitations.
- **Remote infrastructure:** Unattended locations need monitoring and maintenance procedures that account for communications failure, sensor health, animal welfare, and alarm verification.
- **Evidence quality:** Claims about contaminant coverage, detection time, false alarms, standards, and regulatory acceptance require controlled test reports for the intended operating conditions.

## Where Pesaba May Fit

Orazan is documented as a continuous fish-behaviour monitoring system with local, network, and SMS alarm outputs. Pesaba's A100 and G200 are documented as one-way Ethernet products that may be evaluated for selected outbound operational data. Any connection between Orazan, SCADA, a historian, a data diode, or a regulatory reporting platform requires a defined interface and end-to-end acceptance test; the current product record does not establish built-in hardware isolation between the Orazan sensor and aggregation layers.
