import { Check, List } from "lucide-react";
import type { Widget } from "../types";

type ListW = Extract<Widget, { kind: "list" }>;

export function ListMessage({ widget, selectedId }: { widget: ListW; selectedId?: string }) {
  return (
    <div className="mt-1 overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="divide-y divide-gray-100">
        {widget.items.map((it) => {
          const sel = selectedId === it.id;
          return (
            <div key={it.id} className={`flex items-start gap-2 px-3 py-2 ${sel ? "bg-wa-bubble/70" : ""}`}>
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  sel ? "border-wa-teal bg-wa-teal text-white" : "border-gray-300"
                }`}
              >
                {sel && <Check size={10} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2 text-[13px] font-semibold text-gray-800">
                  <span>{it.title}</span>
                  <span className="text-wa-teal">{it.price}</span>
                </div>
                <div className="text-[11px] leading-tight text-gray-500">{it.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      {widget.footnote && <div className="px-3 pb-1 text-[10px] italic text-gray-400">{widget.footnote}</div>}
      <div className="flex items-center justify-center gap-1 border-t border-gray-100 py-2 text-[13px] font-medium text-[#027EB5]">
        <List size={14} /> {widget.button}
      </div>
    </div>
  );
}
