---
title: 'DCS'
title_fa: 'DCS'
slug: 'dcs'
short_definition: 'Distributed Control System — a control system for a process or plant in which the controller elements are not central in location.'
category: 'ot-ics'
locale: en
---

## Definition

A DCS (Distributed Control System) is a process control architecture in which control functions are distributed across multiple controllers located near the process equipment, rather than centralised in a single master unit. DCS platforms are used in continuous-process industries: chemical, refining, power generation, and pharmaceuticals.

## How It Works

A DCS consists of field control stations (FCS) — hardened controllers located near process equipment — connected to operator workstations and an engineering station through a proprietary or standard control network (such as PROFIBUS, HART, or Foundation Fieldbus). The FCS executes process control algorithms locally; the operator stations provide supervisory monitoring and control.

## Why It Matters for Network Security

DCS networks control continuous processes where a disruption can cause runaway reactions, equipment damage, or safety incidents. Connecting DCS networks to corporate IT systems for data analytics creates a pathway that adversaries can exploit. Hardware isolation between the DCS and corporate networks is the primary mitigation.

## Related Pesaba Products

- **Data Diode G200 / G300** — Export DCS historian data to corporate analytics platforms without creating an inbound attack path into the DCS network.
