import { scenario } from "../engine/useScenarioPlayer";

export function AgentAvatar({ id, size = 24, active = false }: { id: string; size?: number; active?: boolean }) {
  const a = scenario.agents[id];
  if (!a) return null;
  return (
    <span
      title={a.name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-navy-900 ${active ? "ring-2 ring-white/80" : ""}`}
      style={{ width: size, height: size, background: a.color, fontSize: size * 0.4 }}
    >
      {a.initials}
    </span>
  );
}
