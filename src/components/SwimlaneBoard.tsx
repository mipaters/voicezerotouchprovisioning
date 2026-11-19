import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { StepStatus } from "../types";
import { scenario } from "../engine/useScenarioPlayer";
import { CARD_H, CARD_W, StepCard, laneIndex } from "./StepCard";

const LABEL_W = 128;
const COL_W = 212;
const LANE_H = 112;

function pos(stepId: string) {
  const s = scenario.steps.find((x) => x.id === stepId)!;
  return {
    x: LABEL_W + s.col * COL_W + (COL_W - CARD_W) / 2,
    y: laneIndex(s.lane) * LANE_H + (LANE_H - CARD_H) / 2,
  };
}

export function SwimlaneBoard({
  stepStatus,
  activeStepId,
}: {
  stepStatus: Record<string, StepStatus>;
  activeStepId: string | null;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const ordered = [...scenario.steps].sort((a, b) => a.col - b.col);
  const maxCol = Math.max(...scenario.steps.map((s) => s.col));
  const width = LABEL_W + (maxCol + 1) * COL_W;
  const height = scenario.lanes.length * LANE_H;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (!activeStepId) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    const p = pos(activeStepId);
    el.scrollTo({ left: Math.max(0, p.x - el.clientWidth / 2 + CARD_W / 2), behavior: "smooth" });
  }, [activeStepId]);

  return (
    <div ref={scroller} className="thin-scroll relative h-full overflow-auto">
      <div className="relative" style={{ width, height }}>
        {scenario.lanes.map((l, i) => (
          <div
            key={l.id}
            className={`absolute left-0 right-0 border-b border-white/10 ${i % 2 ? "bg-white/[0.02]" : "bg-transparent"}`}
            style={{ top: i * LANE_H, height: LANE_H, width }}
          >
            <div className="sticky left-0 z-20 flex h-full w-[128px] flex-col justify-center border-r border-white/10 bg-navy-900 px-3">
              <div className="text-[12px] font-bold text-white">{l.label}</div>
              {l.sub && <div className="text-[10px] text-sky-300/70">{l.sub}</div>}
            </div>
          </div>
        ))}
        <svg className="pointer-events-none absolute left-0 top-0" width={width} height={height}>
          {ordered.slice(0, -1).map((s, i) => {
            const n = ordered[i + 1];
            const a = pos(s.id);
            const b = pos(n.id);
            const x1 = a.x + CARD_W;
            const y1 = a.y + CARD_H / 2;
            const x2 = b.x;
            const y2 = b.y + CARD_H / 2;
            const d = `M ${x1} ${y1} C ${x1 + 36} ${y1}, ${x2 - 36} ${y2}, ${x2} ${y2}`;
            const st = stepStatus[n.id] ?? "pending";
            return (
              <g key={s.id + n.id}>
                <path d={d} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="3 4" />
                {st !== "pending" && (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={st === "running" ? "#0099D8" : "#34d399"}
                    strokeWidth={2.2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                    className={st === "running" ? "flow-line" : ""}
                    style={st === "running" ? undefined : { strokeDasharray: "none" }}
                  />
                )}
                <polygon
                  points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`}
                  fill={st === "pending" ? "rgba(255,255,255,0.25)" : st === "running" ? "#0099D8" : "#34d399"}
                />
              </g>
            );
          })}
        </svg>
        {scenario.steps.map((s) => {
          const p = pos(s.id);
          return <StepCard key={s.id} step={s} status={stepStatus[s.id] ?? "pending"} x={p.x} y={p.y} />;
        })}
      </div>
    </div>
  );
}
