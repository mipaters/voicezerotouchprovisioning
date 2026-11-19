import { CheckCircle2, ExternalLink, Lock } from "lucide-react";
import type { Widget } from "../types";

type W = Extract<Widget, { kind: "secureLink" }>;

export function SecureLinkCard({ widget, done }: { widget: W; done: boolean }) {
  return (
    <div className="mt-1 overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-navy px-3 py-2 text-white">
        <Lock size={14} className="text-spectrum" />
        <div>
          <div className="text-[13px] font-semibold leading-tight">{widget.title}</div>
          <div className="text-[10px] text-white/70">{widget.subtitle}</div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="truncate text-[11px] text-[#027EB5] underline">{widget.url}</div>
        <div className="mt-1 text-[10px] text-gray-500">{widget.amount}</div>
        <div
          className={`mt-2 flex items-center justify-center gap-1 rounded-md py-1.5 text-[12px] font-medium ${
            done ? "bg-green-100 text-green-700" : "bg-spectrum text-white"
          }`}
        >
          {done ? (
            <>
              <CheckCircle2 size={13} /> Payment method saved
            </>
          ) : (
            <>
              <ExternalLink size={13} /> Open secure checkout
            </>
          )}
        </div>
      </div>
    </div>
  );
}
