export type Widget =
  | { kind: "location"; label: string; address: string }
  | { kind: "photo"; name: string; size: string }
  | { kind: "loa"; id: string; numbers: string[]; carrier: string }
  | {
      kind: "list";
      id: string;
      button: string;
      items: { id: string; title: string; price: string; desc: string }[];
      footnote?: string;
    }
  | { kind: "secureLink"; id: string; title: string; subtitle: string; url: string; amount: string }
  | { kind: "summary"; title: string; rows: [string, string][] };

export interface ScenarioEvent {
  t: number;
  phase: string;
  type: "chat" | "agent" | "log" | "checklist" | "kpi" | "callout";
  speaker?: "agent" | "customer" | "system";
  text?: string;
  lane?: string;
  stepId?: string;
  status?: "running" | "done";
  agent?: string;
  system?: string;
  latencyMs?: number;
  delayMs: number;
  level?: "warn";
  tone?: "warn" | "success";
  itemId?: string;
  widget?: Widget;
  replies?: string[];
  selects?: string;
  resolves?: string;
}

export interface Step {
  id: string;
  lane: string;
  col: number;
  title: string;
  agent: string;
  coAgent?: string;
  systems: string[];
  today: string;
}

export interface AgentDef {
  name: string;
  initials: string;
  color: string;
}

export interface Scenario {
  meta: { title: string; customer: string; legacyDays: number; totalSeconds: number; timeScale: number };
  lanes: { id: string; label: string; sub?: string }[];
  agents: Record<string, AgentDef>;
  steps: Step[];
  essentials: { id: string; label: string }[];
  phases: { id: string; title: string; notes: string[] }[];
  events: ScenarioEvent[];
}

export type StepStatus = "pending" | "running" | "done";

export interface ChatMessage {
  index: number;
  speaker: "agent" | "customer" | "system";
  text: string;
  time: string;
  widget?: Widget;
  replies?: string[];
  selects?: string;
  resolves?: string;
}

export interface LogLine {
  index: number;
  agent?: string;
  system?: string;
  text: string;
  latencyMs?: number;
  level?: "warn";
  callout?: "warn" | "success";
}
