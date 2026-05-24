---
title: 'RSRQ'
title_fa: 'RSRQ'
slug: 'rsrq'
short_definition: 'Reference Signal Received Quality — indicates the quality of the received reference signal in LTE/NR.'
category: 'cellular'
locale: en
related_products:
  - 'capella'
  - 'auriga'
---

## Definition

RSRQ (Reference Signal Received Quality) is an LTE measurement that combines RSRP with the total received interference and noise. It reflects signal quality rather than just signal level: a high RSRP with high interference will result in a lower RSRQ.

## How It Works

RSRQ is defined as: N × RSRP / RSSI, where N is the number of resource blocks and RSSI is the total received signal strength (signal plus interference plus noise). RSRQ ranges from -3 dB (excellent) to -19.5 dB (poor). Handover decisions in LTE use both RSRP and RSRQ to assess whether a target cell will provide better service than the current serving cell.

## Why It Matters for Network Security

RSRQ is a better predictor of user experience than RSRP alone in interference-limited environments (dense urban deployments). Low RSRQ despite adequate RSRP indicates inter-cell or inter-system interference that coverage planning must address.

## Related Pesaba Products

- **Venus Netsens** — Measures and logs RSRQ alongside RSRP, SINR, and throughput during drive tests.
