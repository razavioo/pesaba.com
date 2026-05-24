---
title: 'Water Utilities'
title_fa: 'آب و فاضلاب'
slug: 'water-utilities'
description: 'Monitor water quality in real time and isolate treatment-plant control systems.'
locale: en
products:
  - 'orazan'
  - 'data-diode-a100'
  - 'data-diode-g200'
faqs:
  - q: 'What biological parameters does Orazan measure?'
    a: 'Orazan uses live aquatic organisms as toxicity indicators, measuring behavioural changes that correlate with a broad spectrum of chemical contaminants — including those that conventional chemical sensors may not detect in isolation.'
  - q: 'Can Orazan integrate with existing SCADA historians?'
    a: 'Yes. Orazan outputs standard 4–20 mA analogue signals and RS-485 Modbus, compatible with all major SCADA platforms and historian systems.'
  - q: 'How quickly does Orazan alarm on a contamination event?'
    a: 'Biological response time is contaminant-dependent. For acute toxicity events, alarm latency is typically under 15 minutes from the onset of biological response.'
---

## The Challenge

Water treatment and distribution networks run continuous chemical dosing, pumping, and SCADA monitoring processes where a cyberattack or sensor-data manipulation can affect public health at scale. At the same time, water utilities need to monitor water quality in real time and report to regulatory bodies — creating data flows that cross the boundary between the isolated control network and the corporate or public-internet-connected reporting infrastructure.

## Why It Matters

- **Public health risk:** Incorrect chlorine dosing, contamination events, or pump failures resulting from control-system interference can affect millions of people within hours of an incident.
- **Remote infrastructure:** Pumping stations, reservoirs, and distribution nodes are often unstaffed. Remote monitoring is operational necessity; uncontrolled remote access is existential risk.
- **Continuous regulatory reporting:** Environmental agencies require real-time or near-real-time water quality data that must leave the OT environment — but the path for that data must not become an attack entry point.

## How Pesaba Solves It

Pesaba's Orazan biomonitoring system provides continuous toxicity and quality monitoring using live biological sensors, with hardware isolation between the sensor network and the data aggregation layer. Alarm data and quality metrics flow over Pesaba data diodes to the reporting infrastructure without opening a return channel into the treatment control network.
