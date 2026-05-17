"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Activity, Sparkles } from "lucide-react";

type IncidentEvent = {
  title: string;
  message: string;
  severity: "Critical" | "Warning" | "Info";
  time: string;
};

type IncidentFeedProps = {
  events: IncidentEvent[];
};

const severityStyle = {
  Critical: "bg-rose-500/15 text-rose-300",
  Warning: "bg-amber-500/15 text-amber-300",
  Info: "bg-sky-500/15 text-sky-300",
};

export function IncidentFeed({ events }: IncidentFeedProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
    >
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Incident feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Active alerts and service signals</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-300">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
          Realtime stream
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={`${event.title}-${index}`} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{event.message}</p>
              </div>
              <div className="space-y-2 text-right">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityStyle[event.severity]}`}>
                  {event.severity}
                </span>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
