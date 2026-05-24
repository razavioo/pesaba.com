---
title: 'DPI'
title_fa: 'بازرسی عمیق بسته (DPI)'
slug: 'dpi'
short_definition: 'Deep Packet Inspection — examines the data part of a network packet as it passes an inspection point.'
category: 'networking'
locale: en
related_products:
  - 'emx-4'
  - 'emx-5'
---

## Definition

DPI (Deep Packet Inspection) is a method of examining network packets beyond their headers — analysing the payload to identify applications, detect malware, enforce policies, or extract session metadata. DPI is used in NGFWs, IPS systems, and network monitoring platforms.

## How It Works

A DPI engine receives packets, reassembles TCP streams, and applies regular expression or protocol-dissector matching against the reassembled payload. Identifying an HTTP session requires matching the stream against HTTP grammar; identifying an OPC-UA session requires understanding the OPC-UA binary protocol encoding. DPI at high speeds requires specialised hardware acceleration.

## Why It Matters for Network Security

DPI enables policy enforcement at the application layer — blocking specific file types, detecting C2 traffic patterns, or identifying OT protocol commands (e.g., Modbus write commands) that should not cross a network boundary. In OT environments, DPI of industrial protocols allows fine-grained control beyond simple port-based filtering.

## Related Pesaba Products

- **EMX-5** — Includes deep-packet filtering capability implemented in FPGA logic, providing DPI at wire speed without a software-based inspection engine.
