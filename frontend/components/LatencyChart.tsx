"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { motion } from "framer-motion";

type LatencyChartProps = {
  title: string;
  description: string;
  data: Array<Record<string, number | string>>;
  dataKey: string;
  color: string;
};

function ChartTooltip(props: any) {
  const { active, payload } = props;
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0].value;
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 text-sm text-white shadow-lg shadow-slate-950/20">
      <p className="font-semibold">{payload[0].name}</p>
      <p className="mt-1 text-slate-300">{value}</p>
    </div>
  );
}

export function LatencyChart({ title, description, data, dataKey, color }: LatencyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-slate-950/20"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <p className="mt-2 text-lg font-semibold text-white">{description}</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 8" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#gradient-${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
