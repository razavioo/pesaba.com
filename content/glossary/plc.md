---
title: 'PLC'
title_fa: 'PLC'
slug: 'plc'
short_definition: 'Programmable Logic Controller — a hardened computer used to automate industrial electromechanical processes.'
category: 'ot-ics'
locale: en
---

## Definition

A PLC (Programmable Logic Controller) is a hardened industrial computer designed for real-time control of machinery and processes. PLCs execute ladder logic or structured text programs that read sensor inputs, evaluate control logic, and write actuator outputs in a deterministic scan cycle measured in milliseconds.

## How It Works

A PLC consists of a CPU module, I/O modules (digital and analogue inputs/outputs), a power supply, and a communications interface. The CPU executes the control program in a fixed scan cycle: it reads all inputs, runs the program logic, updates all outputs, and communicates with the SCADA master — in that order, every cycle. This determinism makes PLCs suitable for safety-critical applications but also means that any network interference affecting the communications module can disrupt the control loop.

## Why It Matters for Network Security

PLCs were originally isolated from IP networks. As they have become network-connected for remote monitoring and firmware management, they have become targets for cyberattacks. A compromised PLC can issue incorrect commands to actuators, suppress alarms, or disrupt the control loop. Protecting PLC networks with hardware isolation prevents attackers from reaching PLC endpoints through IP networks.

## Related Pesaba Products

- **Data Diode A10 / G200** — Isolate PLC networks, allowing telemetry to flow out to SCADA historians without allowing inbound traffic to the PLC zone.
