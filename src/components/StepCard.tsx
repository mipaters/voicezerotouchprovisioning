import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { Step, StepStatus } from "../types";
import { scenario } from "../engine/useScenarioPlayer";
import { AgentAvatar } from "./AgentAvatar";

export const CARD_W = 188;
export const CARD_H = 94;

export function StepCard({ step, status, x, y }: { step: Step; status: StepStatus; x: number; y: number }) {
  const running = status === "running";
  const done = status === "done";
  return (
    <motion.div
      data-step={step.id}
      className={`absolute overflow-hidden rounded-lg border p-2 ${
        done
          ? "border-emerald-400/70 bg-emerald-500/10"
          : running
            ? "border-spectrum bg-spectrum/15 shadow-[0_0_18px_rgba(0,153,216,0.55)]"
            : "border-white/10 bg-white/[0.03]"
      }`}
      style={{ left: x, top: y, width: CARD_W, height: CARD_H }}
      animate={{ opacity: status === "pending" ? 0.55 : 1, scale: running ? 1.03 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-1.5">
        <div className="flex -space-x-1.5">
          <AgentAvatar id={step.agent} size={22} active={running} />
          {step.coAgent && <AgentAvatar id={step.coAgent} size={22} active={running} />}
        </div>
        <div className="min-w-0 flex-1 text-[11px] font-semibold leading-tight text-white">{step.title}</div>
        <div className="mt-0.5 shrink-0">
          {running && <Loader2 size={15} className="animate-spin text-spectrum" />}
          {done && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
              <Check size={11} className="text-white" strokeWidth={3} />
            </motion.span>
          )}
          {status === "pending" && <span className="block h-3.5 w-3.5 rounded-full border border-white/25" />}
        </div>
      </div>
      <div className="mt-1 truncate text-[9px] text-sky-200/80">{step.systems.join(" · ")}</div>
      <div
        className={`mt-1 rounded px-1 py-0.5 text-[9px] leading-tight ${
          done ? "bg-red-500/10 text-red-300/60 line-through" : "bg-red-500/20 text-red-300"
        }`}
      >
        Today: {step.today}
      </div>
    </motion.div>
  );
}

export function laneIndex(id: string): number {
  return scenario.lanes.findIndex((l) => l.id === id);
}
