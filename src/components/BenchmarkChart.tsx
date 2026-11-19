import { motion } from "framer-motion";

const BARS = [
  { label: "Large enterprise (today)", value: 180, text: "≈ 6 months", color: "#ef4444" },
  { label: "RingCentral", value: 14, text: "≈ 14 days", color: "#f59e0b" },
  { label: "Cox", value: 10, text: "More automation, less bureaucratic", color: "#a3a3a3", qualitative: true },
  { label: "Spectrum agentic", value: 0.6, text: "Same-day order · activation on the customer's chosen date", color: "#34d399" },
];

export function BenchmarkChart() {
  const max = 180;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-white">Time from order to live service</h3>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/60">Workshop estimates</span>
      </div>
      <div className="space-y-3">
        {BARS.map((b, i) => (
          <div key={b.label}>
            <div className="mb-0.5 flex justify-between text-[11px] text-white/80">
              <span>{b.label}</span>
              <span className="text-white/60">{b.text}</span>
            </div>
            <div className="h-5 overflow-hidden rounded bg-white/5">
              <motion.div
                className="h-full rounded"
                style={{
                  background: b.qualitative
                    ? `repeating-linear-gradient(45deg, ${b.color}, ${b.color} 6px, #737373 6px, #737373 12px)`
                    : b.color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(1.5, (b.value / max) * 100)}%` }}
                transition={{ duration: 1, delay: i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-white/40">Bar lengths are indicative; Cox is positioned qualitatively. Not measured data.</div>
    </div>
  );
}
