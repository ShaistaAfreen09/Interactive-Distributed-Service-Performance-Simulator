import streamlit as st
import numpy as np
import matplotlib.pyplot as plt

st.title("Distributed Service Performance Explorer")
st.write("Interactive Queueing Theory Simulator (M/M/1 Model)")

# Sidebar Inputs
arrival_rate = st.sidebar.slider("Arrival Rate (λ)", 10, 200, 50)
service_rate = st.sidebar.slider("Service Rate (μ)", 20, 300, 80)
num_requests = st.sidebar.slider("Number of Requests", 1000, 20000, 10000)

if arrival_rate >= service_rate:
    st.error("⚠ System unstable: Arrival rate must be lower than service rate!")
else:
    # Simulation
    arrival_times = np.cumsum(np.random.exponential(1/arrival_rate, num_requests))
    service_times = np.random.exponential(1/service_rate, num_requests)

    start_service = np.zeros(num_requests)
    finish_service = np.zeros(num_requests)

    for i in range(num_requests):
        if i == 0:
            start_service[i] = arrival_times[i]
        else:
            start_service[i] = max(arrival_times[i], finish_service[i-1])
        finish_service[i] = start_service[i] + service_times[i]

    latency = finish_service - arrival_times

    utilization = arrival_rate / service_rate

    st.subheader("System Metrics")
    st.write(f"Utilization (ρ): {utilization:.2f}")
    st.write(f"Average Latency: {np.mean(latency):.4f}")
    st.write(f"P95 Latency: {np.percentile(latency,95):.4f}")
    st.write(f"P99 Latency: {np.percentile(latency,99):.4f}")

    # Plot
    fig, ax = plt.subplots()
    ax.hist(latency, bins=50)
    ax.set_title("Latency Distribution")
    ax.set_xlabel("Latency")
    ax.set_ylabel("Frequency")
    st.pyplot(fig)
