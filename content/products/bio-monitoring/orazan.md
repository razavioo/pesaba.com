---
title: 'Orazan'
title_fa: 'اورازان'
slug: 'orazan'
category: 'bio-monitoring'
category_label: 'Bio Monitoring'
category_label_fa: 'پایش زیست‌محیطی'
description: 'Orazan is a continuous biological water-toxicity monitoring system that uses live fish behaviour — analysed by AI algorithms — to provide real-time early warning of toxic contamination in water sources.'
description_fa: 'پایش پیوسته سموم آب با استفاده از الگوریتم‌های هوش مصنوعی'
id: '405ff919-00ef-4e10-b742-df89ce0f61d3'
active: true
priority: 0
specs:
  - label: 'Detection Method'
    value: 'AI-based behavioural analysis (Fish Toximeter)'
  - label: 'Methodology Basis'
    value: 'Extended Dynamic Daphnia Test (EDDT)'
  - label: 'Measurands'
    value: 'Velocity, swimming height, movement patterns, count'
  - label: 'Number of Fish'
    value: 'Minimum 8 fish (typical 8–10)'
  - label: 'Recommended Species'
    value: 'Tiger Barb'
  - label: 'Outputs'
    value: 'Local alarm, network alarm, SMS notification'
  - label: 'User Interface'
    value: 'Dedicated Linux-based application'
  - label: 'Maintenance Interval'
    value: 'Greater than 30 days'
  - label: 'Application Domains'
    value: 'Rivers, water-treatment-plant intakes, sewers, reservoirs, distribution networks'
specs_fa:
  - label: 'تعداد ماهی'
    value: 'حداقل 8 ماهی'
  - label: 'نوع ماهی'
    value: 'تایگر بارب'
  - label: 'خروجی ها'
    value: 'آلارم محلی، شبکه، امکان ارسال SMS'
  - label: 'رابط کاربری'
    value: 'نرم افزار مخصوص تحت Linux'
  - label: 'زمان نگهداری دوره ای'
    value: 'بیش از 30 روز'
  - label: 'مقادیر اندازه گیری شده در دستگاه'
    value: 'فاصله بین ماهی ها و تشکیل گروه'
photos:
  - '/photos/orazan/photo-1.webp'
  - '/photos/orazan/photo-2.webp'
  - '/photos/orazan/no-bracket.webp'
diagram: '/illustrations/orazan-system.webp'
---

## Orazan | Continuous Water Toxicity Detection

ORAZAN is a continuous biological water-quality monitoring system that uses live aquatic organisms — fish — as biosensors for the rapid detection of toxic compounds in water bodies. The device observes fish behaviour under the influence of a sample water stream and applies AI-based behavioural analysis algorithms to detect changes that correlate with the presence of toxic substances.

ORAZAN is a sensitive instrument designed for monitoring rivers, water-treatment-plant intakes, distribution-network reservoirs, sewers, and other water sources where contamination would have public-health consequences. Continuous biological monitoring enables real-time early warning of toxic events — capturing the broad spectrum of contaminants that conventional chemical sensors may miss when each contaminant is present below its individual detection threshold.

## Methodology

The instrument is based on a development of the Extended Dynamic Daphnia Test (EDDT), a proven biological monitoring methodology used widely in Europe and other parts of the world. ORAZAN extends this approach using fish (recommended species: Tiger Barb), high-resolution behavioural analysis, and AI algorithms to convert fish movement patterns into reliable toxicity alerts.

The relative magnitude and presence of toxic substances are recorded by the instrument for further analysis. This combination of biological sensitivity and digital recording enables supervision and control of water sources — supporting rapid detection of, response to, and forensic investigation of toxic contamination incidents.

## Measured Parameters

ORAZAN continuously analyses the behaviour of the fish population in the sample chamber, extracting the following measurands:

- Speed — both velocity magnitude and spatial distribution
- Swimming height in the water column
- Fractal dimension of swimming paths (angle and curviness)
- Inter-fish distance and group formation
- Fish growth over time
- Fish count (mortality detection)

Deviation in any of these parameters beyond learned baseline ranges triggers an alarm.

## Outputs and Integration

- Local alarm (visual and audible)
- Network alarm to SCADA, historian, or operations centre
- SMS notifications to designated personnel
- Linux-based dedicated user-interface application for configuration and historical analysis

## Operational Profile

- Maintenance interval: greater than 30 days between routine servicing
- Minimum population: 8 fish per chamber (typical 8–10)
- Continuous online monitoring suitable for unattended remote deployment

## Key Advantages

- Detects a broad spectrum of toxic compounds — including those that conventional chemical sensors may miss when present below their individual detection threshold
- AI-based behavioural analysis reduces false positives and adapts to baseline conditions
- Long maintenance interval (30+ days) suits unstaffed pumping and treatment sites
- Standard alarm outputs integrate cleanly with existing SCADA and operations workflows
- Suitable for use as the biological component of a defence-in-depth water-quality monitoring strategy
