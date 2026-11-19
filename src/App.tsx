import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useScenarioPlayer } from "./engine/useScenarioPlayer";
import { TopBar } from "./components/TopBar";
import { PhoneMockup } from "./components/PhoneMockup";
import { SwimlaneBoard } from "./components/SwimlaneBoard";
import { EventLog } from "./components/EventLog";
import { LegacyView } from "./components/LegacyView";
import { SummaryKPIs } from "./components/SummaryKPIs";
import { PresenterNotes } from "./components/PresenterNotes";

export default function App() {
  const p = useScenarioPlayer();
  const [legacy, setLegacy] = useState(false);
  const [notes, setNotes] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);

  useEffect(() => {
    if (p.kpiShown) setSummaryOpen(true);
  }, [p.kpiShown]);

  const { toggle, step, reset } = p;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === " ") {
        e.preventDefault();
        toggle();
      } else if (k === "arrowright") step();
      else if (k === "r") reset();
      else if (k === "l") setLegacy((v) => !v);
      else if (k === "n") setNotes((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, step, reset]);

  return (
    <div className="flex h-full flex-col bg-navy-900">
      <TopBar p={p} legacy={legacy} notes={notes} onLegacy={() => setLegacy((v) => !v)} onNotes={() => setNotes((v) => !v)} />
      <div className="h-1 bg-white/5">
        <div className="h-full bg-spectrum transition-all duration-500" style={{ width: `${(p.index / p.total) * 100}%` }} />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[40%] min-w-0 items-center justify-center bg-gradient-to-b from-[#0a2540] to-[#001a33] p-3">
          <PhoneMockup messages={p.messages} typing={p.typing} checked={p.checked} />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col border-l border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 bg-navy/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200">
            {legacy ? "Today: current-state process" : "Behind the scenes · agentic back office"}
            {p.kpiShown && !summaryOpen && !legacy && (
              <button onClick={() => setSummaryOpen(true)} className="ml-auto flex items-center gap-1 rounded bg-spectrum px-2 py-0.5 text-[11px] normal-case text-white">
                <BarChart3 size={12} /> Show summary
              </button>
            )}
          </div>
          <div className="relative min-h-0 flex-[3]">
            {legacy ? <LegacyView /> : <SwimlaneBoard stepStatus={p.stepStatus} activeStepId={p.activeStepId} />}
            {p.kpiShown && summaryOpen && !legacy && <SummaryKPIs onClose={() => setSummaryOpen(false)} />}
            <PresenterNotes open={notes} phaseId={p.phaseId} />
          </div>
          <div className="min-h-0 flex-[1.1]">
            <EventLog logs={p.logs} />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-navy-900 px-4 py-1 text-center text-[10px] text-white/50">
        Demo — simulated data. Not a production system. · Illustrative demo pricing · Space play/pause · → step · R reset · L legacy · N notes
      </div>
    </div>
  );
}
