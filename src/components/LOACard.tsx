import { CheckCircle2, FileSignature } from "lucide-react";
import type { Widget } from "../types";

type W = Extract<Widget, { kind: "loa" }>;

export function LOACard({ widget, signed }: { widget: W; signed: boolean }) {
  return (
    <div className="mt-1 overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
        <FileSignature size={18} className="text-wa-teal" />
        <div>
          <div className="text-[13px] font-semibold leading-tight text-gray-800">Letter of Authorization</div>
          <div className="text-[10px] text-gray-500">Port numbers from {widget.carrier}</div>
        </div>
      </div>
      <div className="px-3 py-2 text-[11px] text-gray-600">
        {widget.numbers.map((n) => (
          <div key={n} className="font-mono">
            {n}
          </div>
        ))}
        <div
          className={`mt-2 flex items-center justify-center gap-1 rounded-md py-1.5 text-[12px] font-medium ${
            signed ? "bg-green-100 text-green-700" : "bg-spectrum text-white"
          }`}
        >
          {signed ? (
            <>
              <CheckCircle2 size={13} /> Signed by Maria Alvarez
            </>
          ) : (
            "Review & e-sign"
          )}
        </div>
      </div>
    </div>
  );
}
