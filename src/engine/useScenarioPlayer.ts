import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import scenarioJson from "../data/scenario.json";
import type { ChatMessage, LogLine, Scenario, ScenarioEvent, StepStatus } from "../types";
import { generateReply, liveAiAvailable } from "./liveAi";

export const scenario = scenarioJson as unknown as Scenario;

const START_MINUTES = 13 * 60 + 2;

function clock(n: number): string {
  // simulated wall-clock: each event advances roughly 20s
  const mins = START_MINUTES + Math.floor((n * 20) / 60);
  const h = Math.floor(mins / 60) % 12 || 12;
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m} PM`;
}

export interface PlayerState {
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  done: boolean;
  typing: boolean;
  liveAi: boolean;
  liveAiAvailable: boolean;
  messages: ChatMessage[];
  logs: LogLine[];
  stepStatus: Record<string, StepStatus>;
  checked: Set<string>;
  phaseId: string;
  customerSeconds: number;
  progress: number;
  kpiShown: boolean;
  activeStepId: string | null;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (s: number) => void;
  setLiveAi: (v: boolean) => void;
}

export function useScenarioPlayer(): PlayerState {
  const events = scenario.events;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [liveAi, setLiveAi] = useState(false);
  const [liveText, setLiveText] = useState<Record<number, string>>({});
  const liveRef = useRef({ liveAi, liveText });
  liveRef.current = { liveAi, liveText };

  const done = index >= events.length;
  const next: ScenarioEvent | undefined = events[index];

  const derived = useMemo(() => {
    const messages: ChatMessage[] = [];
    const logs: LogLine[] = [];
    const stepStatus: Record<string, StepStatus> = {};
    const checked = new Set<string>();
    let kpiShown = false;
    let activeStepId: string | null = null;
    let phaseId = events[0].phase;
    let t = 0;
    for (let i = 0; i < index; i++) {
      const e = events[i];
      phaseId = e.phase;
      t = e.t;
      switch (e.type) {
        case "chat":
          messages.push({
            index: i,
            speaker: e.speaker ?? "agent",
            text: liveText[i] ?? e.text ?? "",
            time: clock(messages.length),
            widget: e.widget,
            replies: e.replies,
            selects: e.selects,
            resolves: e.resolves,
          });
          break;
        case "agent":
          if (e.stepId && e.status) {
            stepStatus[e.stepId] = e.status;
            activeStepId = e.status === "running" ? e.stepId : activeStepId;
          }
          break;
        case "log":
          logs.push({ index: i, agent: e.agent, system: e.system, text: e.text ?? "", latencyMs: e.latencyMs, level: e.level });
          break;
        case "callout":
          logs.push({ index: i, text: e.text ?? "", callout: e.tone ?? "warn" });
          break;
        case "checklist":
          if (e.itemId) checked.add(e.itemId);
          break;
        case "kpi":
          kpiShown = true;
          break;
      }
    }
    return { messages, logs, stepStatus, checked, kpiShown, activeStepId, phaseId, t };
  }, [events, index, liveText]);

  useEffect(() => {
    if (!playing) return;
    if (index >= events.length) {
      setPlaying(false);
      return;
    }
    let cancelled = false;
    const ev = events[index];
    const timer = window.setTimeout(async () => {
      const { liveAi: live, liveText: lt } = liveRef.current;
      if (live && ev.type === "chat" && ev.speaker === "agent" && ev.text) {
        const history = events
          .slice(0, index)
          .filter((e) => e.type === "chat" && e.speaker !== "system" && e.text)
          .map((e, i) => ({
            role: e.speaker === "agent" ? ("assistant" as const) : ("user" as const),
            content: lt[events.indexOf(e)] ?? e.text ?? "",
            i,
          }));
        const reply = await generateReply(history, ev.text);
        if (cancelled) return;
        if (reply) setLiveText((m) => ({ ...m, [index]: reply }));
      }
      if (!cancelled) setIndex((i) => i + 1);
    }, ev.delayMs / speed);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [playing, index, speed, events]);

  const play = useCallback(() => {
    setIndex((i) => (i >= events.length ? 0 : i));
    setPlaying(true);
  }, [events.length]);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);
  const step = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, events.length));
  }, [events.length]);
  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
    setLiveText({});
  }, []);

  const typing = playing && !done && next?.type === "chat" && next.speaker === "agent";
  const progress = Math.min(1, derived.t / scenario.meta.totalSeconds);

  return {
    index,
    total: events.length,
    playing,
    speed,
    done,
    typing,
    liveAi,
    liveAiAvailable,
    messages: derived.messages,
    logs: derived.logs,
    stepStatus: derived.stepStatus,
    checked: derived.checked,
    phaseId: derived.phaseId,
    customerSeconds: derived.t * scenario.meta.timeScale,
    progress,
    kpiShown: derived.kpiShown,
    activeStepId: derived.activeStepId,
    play,
    pause,
    toggle,
    step,
    reset,
    setSpeed,
    setLiveAi,
  };
}
