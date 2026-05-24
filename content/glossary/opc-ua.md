---
title: 'OPC UA'
title_fa: 'OPC UA'
slug: 'opc-ua'
short_definition: 'OPC Unified Architecture — a machine-to-machine communication protocol for industrial automation.'
category: 'ot-ics'
locale: en
---

## Definition

OPC UA (Unified Architecture) is a platform-independent machine-to-machine communication protocol for industrial automation, standardised by the OPC Foundation (IEC 62541). It provides a secure, reliable transport for industrial data with a built-in information model, session management, and end-to-end security.

## How It Works

OPC UA uses a client-server or publish-subscribe model. Servers expose an address space of nodes representing sensors, actuators, alarms, and historical data. Clients browse the address space, subscribe to data changes, and read or write values. OPC UA security uses X.509 certificates for authentication and AES encryption for confidentiality, negotiated at session establishment.

## Why It Matters for Network Security

OPC UA is increasingly the standard for SCADA historian integration and IT/OT data exchange. Its built-in security model is a significant improvement over Modbus and DNP3, but it requires bidirectional connections — a challenge in environments where hardware isolation is required. Pesaba data diodes implement an OPC UA bridge that replicates subscribed data in one direction, removing the bidirectional requirement.

## Related Pesaba Products

- **Data Diode G200 / G300** — Include an OPC UA bridging capability for one-way publication of historian data across the diode boundary.
