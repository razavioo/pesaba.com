---
title: 'One-Way Data Transfer'
title_fa: 'انتقال یک‌طرفه داده'
slug: 'one-way-data-transfer'
description: 'Use hardware-enforced one-way data flow to permanently eliminate the attack surface between OT and IT networks.'
tagline: 'Enforced through physics — not policy.'
locale: en
products:
  - 'data-diode-a10'
  - 'data-diode-a100'
  - 'data-diode-g200'
  - 'data-diode-g300'
  - 'data-diode-k200'
---

## What It Is

A data diode is a hardware device that enforces strictly one-way data flow at the physical layer — data can pass from a protected network to an external network, but no signal of any kind can travel back. Unlike firewalls and software-defined policies, the unidirectional guarantee is built into the optoelectronic circuit itself and cannot be overridden by software exploits, misconfiguration, or insider manipulation. Pesaba's FPGA-native data diodes carry no operating system, eliminating entire classes of vulnerability from the outset.

## Why It Matters

- **Permanent elimination of the return channel:** Every remote-code-execution, command-and-control, and data-exfiltration technique requires at least one byte to travel back to the attacker. Hardware-enforced unidirectionality removes that return channel permanently, making intrusion physically impossible rather than merely difficult.
- **Regulatory compliance for critical infrastructure:** Standards such as IEC 62443, NERC CIP, and NIS2 increasingly require unidirectional security gateways for the highest protection levels. A hardware data diode satisfies those requirements because its security property is demonstrable without relying on software audit logs or periodic penetration tests.
- **Zero patch-cycle maintenance:** Software firewalls and next-generation perimeter devices demand continuous patch management. An FPGA-native diode with no OS has no CVE exposure, no patch cadence, and no configuration drift — the security property is permanently encoded in silicon.

## How Pesaba Solves It

Pesaba data diodes implement the unidirectional path through a dedicated optical transmit circuit with no receive path on the protected side. The FPGA fabric handles protocol bridging — translating industrial protocols such as Modbus TCP, DNP3, or OPC-UA to standard Ethernet frames — while preserving strict one-way flow. Because the FPGA logic is compiled from a verified HDL design rather than executed by a general-purpose OS, the attack surface is limited to the hardware bill of materials alone. An optional software proxy pair enables file transfer and historian replication without creating any feedback path into the protected network.

## Recommended Products

- **A10** — Compact 1 Gbps data diode for light-duty OT-to-IT telemetry streams in space-constrained or DIN-rail environments.
- **A100** — Rack-mount 1 Gbps diode with integrated protocol proxy support for Modbus TCP and OPC-UA log mirroring.
- **G200** — High-throughput 10 Gbps FPGA data diode designed for SCADA historian replication and bulk telemetry export.
- **G300** — Ruggedised 10 Gbps diode for harsh industrial and outdoor environments; extended operating temperature range.
- **K200** — High-assurance data diode rated for government and defense classification boundaries; tamper-evident chassis.

## Frequently Asked Questions

**Q: Can a data diode replace a firewall entirely?**
A: In most OT segmentation architectures a data diode is deployed alongside, not instead of, a firewall. The diode provides an absolute hardware guarantee for flows that must be strictly one-way (telemetry export, log shipping, historian replication), while a firewall handles the remaining bidirectional management traffic in a separate, tightly controlled segment.

**Q: How do bidirectional applications such as file transfer work through a data diode?**
A: Pesaba diodes ship with optional software proxies that sit on either side of the diode. The sending proxy buffers files and streams them unidirectionally; the receiving proxy reassembles them. Any acknowledgment signal is generated entirely within the IT side — the OT side never receives any response.

**Q: What throughput can I expect in a SCADA historian replication scenario?**
A: The G200 and G300 sustain 10 Gbps line rate for raw Ethernet frames. In a typical OPC-UA historian replication scenario, real-world throughput depends on the historian write rate, not the diode — the hardware introduces sub-10-microsecond latency beyond optical propagation delay.

**Q: Is there any scenario in which data can travel backwards through a Pesaba diode?**
A: No. The optical transmitter on the protected side has no corresponding receiver. Even if the FPGA firmware were completely compromised, no receive path exists in the hardware — the return signal has nowhere to terminate.

**Q: Which protocols does the proxy layer support?**
A: Out of the box the proxy supports Modbus TCP, DNP3, OPC-UA, syslog, and SFTP/FTP file transfer. Additional protocol adapters are available on request for ICCP, IEC 61850 GOOSE, and proprietary SCADA framing.
