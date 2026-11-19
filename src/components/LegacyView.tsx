import { motion } from "framer-motion";
import { ArrowRight, CornerDownLeft, Truck } from "lucide-react";
import { BenchmarkChart } from "./BenchmarkChart";

const FLOW = [
  { label: "Intake", team: "Call centre", note: "Customer must phone in; hold times" },
  { label: "Data entry", sub: "Salesforce", team: "Billing", note: "Manual keying; SMB vs Enterprise not prioritized" },
  { label: "Data entry", sub: "Many systems", team: "Order of Ops", note: "Same data re-keyed 6+ times" },
  { label: "Manually provision", sub: "BroadWorks", team: "Enterprise Ops", note: "Ticket queue; no priority" },
  { label: "Scheduling verification", team: "Scheduling", note: "Phone tag to confirm the date" },
];

export function LegacyView() {
  return (
    <div className="thin-scroll h-full space-y-4 overflow-auto p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold text-white">Today: the current-state process</h2>
        <span className="text-[11px] text-red-300">6 teams · 5 handoffs · 6+ systems touched by humans</span>
      </div>

      <div className="flex flex-wrap items-stretch gap-2">
        {FLOW.map((f, i) => (
          <motion.div
            key={f.label + i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-2"
          >
            <div className="relative w-40 rounded-lg border border-white/15 bg-white/5 p-2">
              <div className="text-[10px] uppercase tracking-wide text-sky-300/70">{f.team}</div>
              <div className="text-[12px] font-semibold text-white">{f.label}</div>
              {f.sub && <div className="text-[10px] text-white/60">{f.sub}</div>}
              <div
                className="mt-2 -rotate-1 rounded-sm bg-yellow-200 p-1.5 text-[10px] leading-tight text-red-700 shadow-md"
                style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
              >
                {f.note}
              </div>
            </div>
            <ArrowRight size={16} className="text-white/40" />
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col gap-1">
          <div className="w-44 rounded-lg border border-amber-400/60 bg-amber-500/10 p-2 text-[12px] font-semibold text-amber-200">
            Phone call to customer reached?
          </div>
          <div className="flex items-center gap-1 text-[11px] text-red-300">
            <CornerDownLeft size={13} /> No → loop back to scheduling verification
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-300">
            <Truck size={13} /> Yes → Truck roll (always)
          </div>
          <div className="mt-1 -rotate-1 rounded-sm bg-yellow-200 p-1.5 text-[10px] text-red-700 shadow-md">
            Missed essential = upset customer + call into care
          </div>
        </motion.div>
      </div>

      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/60">Elapsed time, legacy order (workshop estimate)</div>
        <div className="flex h-6 overflow-hidden rounded text-[10px] font-medium text-white">
          {[
            ["Intake + entry", 20, "#ef4444"],
            ["Provisioning queue", 35, "#f97316"],
            ["Scheduling loops", 30, "#f59e0b"],
            ["Truck roll", 15, "#dc2626"],
          ].map(([l, w, c]) => (
            <motion.div
              key={l as string}
              initial={{ width: 0 }}
              animate={{ width: `${w}%` }}
              transition={{ duration: 1 }}
              className="flex items-center justify-center overflow-hidden whitespace-nowrap"
              style={{ background: c as string }}
            >
              {l}
            </motion.div>
          ))}
        </div>
      </div>

      <BenchmarkChart />
    </div>
  );
}
