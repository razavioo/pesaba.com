---
title: 'SCADA'
title_fa: 'SCADA'
slug: 'scada'
short_definition: 'Supervisory Control and Data Acquisition — industrial control systems used in power, oil & gas, and water utilities.'
category: 'ot-ics'
locale: en
related_articles:
  - 'what-is-a-data-diode-and-why-do-industrial-networks-need-one-way-data-transfer'
---

## Definition

SCADA (Supervisory Control and Data Acquisition) is a class of industrial control system used to monitor and control physical processes — power generation, water treatment, oil and gas pipelines, manufacturing — over large geographic areas. A SCADA system collects sensor data from remote terminal units (RTUs) and PLCs, displays it to operators, and allows operators to issue control commands.

## How It Works

A SCADA architecture typically consists of field devices (sensors, actuators), remote terminal units (RTUs) or PLCs that communicate with field devices, a SCADA master station that aggregates data and presents it to operators, and communication infrastructure (radio, serial, TCP/IP) linking the components. Modern SCADA systems are increasingly IP-connected, enabling remote monitoring but also expanding the cybersecurity attack surface.

## Why It Matters for Network Security

SCADA systems control physical processes with potentially catastrophic consequences if disrupted. A cyberattack on a SCADA system can cause industrial accidents, infrastructure outages, or environmental damage — as demonstrated by real-world incidents in power grids and water treatment facilities. Isolating SCADA systems from corporate and internet-connected networks using hardware controls is the primary mitigation.

## Related Pesaba Products

- **Data Diode G200 / G300** — Enforce one-way data export from SCADA historian to corporate networks without creating an inbound attack path.
- **EMX-6** — Protects bidirectional SCADA management links with AES-256-GCM encryption.
