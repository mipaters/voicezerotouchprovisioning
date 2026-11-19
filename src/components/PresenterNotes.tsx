import { AnimatePresence, motion } from "framer-motion";
import { Presentation } from "lucide-react";
import { scenario } from "../engine/useScenarioPlayer";

export function PresenterNotes({ open, phaseId }: { open: boolean; phaseId: string }) {
  const phase = scenario.phases.find((p) => p.id === phaseId) ?? scenario.phases[0];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          className="absolute bottom-3 right-3 z-20 w-80 rounded-xl border border-amber-300/50 bg-[#2a2200]/95 p-3 shadow-2xl"
        >
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-300">
            <Presentation size={13} /> Presenter notes
          </div>
          <div className="mb-1 text-sm font-semibold text-white">{phase.title}</div>
          <ul className="list-disc space-y-1 pl-4 text-[12px] leading-snug text-amber-50/90">
            {phase.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
