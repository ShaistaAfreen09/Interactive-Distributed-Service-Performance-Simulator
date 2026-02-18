# Interactive Distributed Service Performance Simulator

An interactive simulation tool for studying how service systems behave under stochastic workloads using an M/M/1 queueing model.

This project explores the relationship between system utilization, queue formation, and response-time degradation — phenomena commonly observed in backend and distributed service environments.

---

## Overview

As request rates approach system capacity, even well-provisioned services can exhibit rapid performance collapse.
This simulator models that transition by allowing controlled variation of arrival and service rates, enabling direct observation of:

* Queue buildup under increasing load
* Non-linear latency growth near saturation
* Divergence between mean latency and tail latency
* Stability limits of single-service systems

The goal is to provide an executable model for understanding performance behavior rather than relying solely on analytical formulas.

---

## Model

The simulator implements an **M/M/1 queue** with:

* Poisson arrival process (rate λ)
* Exponential service time (rate μ)
* Single server with infinite buffer

System utilization:

[
\rho = \frac{\lambda}{\mu}
]

Performance degradation is analyzed as ( \rho \rightarrow 1 ).

---

## Features

* Adjustable workload and service parameters
* Empirical latency distribution analysis
* Tail metrics (P50, P95, P99) computation
* Visualization of queue-driven delay behavior
* Lightweight framework suitable for experimentation and extension

---

## Tech Stack

* Python
* NumPy
* Pandas
* Matplotlib
* Streamlit

---

## Repository Structure

```
app.py              # Simulation and visualization interface
requirements.txt    # Project dependencies
```

---

## Usage

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the simulator:

```bash
streamlit run app.py
```

---

## Purpose

This repository serves as a compact experimental bridge between queueing theory and observable system behavior, useful for studying performance characteristics relevant to scalable service design.

---

## Future Work

* Multi-server queue extensions (M/M/k)
* Alternative service-time distributions
* Load-shedding and scaling experiments
* Comparative performance modeling
