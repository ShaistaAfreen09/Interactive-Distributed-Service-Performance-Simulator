"use client";

import { motion } from "framer-motion";

type NodeState = {
  label: string;
  status: "Healthy" | "Degraded" | "Critical";
  latency: number;
  queueDepth: number;
};

type FailurePropagationProps = {
  nodes: {
    apiGateway: NodeState;
    authService: NodeState;
    workerService: NodeState;
    database: NodeState;
  };
  active: boolean;
};

const statusStyle = {
  Healthy: "bg-emerald-500/10 border-emerald-400/20 text-emerald-300",
  Degraded: "bg-amber-500/10 border-amber-400/20 text-amber-300",
  Critical: "bg-rose-500/10 border-rose-400/20 text-rose-300",
};

const pulseMotion = {
  hidden: { strokeDashoffset: 0 },
  visible: {
    strokeDashoffset: [0, -12, -24],
    transition: { repeat: Infinity, duration: 1.6, ease: "linear" as const },
  },
};

export function FailurePropagation({ nodes, active }: FailurePropagationProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-slate-950/20"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Failure propagation</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Dependency chain status</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
          <span className={active ? "inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" : "inline-flex h-2.5 w-2.5 rounded-full bg-slate-600"} />
          {active ? "propagation active" : "stable"}
        </div>
      </div>

      <div className="relative grid gap-6 md:grid-cols-4">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[nodes.apiGateway.status]}`}>
            {nodes.apiGateway.status}
          </div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-400">api-gateway</p>
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-white">{nodes.apiGateway.latency} ms</p>
            <p className="text-sm text-slate-400">Queue depth {nodes.apiGateway.queueDepth}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[nodes.authService.status]}`}>
            {nodes.authService.status}
          </div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-400">auth-service</p>
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-white">{nodes.authService.latency} ms</p>
            <p className="text-sm text-slate-400">Queue depth {nodes.authService.queueDepth}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[nodes.workerService.status]}`}>
            {nodes.workerService.status}
          </div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-400">worker-service</p>
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-white">{nodes.workerService.latency} ms</p>
            <p className="text-sm text-slate-400">Queue depth {nodes.workerService.queueDepth}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[nodes.database.status]}`}>
            {nodes.database.status}
          </div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-400">database</p>
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-white">{nodes.database.latency} ms</p>
            <p className="text-sm text-slate-400">Queue depth {nodes.database.queueDepth}</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <svg viewBox="0 0 1000 220" className="h-full w-full opacity-70" preserveAspectRatio="none">
          <defs>
            <linearGradient id="propLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 120 86 H 280"
            stroke="url(#propLine)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 10"
            animate={active ? "visible" : "hidden"}
            variants={pulseMotion}
          />
          <motion.path
            d="M 380 86 H 540"
            stroke="url(#propLine)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 10"
            animate={active ? "visible" : "hidden"}
            variants={pulseMotion}
          />
          <motion.path
            d="M 640 86 H 800"
            stroke="url(#propLine)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 10"
            animate={active ? "visible" : "hidden"}
            variants={pulseMotion}
          />
        </svg>
      </div>
    </motion.section>
  );
}
