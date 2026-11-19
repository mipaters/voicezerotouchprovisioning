import { useEffect, useRef } from "react";
import { AlertTriangle, ShieldCheck, Terminal } from "lucide-react";
import type { LogLine } from "../types";
import { scenario } from "../engine/useScenarioPlayer";

export function EventLog({ logs }: { logs: LogLine[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="flex h-full flex-col border-t border-white/10 bg-[#00101f]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-300/80">
        <Terminal size={12} /> Agent trace
        <span className="ml-auto font-normal normal-case text-white/40">{logs.length} events</span>
      </div>
      <div ref={ref} className="thin-scroll flex-1 overflow-y-auto px-3 py-1 font-mono text-[12px] leading-5">
        {logs.length === 0 && <div className="text-white/30">Waiting for the first event… press Play.</div>}
        {logs.map((l) => {
          if (l.callout) {
            const ok = l.callout === "success";
            return (
              <div
                key={l.index}
                className={`my-1 flex items-center gap-2 rounded border px-2 py-1 font-sans text-[12px] font-semibold ${
                  ok ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200" : "border-amber-400/60 bg-amber-500/15 text-amber-200"
                }`}
              >
                {ok ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                {l.text}
              </div>
            );
          }
          const agent = l.agent ? scenario.agents[l.agent] : undefined;
          return (
            <div key={l.index} className={`flex gap-2 ${l.level === "warn" ? "text-amber-300" : "text-emerald-100/90"}`}>
              <span style={{ color: agent?.color }} className="shrink-0">
                [{agent?.name ?? "System"}]
              </span>
              <span className="min-w-0 flex-1">{l.text}</span>
              {l.system && <span className="shrink-0 rounded bg-sky-500/15 px-1 text-sky-300">{l.system}</span>}
              {l.latencyMs !== undefined && <span className="w-14 shrink-0 text-right text-white/40">{l.latencyMs}ms</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
