---
title: 'Modbus'
title_fa: 'Modbus'
slug: 'modbus'
short_definition: 'A serial communication protocol used for connecting electronic devices in industrial networks.'
category: 'ot-ics'
locale: en
---

## Definition

Modbus is a serial communication protocol developed by Modicon in 1979, now widely used in industrial automation as a de facto standard for connecting PLCs, sensors, and SCADA systems. Modbus TCP extends the protocol over Ethernet.

## How It Works

Modbus uses a master/slave model. The master sends requests to slaves (RTUs, PLCs, sensors) to read or write registers — coils (binary outputs), discrete inputs (binary inputs), holding registers (16-bit integers), and input registers (read-only 16-bit integers). Modbus TCP wraps requests in TCP segments and uses port 502.

## Why It Matters for Network Security

Modbus has no authentication and no encryption. Any device on the network can read or write any register on any Modbus slave. This makes Modbus networks entirely dependent on network-level isolation for security.

## Related Pesaba Products

- **Data Diode G200** — Forwards Modbus TCP register reads in one direction from the OT network to the historian, without allowing the historian server to issue write commands back to field devices.
