---
title: 'RSRP'
title_fa: 'RSRP'
slug: 'rsrp'
short_definition: 'Reference Signal Received Power — a measure of the power of LTE/NR reference signals received by a UE.'
category: 'cellular'
locale: en
related_products:
  - 'capella'
  - 'auriga'
  - 'venus-netsens'
---

## Definition

RSRP (Reference Signal Received Power) is an LTE measurement of the average received power of a single reference signal resource element from the serving cell. It is the primary indicator of signal level and cell coverage in LTE and NR networks, measured in dBm.

## How It Works

In LTE, the eNB transmits cell-specific reference signals (CRS) on known resource elements. The UE measures the RSRP by averaging the power received on those elements and reports it to the network through measurement reports. Typical RSRP values range from -44 dBm (excellent) to -140 dBm (no signal), with coverage threshold typically defined at -100 to -110 dBm.

## Why It Matters for Network Security

RSRP is the primary input to handover decisions, cell selection, and coverage mapping. Low RSRP indicates poor coverage; variations in RSRP over time indicate coverage instability or interference. Drive-test systems log RSRP continuously to build coverage maps and identify problem areas.

## Related Pesaba Products

- **Venus Netsens** — Logs RSRP, RSRQ, SINR, and throughput simultaneously with GPS coordinates during drive tests.
- **Venus Challenger** — Portable walk-test device logging RSRP for indoor coverage verification.
