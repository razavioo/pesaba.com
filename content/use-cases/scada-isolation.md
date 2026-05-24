---
title: 'SCADA Isolation'
title_fa: 'ایزولاسیون SCADA'
slug: 'scada-isolation'
description: 'Physically isolate SCADA and ICS networks from enterprise IT while maintaining one-way telemetry export.'
tagline: 'Your SCADA cannot be reached from outside — by design.'
locale: en
products:
  - 'data-diode-g200'
  - 'data-diode-g300'
  - 'data-diode-k200'
---

## What It Is

SCADA isolation is the practice of severing all network paths from external networks — corporate IT, the internet, vendor VPNs — into SCADA and ICS systems, while preserving the outbound flow of telemetry, alarms, and historian data. Unlike firewall-based segmentation, which can be misconfigured or exploited, hardware-enforced isolation using a data diode is a physical guarantee: it derives from optics, not software, and cannot be bypassed remotely.

## Why It Matters

- **Physical consequences are irreversible:** A successful cyberattack on a SCADA system can trip breakers, damage turbines, corrupt a treatment process, or cause a hazardous release. Recovery is measured in days, not hours — and some damage cannot be undone.
- **Regulatory mandates are tightening:** IEC 62443, NIST SP 800-82, NERC CIP, and Iran's AFTA critical-infrastructure guidelines all require documented security controls at the OT/IT boundary. A hardware data diode satisfies the strongest interpretations of these requirements with a provable, auditable control.
- **Known attack vectors require a return path:** 90% of documented ICS incidents — spear phishing to the engineering workstation, lateral movement from IT to OT, remote C2 commands — require at least one byte to travel inbound. Remove the return path and the majority of attack classes become physically impossible, not just difficult.

## How We Do It

Pesaba data diodes enforce the one-way barrier at Layer 1. A pair of optical transceivers is installed with a transmitter only on the OT source side and a receiver only on the IT destination side — no transmitter exists on the destination side, so no signal can travel back into SCADA. The FPGA fabric handles protocol bridging — accepting Modbus TCP, DNP3, OPC-UA, syslog, and flat-file historian formats on the source, then delivering standard Ethernet frames to the destination network. Because the FPGA logic is compiled from a verified HDL design rather than running on a general-purpose OS, the attack surface is limited to hardware components. For organisations that require periodic maintenance access, the K200 provides a physically keyed bidirectional capability that is open only during authorised maintenance windows.

## The Pesaba Solution

- **Data Diode G200** — 1 Gbps one-way gateway for historian replication and SCADA telemetry export. Supports Modbus TCP, DNP3, OPC-UA subscription bridging, and syslog.
- **Data Diode G300** — High-throughput 1 Gbps diode for environments requiring simultaneous unidirectional streams from multiple source zones (generation, transmission, distribution).
- **Data Diode K200** — Keyed diode with controlled bidirectional capability for maintenance windows; one-way by default, physically unlocked for authorised access.

## FAQ

**Q: Can a data diode pass firmware updates to PLCs?**
A: No — firmware must be delivered through a separate controlled path such as an isolated laptop or jump server with session recording. The diode path is for outbound operational data, not inbound software packages.

**Q: If IT is compromised, is SCADA still safe?**
A: Yes. There is no network path from IT to OT — an attacker from the IT side cannot send even a single packet into SCADA. This is a physical guarantee, not a software ACL that can be removed.

**Q: Does the data diode add latency to SCADA operations?**
A: The diode adds no latency to OT-side operations because data only flows out. The one-way link introduces a small buffering delay (typically under 5 ms) before data arrives at the IT historian — negligible for monitoring and reporting.

**Q: Which protocols does the diode bridge?**
A: G200 supports Modbus TCP, DNP3, OPC-UA (subscription mode), syslog, and one-way file transfer via a proxy. G300 extends this to simultaneous multi-source streams.

**Q: Can industrial historians like OSIsoft PI or Honeywell PHD be replicated?**
A: Yes. The Pesaba historian proxy supports event-by-event replication to the IT-side historian. The destination historian receives changes but has no path to send commands back into OT.

**Q: What happens if the diode hardware fails?**
A: The diode is fail-closed: if the hardware loses power or detects a fault, traffic is dropped rather than passed in plaintext or allowed to pass bidirectionally. OT operations continue unaffected; historian replication pauses until the diode is restored.
