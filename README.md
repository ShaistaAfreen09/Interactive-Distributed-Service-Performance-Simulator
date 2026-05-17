# LatencyScope

LatencyScope is a realtime distributed systems observability and performance experimentation platform designed for analyzing queue saturation, service degradation, latency collapse, and throughput instability under stochastic workloads.

The platform models how distributed services behave as traffic approaches system capacity, enabling interactive exploration of failure propagation, tail latency amplification, queue buildup, and workload saturation through a cloud-native observability dashboard.

---

## Overview

Modern distributed systems rarely fail instantly. Instead, they degrade progressively:

* queues accumulate under pressure
* retries amplify congestion
* latency increases nonlinearly
* throughput collapses near saturation
* dependent services propagate instability upstream

LatencyScope provides an interactive environment for visualizing and studying these behaviors using realtime telemetry-style dashboards inspired by modern cloud-native observability tooling.

The project bridges concepts from:

* distributed systems
* queueing theory
* performance engineering
* SRE observability practices
* cloud-native service monitoring

---

## Core Concepts Modeled

### Queue Saturation

Simulates request accumulation when incoming traffic exceeds processing capacity.

### Tail Latency Amplification

Visualizes divergence between average latency and high-percentile latency (P95/P99) under load.

### Failure Propagation

Demonstrates how degradation in one service affects upstream dependencies across the service graph.

### Throughput Collapse

Models nonlinear degradation as utilization approaches saturation thresholds.

### Traffic Instability

Explores burst traffic, retry storms, packet loss, and cascading service degradation scenarios.

---

## Features

* Realtime distributed systems observability dashboard
* Dynamic service degradation simulation
* Queue depth and saturation modeling
* Tail latency analysis (P50, P95, P99)
* Incident feed with realtime alerts
* Throughput degradation visualization
* Failure propagation monitoring
* Adjustable workload parameters
* Interactive traffic and failure controls
* Cloud-native dashboard interface inspired by Grafana and OpenTelemetry tooling

---

## Dashboard Modules

### Metrics Layer

* Service utilization
* Queue depth
* Throughput
* Average latency
* P95 latency
* P99 latency
* Error-rate simulation

### Service Health Monitoring

Simulated services:

* api-gateway
* auth-service
* worker-service
* telemetry-agent
* database

Each service exposes:

* latency
* saturation
* queue depth
* degradation state

### Incident Feed

Realtime generated alerts including:

* queue saturation detection
* tail latency threshold breaches
* retry storm escalation
* throughput instability
* service degradation events

### Failure Simulation Controls

Interactive controls for:

* request rate
* service rate
* concurrent clients
* packet loss
* traffic spikes
* failure injection

---

## Simulation Model

The platform is based on queue-driven workload modeling concepts derived from M/M/1 systems:

* Poisson arrival process (λ)
* Exponential service time distribution (μ)
* Utilization:

ρ = λ / μ

The simulator focuses on observing emergent performance behavior as utilization approaches saturation.

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* TailwindCSS
* Recharts
* Framer Motion

### Simulation Layer

* Python
* NumPy
* Pandas

### Visualization & Experimentation

* Streamlit
* Cloud-native observability UI patterns

* https://interactive-distributed-service-performance-simulator-4yjsyrmg.streamlit.app/

---

## Repository Structure

frontend/                 # Next.js observability dashboard
app.py                    # Python simulation logic
requirements.txt          # Python dependencies

---

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Python Simulation Layer

```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## Future Work

* Multi-service queue network simulation
* WebSocket-based realtime telemetry streaming
* Kubernetes workload integration
* Prometheus-compatible metrics export
* OpenTelemetry trace visualization
* Autoscaling policy experimentation
* Distributed tracing simulation
* Service mesh latency propagation modeling

---

## Purpose

LatencyScope was built as an experimental platform for studying distributed systems behavior under load through interactive observability-driven workflows.

The project emphasizes practical intuition around:

* service reliability
* performance bottlenecks
* saturation dynamics
* cloud-native monitoring patterns
* incident response visibility
