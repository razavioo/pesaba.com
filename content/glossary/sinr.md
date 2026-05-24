---
title: 'SINR'
title_fa: 'SINR'
slug: 'sinr'
short_definition: 'Signal-to-Interference-plus-Noise Ratio — a measure of signal quality in a wireless communication link.'
category: 'cellular'
locale: en
related_products:
  - 'capella'
  - 'venus-netsens'
---

## Definition

SINR (Signal to Interference plus Noise Ratio) is the ratio of desired signal power to the sum of interference power and noise power, expressed in dB. SINR is the primary predictor of achievable data throughput in LTE and 5G NR networks.

## How It Works

Higher SINR enables higher-order modulation (64-QAM, 256-QAM) and more aggressive MIMO spatial multiplexing, resulting in higher spectral efficiency and user throughput. Shannon's capacity formula (C = B × log₂(1 + SINR)) expresses the theoretical maximum bit rate as a function of bandwidth and SINR.

## Why It Matters for Network Security

SINR drives modulation and coding scheme (MCS) selection, which determines user data rate. Poor SINR forces the network to use robust but low-rate modulations (QPSK 1/3) rather than efficient high-rate ones (256-QAM 3/4). RF planning and interference management optimise SINR to maximise network capacity.

## Related Pesaba Products

- **Venus Netsens / Venus Challenger** — Measure and log SINR as part of the full KPI set during drive and walk tests.
