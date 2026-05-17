"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  caption: string;
};

export function MetricCard({ title, value, delta, trend, caption }: MetricCardProps) {
  const positive = trend === "up";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium ${
            positive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
          }`}
        >
          {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {delta}
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">{caption}</p>
    </motion.article>
  );
}
