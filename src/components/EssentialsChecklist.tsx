import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { scenario } from "../engine/useScenarioPlayer";

export function EssentialsChecklist({ checked }: { checked: Set<string> }) {
  const count = checked.size;
  return (
    <div className="border-b border-black/10 bg-[#F0F2F5] px-2 py-1.5">
      <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        <span>The Essentials</span>
        <span className={count === scenario.essentials.length ? "text-green-600" : ""}>
          {count}/{scenario.essentials.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {scenario.essentials.map((e) => {
          const on = checked.has(e.id);
          return (
            <motion.span
              key={e.id}
              animate={{ scale: on ? [1, 1.15, 1] : 1 }}
              className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${
                on ? "border-green-500 bg-green-100 text-green-700" : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {on && <Check size={10} />}
              {e.label}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
