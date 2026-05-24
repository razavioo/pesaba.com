---
title: 'CSSR'
title_fa: 'CSSR'
slug: 'cssr'
short_definition: 'Call Setup Success Rate — the percentage of call setup attempts that are completed successfully on a mobile network.'
category: 'cellular'
locale: en
related_products:
  - 'capella'
  - 'auriga'
---

## Definition

CSSR (Call Setup Success Rate) is a key performance indicator in mobile networks that measures the percentage of call setup attempts that succeed — from the initial access request to successful bearer establishment. It is one of the primary indicators of voice network quality for MNOs.

## How It Works

CSSR is calculated as: (Number of successfully established calls / Number of call setup attempts) × 100%. Call setup failures can occur at multiple stages: random access channel (RACH) failure, RRC connection failure, RANAP assignment failure, or core network rejection. Drive-test systems log each stage to identify where failures occur and their root causes.

## Why It Matters for Network Security

CSSR directly measures subscriber experience for voice services. A degraded CSSR causes audible symptoms (calls failing to connect, dropping mid-dial) that drive subscriber churn. Regulatory bodies in many markets require MNOs to maintain CSSR above a defined threshold.

## Related Pesaba Products

- **Venus Netsens** — Logs CSSR and per-stage failure rates during drive tests.
- **Capella** — Monitors CSSR continuously from network-side counters.
