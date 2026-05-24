---
title: 'RTU'
title_fa: 'RTU'
slug: 'rtu'
short_definition: 'Remote Terminal Unit — a microprocessor-controlled field device that interfaces objects in the physical world to a SCADA system.'
category: 'ot-ics'
locale: en
---

## Definition

An RTU (Remote Terminal Unit) is a field device that interfaces with sensors and actuators in a SCADA system, collecting data and transmitting it to the SCADA master, and executing control commands from the master. RTUs are deployed at remote sites — substations, pumping stations, pipeline valves — where they may operate autonomously during communication outages.

## How It Works

RTUs communicate with field instruments using analogue signals (4–20 mA, 0–10 V) or digital protocols (Modbus, DNP3, IEC 61850). They aggregate readings from multiple instruments and transmit them to the SCADA master on a polling or report-by-exception basis. Modern RTUs include IP connectivity for TCP/IP-based SCADA protocols alongside legacy serial interfaces.

## Why It Matters for Network Security

RTUs are deployed in physically accessible remote locations — substations, wellheads, distribution nodes — that are difficult to physically secure. IP-connected RTUs at remote sites are potential entry points into the OT network if not properly isolated.

## Related Pesaba Products

- **Data Diode A10** — Suitable for small remote sites with a single RTU feeding into a historian or SCADA master.
