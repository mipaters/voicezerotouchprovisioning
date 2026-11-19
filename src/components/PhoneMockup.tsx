import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, Mic, MoreVertical, Phone, Plus, Smile, Video } from "lucide-react";
import type { ChatMessage } from "../types";
import { ChatBubble } from "./ChatBubble";
import { EssentialsChecklist } from "./EssentialsChecklist";

const W = 370;
const H = 760;

export function PhoneMockup({
  messages,
  typing,
  checked,
}: {
  messages: ChatMessage[];
  typing: boolean;
  checked: Set<string>;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.max(0.5, Math.min(el.clientWidth / (W + 24), el.clientHeight / (H + 24), 1.4)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  return (
    <div ref={wrap} className="flex h-full w-full items-center justify-center">
      <div style={{ width: W * scale, height: H * scale }}>
        <div
          className="relative origin-top-left overflow-hidden rounded-[44px] border-[10px] border-[#0b0b0f] bg-black shadow-2xl shadow-black/60"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#0b0b0f]" />
          <div className="flex h-full flex-col bg-white">
            <div className="flex items-center gap-2 bg-wa-green px-2 pb-2 pt-7 text-white">
              <ArrowLeft size={18} />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white ring-2 ring-spectrum">
                SB
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1 text-[14px] font-semibold">
                  Spectrum Business <BadgeCheck size={14} className="text-[#53BDEB]" fill="#fff" />
                </div>
                <div className="text-[11px] text-white/80">{typing ? "typing…" : "Business account"}</div>
              </div>
              <Video size={18} />
              <Phone size={16} />
              <MoreVertical size={16} />
            </div>
            <EssentialsChecklist checked={checked} />
            <div ref={scroller} className="wa-wallpaper wa-scroll flex-1 space-y-1.5 overflow-y-auto px-2 py-2">
              <div className="mx-auto w-fit rounded-md bg-[#FFF3C4] px-2 py-0.5 text-[10px] text-gray-600 shadow-sm">
                Messages are end-to-end encrypted · Demo conversation
              </div>
              {messages.map((m, i) => {
                const later = messages.slice(i + 1);
                const selection = later.find((x) => x.speaker === "customer" && x.selects)?.selects;
                const w = m.widget;
                const wid = w && "id" in w ? w.id : undefined;
                const resolved = wid ? messages.some((x) => x.resolves === wid) : false;
                return (
                  <ChatBubble key={m.index} msg={m} resolved={resolved} selection={selection} hasLater={later.length > 0} />
                );
              })}
              {typing && (
                <div className="flex w-fit items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 bg-[#F0F2F5] px-2 py-2 text-gray-500">
              <Plus size={18} />
              <div className="flex flex-1 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] text-gray-400">
                <Smile size={14} /> Message
              </div>
              <Mic size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
