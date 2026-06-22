---
title: 'Water Toxicity Monitoring'
title_fa: 'پایش سمیت آب'
slug: 'water-toxicity-monitoring'
description: 'Continuously monitor water quality parameters using hardware sensors and automated alerting.'
tagline: 'Real-time monitoring. Zero false negatives.'
locale: en
products:
  - 'orazan'
hero_image: '/illustrations/orazan-dam.webp'
---

## What It Is

![Orazan deployment at a dam reservoir — multi-parameter water quality monitoring](/illustrations/orazan-dam.webp)

Water toxicity monitoring is the continuous, automated measurement of water quality parameters — turbidity, pH, conductivity, free chlorine, dissolved oxygen, and contaminant-specific indicators — at key points in a water distribution system. Orazan combines multi-parameter sensors with real-time anomaly detection to identify contamination events in minutes rather than hours, before treated water reaches consumers.

## Why It Matters

- **Public health impact is immediate and irreversible:** A contamination event that reaches the distribution network can affect thousands of people within hours. Laboratory testing cycles take four to eight hours; Orazan alerts within the same sampling interval (default: one minute), enabling isolation before water leaves the treatment facility.
- **Physical and cyber threats to water infrastructure are real:** Water treatment facilities have been targeted by both physical sabotage and cyberattacks — including adversaries attempting to alter chemical dosing. Continuous quality monitoring provides a detection layer that operates independently of IT/OT network security.
- **Regulatory requirements demand documented monitoring:** Iran's Ministry of Health and provincial water authorities require continuous monitoring and logged evidence of water quality parameters. Orazan produces a continuous, timestamped audit trail that satisfies these documentation requirements.

## How We Do It

Orazan deploys multi-parameter sensors at critical points in the water infrastructure — treatment plant inlet, post-treatment outlet, storage tanks, and pumping stations. Each sensor node measures up to eight parameters simultaneously and transmits readings to a central analytics platform over a standard industrial network connection. The anomaly detection engine compares each reading against a learned baseline profile specific to that measurement point. When a statistically significant deviation appears — a sudden turbidity spike, a pH excursion, or a conductivity anomaly consistent with chemical contamination — the system triggers an alert within seconds and delivers notifications via SMS, email, and the operations dashboard. Configurable automated responses can initiate distribution valve closures before any operator acknowledges the alert.

### Technical Specifications: Orazan Multi-Parameter Sensor Suite

| Water Quality Parameter | Measurement Range | Measurement Accuracy | Sensing Methodology | Response Time (T90) |
| :--- | :--- | :--- | :--- | :--- |
| **Acidity (pH)** | 0 to 14 pH | ±0.05 pH | Differential glass electrode potentiometric | < 10 seconds |
| **Turbidity** | 0 to 4000 NTU | ±2% or 0.05 NTU | 90° Infrared light scattering (ISO 7027) | < 15 seconds |
| **Conductivity (EC)** | 0 to 20,000 µS/cm | ±1% of reading | Electromagnetic inductive (Toroidal) sensor | < 5 seconds |
| **Free Chlorine** | 0 to 5.0 mg/L | ±0.05 mg/L or 2% | Membrane amperometric potentiostat | < 30 seconds |
| **Dissolved Oxygen** | 0 to 20 mg/L | ±0.1 mg/L | Optical luminescence sensor | < 20 seconds |
| **Temperature** | 0 to 50 °C | ±0.1 °C | Platinum Pt100 RTD resistance | < 10 seconds |

## The Pesaba Solution

- **Orazan** — Multi-parameter water quality monitoring system with real-time anomaly detection, automated alerting, and continuous data logging. Supports Modbus TCP and OPC-UA for integration with existing SCADA systems. Rated IP65 for outdoor and industrial installation.

## FAQ

**Q: What parameters does Orazan measure?**
A: The standard sensor suite measures pH, turbidity, electrical conductivity, temperature, free chlorine, combined chlorine, and dissolved oxygen. Application-specific sensors for nitrates, heavy metals, and microbiological indicators can be added.

**Q: How quickly does Orazan detect a contamination event?**
A: Sensors sample at a one-minute default interval; anomaly detection runs on each sample in real time. Total time from event to operator alert is typically under five minutes — far faster than laboratory analysis or manual sampling.

**Q: What triggers an alert?**
A: Alerts are triggered when a parameter exceeds a configurable absolute threshold, when the rate of change exceeds a configurable slope threshold, or when the multivariate anomaly score exceeds the learned baseline by a configurable number of standard deviations. All three conditions are independently configurable per sensor node.

**Q: Does Orazan integrate with existing SCADA or DCS systems?**
A: Yes. Orazan supports Modbus TCP and OPC-UA, which covers the majority of SCADA and historian platforms deployed in Iranian water utilities. Integration requires no modification to the existing control system.

**Q: What happens when connectivity to the central platform is lost?**
A: Each sensor node buffers up to 72 hours of readings locally. When connectivity is restored, buffered data is automatically synchronised. Local alert outputs (relay contacts, audible alarms) continue to function independently of network connectivity.

**Q: Can Orazan handle outdoor deployment conditions?**
A: Yes. The sensor enclosure is rated IP65 and operates across a wide temperature range. Battery-backed operation and optional solar power are available for remote pumping stations without reliable mains supply.
