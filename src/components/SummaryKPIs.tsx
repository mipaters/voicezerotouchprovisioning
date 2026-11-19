import { motion } from "framer-motion";
import { ArrowRight, Cpu, X } from "lucide-react";
import { scenario } from "../engine/useScenarioPlayer";
import { AgentAvatar } from "./AgentAvatar";

const KPIS = [
  { label: "Calls to call centre", value: "0", sub: "" },
  { label: "Systems touched by humans", value: "0", sub: "vs 6+ today" },
  { label: "Essentials captured", value: "6/6", sub: "" },
  { label: "Time to order", value: "~6 min", sub: "simulated customer time" },
  { label: "Handoffs", value: "0", sub: "vs 5 today" },
  { label: "Upsell attached", value: "Teams + hunt group", sub: "" },
];

const CONNECTORS = ["Salesforce", "iComms", "BroadWorks", "LNP/NPAC", "E911", "Field Service"];
const AGENT_IDS = ["sales", "profiler", "order", "port", "provisioning", "netconfig", "scheduling", "activation", "quality"];

export function SummaryKPIs({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="thin-scroll absolute inset-0 z-30 overflow-auto bg-navy-900/95 p-5 backdrop-blur"
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded p-1 text-white/60 hover:bg-white/10 hover:text-white" title="Back to board">
        <X size={18} />
      </button>
      <h2 className="text-lg font-bold text-white">{scenario.meta.title}: result</h2>
      <p className="mb-4 text-xs text-white/60">{scenario.meta.customer} · live on her chosen date</p>

      <div className="grid grid-cols-3 gap-3">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="rounded-xl border border-spectrum/40 bg-gradient-to-br from-navy to-navy-800 p-3"
          >
            <div className="text-[11px] uppercase tracking-wide text-sky-300/80">{k.label}</div>
            <div className="mt-1 text-2xl font-extrabold leading-tight text-white">{k.value}</div>
            <div className="text-[11px] text-emerald-300">{k.sub || "\u00A0"}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
          <Cpu size={16} className="text-spectrum" /> What's under the hood
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <Box title="WhatsApp Business Platform" />
          <ArrowRight size={14} className="text-white/40" />
          <div className="rounded-lg border border-spectrum/50 bg-spectrum/10 p-2">
            <div className="mb-1 font-semibold text-white">Microsoft Foundry agents</div>
            <div className="flex gap-1">
              {AGENT_IDS.map((a) => (
                <AgentAvatar key={a} id={a} size={22} />
              ))}
            </div>
            <div className="mt-1 max-w-[260px] text-[10px] text-white/60">
              Sales, Profiler, Order, Port, Provisioning, Network Config, Scheduling, Activation, Quality
            </div>
          </div>
          <ArrowRight size={14} className="text-white/40" />
          <div className="rounded-lg border border-white/15 bg-white/5 p-2">
            <div className="mb-1 font-semibold text-white">MCP / API connectors</div>
            <div className="flex max-w-[220px] flex-wrap gap-1">
              {CONNECTORS.map((c) => (
                <span key={c} className="rounded bg-sky-500/15 px-1.5 py-0.5 text-sky-200">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <Box title="Azure monitoring & tracing" />
          <Box title="Human-in-the-loop approval for exceptions" />
        </div>
      </div>
    </motion.div>
  );
}

function Box({ title }: { title: string }) {
  return <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-semibold text-white">{title}</div>;
}
