"use client";

import { motion } from "framer-motion";

type ServiceCardProps = {
  service: string;
  status: "Healthy" | "Degraded" | "Critical";
  latency: string;
  saturation: number;
  queueDepth: number;
};

const statusMap = {
  Healthy: { label: "Healthy", color: "bg-emerald-500/15 text-emerald-300" },
  Degraded: { label: "Degraded", color: "bg-amber-500/15 text-amber-300" },
  Critical: { label: "Critical", color: "bg-rose-500/15 text-rose-300" },
};

export function ServiceCard({ service, status, latency, saturation, queueDepth }: ServiceCardProps) {
  const statusStyle = statusMap[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[26px] border border-white/10 bg-slate-900/85 p-5 shadow shadow-slate-950/20"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{service}</p>
          <p className="mt-2 text-xl font-semibold text-white">{latency}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.color}`}>
          {statusStyle.label}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Saturation</span>
            <span>{saturation}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/5">
            <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${saturation}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Queue depth</span>
          <span>{queueDepth}</span>
        </div>
      </div>
    </motion.div>
  );
}
