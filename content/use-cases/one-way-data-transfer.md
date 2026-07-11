---
title: 'One-Way Data Transfer'
title_fa: 'انتقال یک‌طرفه داده'
slug: 'one-way-data-transfer'
description: 'Evaluate hardware-enforced one-way transfer for narrowly defined flows between networks with different trust levels.'
tagline: 'Verify the direction, boundary, interfaces, and complete data workflow.'
locale: en
products:
  - 'data-diode-a10'
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'data-diode-g300'
  - 'data-diode-k200'
---

## What It Is

A data diode is designed to constrain a data path to one direction through hardware separation. This can materially reduce reverse-path network risk for a defined connection. The assurance claim belongs to an exact architecture and evaluated boundary: data interfaces, management ports, power, firmware, proxy hosts, removable media, adjacent equipment, installation, and operational procedures all remain relevant.

## Why It Matters

- **Constrained return path:** A physically one-way data interface can prevent ordinary network packets from travelling back across that interface when the implementation matches its design.
- **Controlled outbound visibility:** Logs, alarms, files, video, or telemetry may be exported without placing a conventional bidirectional session on the same path.
- **Reduced, not zero, maintenance:** An OS-less data path may reduce some software exposure, but firmware, management tools, proxy hosts, adapters, monitoring, and acceptance testing still need lifecycle management.
- **No automatic compliance:** IEC 62443, NERC CIP, NIS2, AFTA, or project rules may inform a design. A diode does not by itself prove compliance, a security level, or suitability for a classified boundary.

## Documented Pesaba Models

- **A10:** desktop model with 10 Mbps Ethernet interfaces and a documented 10 Mbps transfer rate.
- **A100:** desktop model with 100 Mbps Ethernet interfaces; its record lists selected one-way message, file, database, image, Modbus, camera, and Syslog services.
- **G200:** desktop or optional rack model with 1 Gbps Ethernet interfaces; its record lists selected transfer, Modbus, camera, SNMP, and Syslog functions.
- **G300:** 1U model with 1 Gbps Ethernet interfaces, positioned in its current record for one-way IP-camera streams.
- **K200:** desktop model with 10 Gbps Ethernet interfaces and selected transfer, Modbus, and Syslog functions in its current record.

The listed rates are product-record interface or transfer specifications, not proof of sustained application throughput under every frame size or proxy workload.

## Frequently Asked Questions

**Q: Can a data diode replace a firewall?**
A: It serves a different purpose. A diode can constrain a selected flow to one direction; firewalls, identity controls, endpoint security, monitoring, and separate maintenance paths may still be needed elsewhere in the architecture.

**Q: How do files or stateful applications work without return acknowledgements?**
A: A solution may use independent sending and receiving proxies, local acknowledgement, buffering, sequencing, integrity checks, and reconciliation. Confirm how loss, duplicate data, full queues, destination outages, restart, and business-level confirmation are handled. Do not assume a bidirectional protocol works unchanged through a one-way link.

**Q: Which protocols are supported?**
A: Support varies by model and service package. Current records mention Modbus and Syslog on selected products, plus several one-way file, database, image, video, and message functions. They do not establish blanket DNP3, OPC-UA, ICCP, IEC 61850, SFTP, or FTP support. Obtain the current service matrix and tested-version list.

**Q: Can anything travel in the reverse direction?**
A: The intended data-interface property must be verified for the exact model and revision. Overall system assurance also depends on every other interface and connected component. Review schematics, inspect the delivered unit, test reverse traffic and faults, and obtain independent evidence where the risk requires it.
