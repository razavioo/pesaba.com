---
title: 'SCADA Isolation'
title_fa: 'ایزولاسیون SCADA'
slug: 'scada-isolation'
description: 'Reduce inbound network paths to SCADA while preserving tested, one-way export of selected operational data.'
tagline: 'Isolation is an architecture property, not an absolute product promise.'
locale: en
products:
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'data-diode-k200'
---

## What It Is

SCADA isolation aims to reduce or remove inbound network paths from less-trusted environments while preserving explicitly approved outbound data flows. A hardware-enforced one-way interface can be a strong control on one conduit, but the overall SCADA boundary also includes engineering workstations, remote access, wireless links, serial gateways, removable media, management ports, power, vendors, and physical access.

## Why It Matters

- **Cyber-physical consequence:** Loss or manipulation of control and visibility can affect availability, equipment, process safety, and recovery.
- **Documented boundary controls:** IEC 62443, NIST SP 800-82, NERC CIP where applicable, and relevant Iranian requirements can guide a risk-based design. A diode does not automatically satisfy their strongest interpretation or prove compliance.
- **Measured reduction in attack paths:** One-way transfer can constrain inbound traffic on the selected conduit, but should not be described as making all SCADA compromise physically impossible.

## Documented Pesaba Options

- **A100:** 100 Mbps one-way Ethernet model with selected transfer services, including Modbus and Syslog in the current record.
- **G200:** 1 Gbps one-way Ethernet model with selected message, file, database, image, camera, Modbus, SNMP, and Syslog functions in the current record.
- **K200:** 10 Gbps one-way Ethernet model with selected transfer, Modbus, and Syslog functions in the current record.

The current records do not establish a keyed bidirectional K200 mode, generic historian replication, DNP3, OPC-UA, OSIsoft PI or Honeywell PHD adapters, multi-source G300 SCADA service, or specific latency and fail-closed behaviour.

## Frequently Asked Questions

**Q: Can firmware updates pass through the diode?**
A: An outbound one-way path is not an inbound update route. Use a separate, controlled update process with provenance, signature, malware, approval, transfer, rollback, logging, and emergency-recovery controls.

**Q: If IT is compromised, is SCADA safe?**
A: A verified one-way conduit can prevent ordinary IT-originated packets from returning over that conduit. It cannot make claims about other connections, proxy hosts, management interfaces, removable media, credentials, insiders, supply chain, or vulnerabilities already present in OT. Test the complete architecture.

**Q: Which SCADA protocols and historians are supported?**
A: The public records mention Modbus and Syslog for selected models, but not blanket DNP3, OPC-UA, PI, PHD, or event-by-event historian replication. Obtain a versioned service matrix and prove semantics, timestamps, quality flags, ordering, buffering, restart, and reconciliation.

**Q: What happens on hardware or destination failure?**
A: Define and test power loss, interface fault, full queue, proxy crash, destination outage, packet loss, alarms, recovery, and duplicate handling. Design OT control so it does not depend on the export path, but do not claim operations are unaffected without a system-specific failure analysis.
