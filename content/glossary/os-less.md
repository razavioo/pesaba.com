---
title: 'OS-Less Architecture'
title_fa: 'معماری بدون سیستم‌عامل'
slug: 'os-less'
short_definition: 'A hardware design that operates without a general-purpose operating system, eliminating the software attack surface.'
category: 'hardware'
locale: en
related_products:
  - 'emx-6'
  - 'data-diode-a10'
related_articles:
  - 'hardware-encryption-vs-software-encryption-which-is-safer-for-critical-infrastructure'
---

## Definition

OS-less (operating-system-less) design refers to hardware devices — typically FPGA-based — that perform their network function entirely in reconfigurable hardware logic, without a general-purpose operating system, CPU, or software stack on the data path.

## How It Works

In an OS-less device, the FPGA fabric implements all networking functions (packet classification, forwarding, encryption, protocol processing) directly in hardware logic. There is no Linux kernel, no device drivers, no user-space applications, and no TCP/IP stack that can be exploited. Configuration is applied at startup via a signed bitstream loaded into the FPGA.

## Why It Matters for Network Security

Every line of software code is potential vulnerability surface. OS-less designs eliminate the most common classes of vulnerability: buffer overflows, privilege escalation, remote code execution via OS exploits, and software supply-chain attacks. An FPGA device with no OS has no CVE history and no patch cycle — its behaviour is as deterministic as the hardware it runs on.

## Related Pesaba Products

All Pesaba hardware products — EMX-6, Upcryptor, EMX-4, EMX-5, and all data diodes — are OS-less by design. The FPGA logic is the product; there is no operating system.
