"use client";

import { motion } from "framer-motion";
import { ArrowRight, BatteryCharging, HardDrive, ShieldAlert, Sparkles, Zap } from "lucide-react";

type PresetKey = "stable" | "burst" | "retryStorm" | "cascadingFailure" | "saturatedPool";

type ControlPanelProps = {
  activePreset: PresetKey;
  requestRate: number;
  serviceRate: number;
  clients: number;
  trafficSpike: boolean;
  packetLoss: boolean;
  simulationActive: boolean;
  onPresetSelect: (preset: PresetKey) => void;
  onRequestRateChange: (value: number) => void;
  onServiceRateChange: (value: number) => void;
  onClientsChange: (value: number) => void;
  onToggleTrafficSpike: () => void;
  onTogglePacketLoss: () => void;
  onTriggerFailure: () => void;
  onStartSimulation: () => void;
  onReset: () => void;
};

const presetButtons: { id: PresetKey; label: string }[] = [
  { id: "stable", label: "Stable Traffic" },
  { id: "burst", label: "Burst Traffic" },
  { id: "retryStorm", label: "Retry Storm" },
  { id: "cascadingFailure", label: "Cascading Failure" },
  { id: "saturatedPool", label: "Saturated Worker Pool" },
];

export function ControlPanel({
  activePreset,
  requestRate,
  serviceRate,
  clients,
  trafficSpike,
  packetLoss,
  simulationActive,
  onPresetSelect,
  onRequestRateChange,
  onServiceRateChange,
  onClientsChange,
  onToggleTrafficSpike,
  onTogglePacketLoss,
  onTriggerFailure,
  onStartSimulation,
  onReset,
}: ControlPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
    >
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Control panel</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Simulation inputs</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Tune the request flow, manage traffic behavior, and exercise failure scenarios with realtime controls.
        </p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        {presetButtons.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onPresetSelect(preset.id)}
            className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
              activePreset === preset.id
                ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-200"
                : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-3xl bg-slate-950/70 p-5">
          <label className="block text-sm font-medium text-slate-300">Request rate</label>
          <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
            <span>{requestRate} req/s</span>
            <span>Rate of incoming requests</span>
          </div>
          <input
            type="range"
            min={50}
            max={600}
            value={requestRate}
            onChange={(event) => onRequestRateChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
          />
        </div>

        <div className="space-y-4 rounded-3xl bg-slate-950/70 p-5">
          <label className="block text-sm font-medium text-slate-300">Service rate</label>
          <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
            <span>{serviceRate} req/s</span>
            <span>Processing capacity</span>
          </div>
          <input
            type="range"
            min={60}
            max={700}
            value={serviceRate}
            onChange={(event) => onServiceRateChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-sky-400"
          />
        </div>

        <div className="space-y-4 rounded-3xl bg-slate-950/70 p-5">
          <label className="block text-sm font-medium text-slate-300">Concurrent clients</label>
          <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
            <span>{clients}</span>
            <span>Active workers in flight</span>
          </div>
          <input
            type="range"
            min={4}
            max={80}
            value={clients}
            onChange={(event) => onClientsChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-violet-400"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onToggleTrafficSpike}
            className={`inline-flex items-center justify-center gap-2 rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
              trafficSpike
                ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                : "border-white/10 bg-white/5 text-slate-200"
            }`}
          >
            <Zap className="h-4 w-4" />
            Traffic spike
          </button>
          <button
            type="button"
            onClick={onTogglePacketLoss}
            className={`inline-flex items-center justify-center gap-2 rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
              packetLoss
                ? "border-rose-400/25 bg-rose-500/10 text-rose-200"
                : "border-white/10 bg-white/5 text-slate-200"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Packet loss
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <motion.button
            whileHover={{ y: -2 }}
            onClick={onTriggerFailure}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
          >
            <Sparkles className="h-4 w-4" />
            Trigger failure
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            onClick={onStartSimulation}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25"
          >
            <BatteryCharging className="h-4 w-4" />
            {simulationActive ? "Pause" : "Start"}
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            onClick={onReset}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Reset
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
