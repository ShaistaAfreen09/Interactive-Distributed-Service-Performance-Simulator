"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { MetricCard } from "@/components/MetricCard";
import { ServiceCard } from "@/components/ServiceCard";
import { IncidentFeed } from "@/components/IncidentFeed";
import { ControlPanel } from "@/components/ControlPanel";
import { LatencyChart } from "@/components/LatencyChart";
import { FailurePropagation } from "@/components/FailurePropagation";

type IncidentEvent = {
  title: string;
  message: string;
  severity: "Critical" | "Warning" | "Info";
  time: string;
};

type Metric = {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  caption: string;
};

type PresetKey = "stable" | "burst" | "retryStorm" | "cascadingFailure" | "saturatedPool";

type PresetDefinition = {
  label: string;
  requestRate: number;
  serviceRate: number;
  clients: number;
  packetLoss: boolean;
  trafficSpike: boolean;
  failureTriggered: boolean;
  queueBias: number;
  incidents: IncidentEvent[];
};

type ServiceHealth = {
  service: string;
  status: "Healthy" | "Degraded" | "Critical";
  latency: string;
  saturation: number;
  queueDepth: number;
};

const initialIncidents: IncidentEvent[] = [
  {
    title: "P99 latency exceeded threshold",
    message: "Persistent tail latency spikes detected across the ingress path.",
    severity: "Warning",
    time: "2m ago",
  },
  {
    title: "Queue saturation detected",
    message: "Worker queues are filling faster than the service can drain them.",
    severity: "Warning",
    time: "4m ago",
  },
  {
    title: "Service instability observed",
    message: "Short-lived retries are increasing on auth-service and telemetry-agent.",
    severity: "Info",
    time: "7m ago",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const presets: Record<PresetKey, PresetDefinition> = {
  stable: {
    label: "Stable Traffic",
    requestRate: 180,
    serviceRate: 280,
    clients: 22,
    packetLoss: false,
    trafficSpike: false,
    failureTriggered: false,
    queueBias: 6,
    incidents: [
      {
        title: "Stable traffic mode activated",
        message: "Observed consistent request flow with healthy processing capacity.",
        severity: "Info",
        time: "Just now",
      },
    ],
  },
  burst: {
    label: "Burst Traffic",
    requestRate: 520,
    serviceRate: 320,
    clients: 44,
    packetLoss: false,
    trafficSpike: true,
    failureTriggered: false,
    queueBias: 28,
    incidents: [
      {
        title: "Burst traffic detected",
        message: "Short-lived overflow is pushing queues above normal thresholds.",
        severity: "Warning",
        time: "Just now",
      },
    ],
  },
  retryStorm: {
    label: "Retry Storm",
    requestRate: 360,
    serviceRate: 300,
    clients: 56,
    packetLoss: true,
    trafficSpike: true,
    failureTriggered: false,
    queueBias: 34,
    incidents: [
      {
        title: "Retry storm ongoing",
        message: "Repeat requests are amplifying queue pressure and latency.",
        severity: "Warning",
        time: "Just now",
      },
    ],
  },
  cascadingFailure: {
    label: "Cascading Failure",
    requestRate: 560,
    serviceRate: 280,
    clients: 68,
    packetLoss: true,
    trafficSpike: true,
    failureTriggered: true,
    queueBias: 45,
    incidents: [
      {
        title: "Cascading failure initiated",
        message: "Multiple services are degrading rapidly under extreme load.",
        severity: "Critical",
        time: "Just now",
      },
    ],
  },
  saturatedPool: {
    label: "Saturated Worker Pool",
    requestRate: 420,
    serviceRate: 260,
    clients: 72,
    packetLoss: false,
    trafficSpike: false,
    failureTriggered: false,
    queueBias: 38,
    incidents: [
      {
        title: "Worker pool saturated",
        message: "Available workers are fully occupied and queue growth is rising.",
        severity: "Warning",
        time: "Just now",
      },
    ],
  },
};

export default function HomePage() {
  const [requestRate, setRequestRate] = useState(220);
  const [serviceRate, setServiceRate] = useState(260);
  const [clients, setClients] = useState(24);
  const [trafficSpike, setTrafficSpike] = useState(false);
  const [packetLoss, setPacketLoss] = useState(false);
  const [simulationActive, setSimulationActive] = useState(true);
  const [failureTriggered, setFailureTriggered] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetKey>("stable");
  const [queueBias, setQueueBias] = useState(6);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [jitter, setJitter] = useState(0);
  const [chartData, setChartData] = useState({
    latency: Array.from({ length: 12 }, (_, index) => ({ label: `${12 - index}m`, latency: 0 })),
    queue: Array.from({ length: 12 }, (_, index) => ({ label: `${12 - index}m`, queueDepth: 0 })),
    throughput: Array.from({ length: 12 }, (_, index) => ({ label: `${12 - index}m`, throughput: 0 })),
    utilization: Array.from({ length: 12 }, (_, index) => ({ label: `${12 - index}m`, utilization: 0 })),
  });

  const baseLoad = requestRate / Math.max(serviceRate, 1);
  const utilization = clamp(Math.round(baseLoad * 95), 18, 99);
  const queueDepth = clamp(
    Math.round(requestRate * 0.17 + clients * 0.34 + (trafficSpike ? 18 : 0) + (packetLoss ? 10 : 0) + (failureTriggered ? 16 : 0) + jitter * 3),
    4,
    98,
  );
  const avgLatency = clamp(
    Math.round(18 + queueDepth * 1.45 + (packetLoss ? 14 : 0) + (failureTriggered ? 19 : 0) + jitter * 5),
    22,
    420,
  );
  const p95Latency = clamp(Math.round(avgLatency * 1.7 + (trafficSpike ? 12 : 0) + jitter * 3), 40, 780);
  const p99Latency = clamp(Math.round(avgLatency * 2.1 + (failureTriggered ? 24 : 0) + jitter * 4), 55, 1120);
  const throughput = clamp(
    Math.round(serviceRate * (simulationActive ? 0.92 : 0.72) - (packetLoss ? 12 : 0) - (failureTriggered ? 22 : 0) - jitter * 4),
    20,
    serviceRate,
  );
  const errorRate = clamp(
    Number(
      (
        queueDepth / 13 +
        (trafficSpike ? 1.8 : 0) +
        (packetLoss ? 2.5 : 0) +
        (failureTriggered ? 3.8 : 0) +
        jitter * 0.4
      ).toFixed(1),
    ),
    0.8,
    12.5,
  );

  const metrics: Metric[] = useMemo(
    () => [
      {
        title: "Service utilization",
        value: `${utilization}%`,
        delta: `${clamp(utilization - 4, 0, 12)}%`,
        trend: baseLoad > 0.78 ? "up" : "down",
        caption: "Current compute saturation across simulated services.",
      },
      {
        title: "Queue depth",
        value: `${queueDepth}`,
        delta: `${clamp(queueDepth - 6, 1, 18)}`,
        trend: "up",
        caption: "Estimated number of pending requests awaiting processing.",
      },
      {
        title: "Avg latency",
        value: `${avgLatency} ms`,
        delta: `${clamp(Math.round(avgLatency / 12), 1, 18)}ms`,
        trend: packetLoss || trafficSpike ? "up" : "down",
        caption: "Moving average response time for the pipeline.",
      },
      {
        title: "P95 latency",
        value: `${p95Latency} ms`,
        delta: `${clamp(Math.round(p95Latency / 18), 1, 22)}ms`,
        trend: "up",
        caption: "Tail latency near the 95th percentile.",
      },
      {
        title: "P99 latency",
        value: `${p99Latency} ms`,
        delta: `${clamp(Math.round(p99Latency / 22), 1, 28)}ms`,
        trend: "up",
        caption: "Critical tail latency affecting user experience.",
      },
      {
        title: "Throughput",
        value: `${throughput} req/s`,
        delta: `${clamp(serviceRate - requestRate, 1, 34)}req/s`,
        trend: serviceRate > requestRate ? "down" : "up",
        caption: "Successful request processing per second.",
      },
      {
        title: "Error rate",
        value: `${errorRate}%`,
        delta: `${clamp(Math.round(errorRate * 10) / 10, 0.3, 2.8)}%`,
        trend: errorRate > 4 ? "up" : "down",
        caption: "Simulated request failures and packet drops.",
      },
    ],
    [avgLatency, baseLoad, errorRate, packetLoss, p95Latency, p99Latency, queueDepth, serviceRate, throughput, trafficSpike],
  );

  useEffect(() => {
    if (!simulationActive) {
      return;
    }

    const interval = window.setInterval(() => {
      const nextJitter = Math.random() * 0.9;
      setJitter(nextJitter);
      setChartData((prev) => {
        const timestamp = new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
        const loadFactor = Math.min(Math.max(baseLoad, 0.25), 1.3);
        const nextLatency = clamp(
          Math.round(
            avgLatency * (1 + Math.pow(loadFactor, 2) * 0.18) +
              (failureTriggered ? 32 : 0) +
              (trafficSpike ? 8 : 0) +
              (packetLoss ? 6 : 0) +
              nextJitter * 8,
          ),
          18,
          1400,
        );
        const nextQueueDepth = clamp(
          Math.round(
            queueDepth * 0.9 + Math.max(requestRate - serviceRate, 0) * 0.1 +
              (failureTriggered ? 9 : 0) +
              (trafficSpike ? 6 : 0) +
              Math.round(nextJitter * 2),
          ),
          2,
          130,
        );
        const nextThroughput = clamp(
          Math.round(
            Math.max(serviceRate * (simulationActive ? 0.92 : 0.72) - (packetLoss ? serviceRate * 0.08 : 0) - (failureTriggered ? 28 : 0), 10) -
              nextJitter * 4,
          ),
          10,
          serviceRate,
        );
        const nextUtilization = clamp(
          Math.round(utilization + (trafficSpike ? 2.5 : 0) + (failureTriggered ? 2.4 : 0) + nextJitter * 1.5),
          18,
          99,
        );

        const push = <T extends Record<string, unknown>>(items: T[], next: T) => [...items.slice(1), next];

        return {
          latency: push(prev.latency, { label: timestamp, latency: nextLatency }),
          queue: push(prev.queue, { label: timestamp, queueDepth: nextQueueDepth }),
          throughput: push(prev.throughput, { label: timestamp, throughput: nextThroughput }),
          utilization: push(prev.utilization, { label: timestamp, utilization: nextUtilization }),
        };
      });

      if (failureTriggered && Math.random() > 0.65) {
        setIncidents((current) => [
          {
            title: "Worker-service degraded",
            message: "Worker-service has entered critical backpressure and requires remediation.",
            severity: "Critical",
            time: "Just now",
          },
          ...current.slice(0, 4),
        ]);
      }

      if (!failureTriggered && queueDepth > 80 && Math.random() > 0.72) {
        setIncidents((current) => [
          {
            title: "Queue saturation critical",
            message: "Queue buildup is accelerating as request load exceeds processing capacity.",
            severity: "Warning",
            time: "Just now",
          },
          ...current.slice(0, 4),
        ]);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [simulationActive, avgLatency, baseLoad, queueDepth, throughput, utilization, requestRate, serviceRate, trafficSpike, packetLoss, failureTriggered]);

  const apiLatency = clamp(28 + avgLatency * 0.32 + (trafficSpike ? 4 : 0) + (failureTriggered ? 10 : 0), 22, 170);
  const authLatency = clamp(26 + avgLatency * 0.28 + (trafficSpike ? 5 : 0), 18, 140);
  const workerLatency = clamp(32 + avgLatency * 0.46 + (failureTriggered ? 22 : 0) + (activePreset === "retryStorm" ? 12 : 0), 26, 180);
  const dbLatency = clamp(38 + avgLatency * 0.34 + (failureTriggered ? 14 : 0), 28, 190);

  const services: ServiceHealth[] = useMemo(
    () => [
      {
        service: "api-gateway",
        status: failureTriggered || packetLoss ? "Degraded" : "Healthy",
        latency: `${apiLatency} ms`,
        saturation: clamp(utilization + 2, 28, 94),
        queueDepth: clamp(Math.round(queueDepth * 0.16 + (failureTriggered ? 4 : 0)), 1, 22),
      },
      {
        service: "auth-service",
        status: trafficSpike || failureTriggered ? "Degraded" : "Healthy",
        latency: `${authLatency} ms`,
        saturation: clamp(utilization - 6, 20, 88),
        queueDepth: clamp(Math.round(queueDepth * 0.18 + (failureTriggered ? 5 : 0)), 1, 24),
      },
      {
        service: "worker-service",
        status: failureTriggered ? "Critical" : "Degraded",
        latency: `${workerLatency} ms`,
        saturation: clamp(utilization + 10, 36, 99),
        queueDepth: clamp(Math.round(queueDepth * 0.28 + (failureTriggered ? 8 : 0)), 4, 34),
      },
      {
        service: "telemetry-agent",
        status: packetLoss ? "Degraded" : "Healthy",
        latency: `${clamp(18 + avgLatency * 0.24, 16, 120)} ms`,
        saturation: clamp(utilization - 4, 18, 82),
        queueDepth: clamp(Math.round(queueDepth * 0.1), 1, 12),
      },
      {
        service: "database",
        status: utilization > 88 || failureTriggered ? "Critical" : "Degraded",
        latency: `${dbLatency} ms`,
        saturation: clamp(utilization + 14, 45, 100),
        queueDepth: clamp(Math.round(queueDepth * 0.26 + (failureTriggered ? 7 : 0)), 6, 30),
      },
    ],
    [apiLatency, authLatency, workerLatency, dbLatency, failureTriggered, packetLoss, queueDepth, trafficSpike, utilization],
  );

  const propagationNodes = useMemo(
    () => ({
      apiGateway: {
        label: "api-gateway",
        status: (failureTriggered || packetLoss ? "Degraded" : "Healthy") as "Healthy" | "Degraded",
        latency: apiLatency,
        queueDepth: clamp(Math.round(queueDepth * 0.16 + (failureTriggered ? 5 : 0)), 1, 22),
      },
      authService: {
        label: "auth-service",
        status: (trafficSpike || failureTriggered ? "Degraded" : "Healthy") as "Healthy" | "Degraded",
        latency: authLatency,
        queueDepth: clamp(Math.round(queueDepth * 0.2 + (failureTriggered ? 6 : 0)), 2, 24),
      },
      workerService: {
        label: "worker-service",
        status: (failureTriggered ? "Critical" : "Degraded") as "Critical" | "Degraded",
        latency: workerLatency,
        queueDepth: clamp(Math.round(queueDepth * 0.3 + (failureTriggered ? 10 : 0)), 6, 34),
      },
      database: {
        label: "database",
        status: (utilization > 88 || failureTriggered ? "Critical" : "Degraded") as "Critical" | "Degraded",
        latency: dbLatency,
        queueDepth: clamp(Math.round(queueDepth * 0.26 + (failureTriggered ? 7 : 0)), 6, 30),
      },
    }),
    [apiLatency, authLatency, workerLatency, dbLatency, failureTriggered, packetLoss, queueDepth, trafficSpike, utilization],
  );

  const applyPreset = (presetKey: PresetKey) => {
    const preset = presets[presetKey];
    setActivePreset(presetKey);

    const duration = 500;
    const steps = 8;
    const fromRequestRate = requestRate;
    const fromServiceRate = serviceRate;
    const fromClients = clients;
    const fromQueueBias = queueBias;
    let step = 0;

    const interval = window.setInterval(() => {
      step += 1;
      const mix = step / steps;
      setRequestRate(Math.round(fromRequestRate + (preset.requestRate - fromRequestRate) * mix));
      setServiceRate(Math.round(fromServiceRate + (preset.serviceRate - fromServiceRate) * mix));
      setClients(Math.round(fromClients + (preset.clients - fromClients) * mix));
      setQueueBias(Math.round(fromQueueBias + (preset.queueBias - fromQueueBias) * mix));

      if (step >= steps) {
        window.clearInterval(interval);
        setPacketLoss(preset.packetLoss);
        setTrafficSpike(preset.trafficSpike);
        setFailureTriggered(preset.failureTriggered);
      }
    }, duration / steps);

    setIncidents((current) => [
      ...preset.incidents,
      ...current.slice(0, 3),
    ]);
  };

  const handleTriggerFailure = () => {
    if (!failureTriggered) {
      setFailureTriggered(true);
      setActivePreset("cascadingFailure");
      setIncidents((current) => [
        {
          title: "Throughput collapse risk",
          message: "A cascading failure condition was triggered on the service mesh.",
          severity: "Critical",
          time: "Just now",
        },
        ...current,
      ]);
    }
  };

  const handleReset = () => {
    setRequestRate(220);
    setServiceRate(260);
    setClients(24);
    setTrafficSpike(false);
    setPacketLoss(false);
    setSimulationActive(true);
    setFailureTriggered(false);
    setActivePreset("stable");
    setQueueBias(presets.stable.queueBias);
    setIncidents(initialIncidents);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-[36px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Interactive Distributed Service Performance Simulator</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Cloud-native observability for simulated service degradation.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 lg:text-lg">
                Realtime distributed service degradation and latency observability simulator with streaming metrics, service health, and incident monitoring.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-950/80 px-5 py-4 text-slate-200 shadow-lg shadow-slate-950/30 ring-1 ring-white/10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
                <Cloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Live session</p>
                <p className="mt-1 text-lg font-semibold text-white">Streaming metrics enabled</p>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <ControlPanel
              activePreset={activePreset}
              requestRate={requestRate}
              serviceRate={serviceRate}
              clients={clients}
              trafficSpike={trafficSpike}
              packetLoss={packetLoss}
              simulationActive={simulationActive}
              onPresetSelect={applyPreset}
              onRequestRateChange={setRequestRate}
              onServiceRateChange={setServiceRate}
              onClientsChange={setClients}
              onToggleTrafficSpike={() => setTrafficSpike((value) => !value)}
              onTogglePacketLoss={() => setPacketLoss((value) => !value)}
              onTriggerFailure={handleTriggerFailure}
              onStartSimulation={() => setSimulationActive((value) => !value)}
              onReset={handleReset}
            />

            <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Service health</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Endpoint status overview</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                  <Activity className="h-4 w-4 text-emerald-300" />
                  monitored
                </div>
              </div>
              <div className="space-y-4">
                {services.map((service) => (
                  <ServiceCard key={service.service} {...service} />
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <FailurePropagation nodes={propagationNodes} active={failureTriggered || queueDepth > 75} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.slice(0, 6).map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <LatencyChart
                title="Latency over time"
                description="Measured request latency trends across simulated services."
                data={chartData.latency}
                dataKey="latency"
                color="#38bdf8"
              />
              <LatencyChart
                title="Queue buildup"
                description="Queued requests accumulating under pressure."
                data={chartData.queue}
                dataKey="queueDepth"
                color="#f59e0b"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <LatencyChart
                title="Throughput degradation"
                description="Processing throughput reacting to load and packet loss."
                data={chartData.throughput}
                dataKey="throughput"
                color="#4ade80"
              />
              <LatencyChart
                title="Utilization trends"
                description="Compute saturation across the service mesh."
                data={chartData.utilization}
                dataKey="utilization"
                color="#a78bfa"
              />
            </div>

            <IncidentFeed events={incidents} />
          </div>
        </section>
      </div>
    </main>
  );
}

