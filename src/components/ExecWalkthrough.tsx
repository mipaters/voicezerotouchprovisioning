import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { scenario } from "../engine/useScenarioPlayer";
import { AGENT_PROFILES, DECISIONS, GUARDRAILS, LAYERS, ROADMAP } from "../data/walkthrough";
import { AgentAvatar } from "./AgentAvatar";
import { BenchmarkChart } from "./BenchmarkChart";

const TITLES = ["Executive summary", "Agent review", "Proposed architecture", "Guardrails & governance", "Roadmap & decisions"];

const AUTONOMY_STYLE: Record<string, string> = {
  Autonomous: "bg-emerald-500/20 text-emerald-300",
  "Autonomous + guardrail": "bg-sky-500/20 text-sky-300",
  "Human approval on exception": "bg-amber-500/20 text-amber-300",
};

function Summary() {
  const cols = [
    { h: "Today", c: "border-red-400/40 bg-red-500/10", pts: ["Customer calls a call centre", "Same data re-keyed across 6+ systems", "5 handoffs across 6 teams", "Phone tag for scheduling; a truck is always rolled", "Missed essentials become care calls"] },
    { h: "With agents", c: "border-spectrum/50 bg-spectrum/10", pts: ["Customer orders on WhatsApp, no call", "Agents profile, port, provision and schedule as one flow", "0 handoffs, 0 human system touches in the happy path", "Self-install decided from CPE data", "Quality Agent gates every order"] },
    { h: "What it means", c: "border-emerald-400/40 bg-emerald-500/10", pts: ["Same-day order, activation on the customer's chosen date", "Lower cost to serve and fewer care calls", "Consistent, compliant orders first time", "Humans focus on exceptions", "Reusable agent platform for other products"] },
  ];
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm text-white/80">
        A small-business customer orders Spectrum Business Voice entirely over WhatsApp. A team of specialist AI agents
        handles intake, provisioning and activation as one continuous flow, replacing a manual process spread across
        many systems, callbacks and a truck roll.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((c) => (
          <div key={c.h} className={`rounded-xl border p-4 ${c.c}`}>
            <div className="mb-2 text-sm font-bold text-white">{c.h}</div>
            <ul className="list-disc space-y-1.5 pl-4 text-[13px] text-white/85">
              {c.pts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <BenchmarkChart />
    </div>
  );
}

function Agents() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {AGENT_PROFILES.map((a) => {
        const def = scenario.agents[a.id];
        return (
          <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-1 flex items-center gap-2">
              <AgentAvatar id={a.id} size={28} />
              <div className="text-sm font-bold text-white">{def.name}</div>
              <span className={`ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold ${AUTONOMY_STYLE[a.autonomy]}`}>{a.autonomy}</span>
            </div>
            <p className="text-[12px] text-white/80">{a.role}</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11px] text-white/60">
              <div>
                <span className="font-semibold text-white/80">In:</span> {a.inputs}
              </div>
              <div>
                <span className="font-semibold text-white/80">Out:</span> {a.outputs}
              </div>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {a.tools.map((t) => (
                <span key={t} className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] text-sky-200">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] italic text-white/55">Proposed build: {a.build}</p>
          </div>
        );
      })}
    </div>
  );
}

function Architecture() {
  return (
    <div className="space-y-1">
      {LAYERS.map((l, i) => (
        <div key={l.name}>
          <div className="flex items-stretch gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <div className="flex w-40 shrink-0 items-center rounded-lg px-3 text-sm font-bold text-navy-900" style={{ background: l.color }}>
              {l.name}
            </div>
            <div className="grid flex-1 grid-cols-4 gap-2">
              {l.items.map((it) => (
                <div key={it} className="rounded-lg border border-white/10 bg-navy-800 px-2 py-2 text-[12px] text-white/90">
                  {it}
                </div>
              ))}
            </div>
          </div>
          {i < LAYERS.length - 1 && <ArrowDown size={14} className="mx-auto text-white/30" />}
        </div>
      ))}
      <p className="pt-2 text-[11px] text-white/50">
        Proposed reference architecture for discussion. Component choices are illustrative and subject to Charter's
        platform standards, security review and vendor selection.
      </p>
    </div>
  );
}

function Guardrails() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GUARDRAILS.map(([h, t]) => (
        <div key={h} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-1 text-sm font-bold text-white">{h}</div>
          <p className="text-[13px] text-white/75">{t}</p>
        </div>
      ))}
    </div>
  );
}

function Roadmap() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {ROADMAP.map(([h, t]) => (
          <div key={h} className="rounded-xl border border-spectrum/40 bg-spectrum/10 p-4">
            <div className="mb-1 text-sm font-bold text-white">{h}</div>
            <p className="text-[13px] text-white/80">{t}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-2 text-sm font-bold text-white">Decisions we need from this group</div>
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-white/80">
          {DECISIONS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <p className="text-[11px] text-white/50">Roadmap is a proposal for discussion, not a commitment. Demo uses simulated data.</p>
    </div>
  );
}

const SLIDES = [Summary, Agents, Architecture, Guardrails, Roadmap];

export function ExecWalkthrough({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => Math.max(0, Math.min(SLIDES.length - 1, v + d)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.stopPropagation();
        go(1);
      } else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape" || e.key.toLowerCase() === "e") onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const Slide = SLIDES[i];
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-navy-900">
      <div className="flex items-center gap-3 border-b border-white/10 bg-navy px-5 py-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-spectrum">Executive walkthrough</div>
          <div className="text-lg font-bold text-white">{TITLES[i]}</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {TITLES.map((t, n) => (
            <button
              key={t}
              onClick={() => setI(n)}
              className={`rounded px-2 py-1 text-[11px] ${n === i ? "bg-white text-navy" : "text-white/60 hover:bg-white/10"}`}
            >
              {n + 1}. {t}
            </button>
          ))}
          <button onClick={onClose} className="ml-2 rounded p-1.5 text-white/70 hover:bg-white/10" title="Close (Esc)">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="thin-scroll min-h-0 flex-1 overflow-auto px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Slide />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-2">
        <button disabled={i === 0} onClick={() => go(-1)} className="flex items-center gap-1 rounded px-3 py-1.5 text-xs text-white hover:bg-white/10 disabled:opacity-30">
          <ChevronLeft size={14} /> Back
        </button>
        <span className="text-[11px] text-white/50">
          {i + 1} / {SLIDES.length} · ← → to navigate · Esc to close
        </span>
        <button disabled={i === SLIDES.length - 1} onClick={() => go(1)} className="flex items-center gap-1 rounded bg-spectrum px-3 py-1.5 text-xs text-white disabled:opacity-30">
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
