import { Briefcase, Pause, Play, Presentation, RotateCcw, SkipForward, Sparkles, History } from "lucide-react";
import { useEffect, useState } from "react";
import { scenario, type PlayerState } from "../engine/useScenarioPlayer";

function useSmooth(target: number): number {
  const [v, setV] = useState(target);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setV((cur) => {
        const d = target - cur;
        if (Math.abs(d) < 0.5) return target;
        raf = requestAnimationFrame(tick);
        return cur + d * 0.12;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function fmt(sec: number) {
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function TopBar({
  p,
  legacy,
  notes,
  onLegacy,
  onNotes,
  onExec,
}: {
  p: PlayerState;
  legacy: boolean;
  notes: boolean;
  onLegacy: () => void;
  onNotes: () => void;
  onExec: () => void;
}) {
  const cust = useSmooth(p.customerSeconds);
  const days = useSmooth(p.progress * scenario.meta.legacyDays * 10) / 10;

  const btn = "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition hover:bg-white/15";
  return (
    <div className="flex h-14 shrink-0 items-center gap-4 border-b border-white/10 bg-navy px-4">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-spectrum">Spectrum Business</div>
        <div className="truncate text-sm font-bold text-white">{scenario.meta.title}</div>
      </div>

      <div className="ml-2 flex items-center gap-3">
        <div className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-0.5 text-center">
          <div className="text-[9px] uppercase tracking-wide text-emerald-300">Customer time</div>
          <div className="font-mono text-base font-bold leading-tight text-emerald-200">{fmt(cust)}</div>
        </div>
        <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-0.5 text-center">
          <div className="text-[9px] uppercase tracking-wide text-red-300">Legacy time (est.)</div>
          <div className="font-mono text-base font-bold leading-tight text-red-200">~{days.toFixed(1)} days</div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button className={`${btn} ${p.playing ? "bg-white/15" : "bg-spectrum text-white"}`} onClick={p.toggle} title="Space">
          {p.playing ? <Pause size={14} /> : <Play size={14} />} {p.playing ? "Pause" : p.done ? "Replay" : "Play"}
        </button>
        <button className={btn} onClick={p.step} title="→">
          <SkipForward size={14} /> Step
        </button>
        <div className="mx-1 flex overflow-hidden rounded-md border border-white/15">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => p.setSpeed(s)}
              className={`px-2 py-1.5 text-xs font-medium ${p.speed === s ? "bg-white text-navy" : "text-white/70 hover:bg-white/10"}`}
            >
              {s}x
            </button>
          ))}
        </div>
        <button className={btn} onClick={p.reset} title="R">
          <RotateCcw size={14} /> Reset
        </button>
        <button className={`${btn} ${legacy ? "bg-red-500/30 text-red-100" : ""}`} onClick={onLegacy} title="L">
          <History size={14} /> Show legacy process
        </button>
        <button className={`${btn} ${notes ? "bg-amber-400/30 text-amber-100" : ""}`} onClick={onNotes} title="N">
          <Presentation size={14} /> Notes
        </button>
        <button className={`${btn} bg-white/10`} onClick={onExec} title="E">
          <Briefcase size={14} /> Exec walkthrough
        </button>
        {p.liveAiAvailable && (
          <button className={`${btn} ${p.liveAi ? "bg-purple-500/40" : ""}`} onClick={() => p.setLiveAi(!p.liveAi)}>
            <Sparkles size={14} /> Live AI {p.liveAi ? "on" : "off"}
          </button>
        )}
      </div>
    </div>
  );
}
