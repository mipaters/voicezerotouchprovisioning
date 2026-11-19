import { motion } from "framer-motion";
import { CheckCheck, FileText, MapPin } from "lucide-react";
import type { ChatMessage, Widget } from "../types";
import { QuickReplies } from "./QuickReplies";
import { ListMessage } from "./ListMessage";
import { SecureLinkCard } from "./SecureLinkCard";
import { LOACard } from "./LOACard";

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className={`block min-h-[0.5em] ${line.startsWith("Illustrative") ? "text-[10px] italic text-gray-500" : ""}`}>
          {line}
        </span>
      ))}
    </>
  );
}

function WidgetView({ w, resolved, selection }: { w: Widget; resolved: boolean; selection?: string }) {
  switch (w.kind) {
    case "location":
      return (
        <div className="mb-1 overflow-hidden rounded-lg bg-white">
          <div className="relative flex h-20 items-center justify-center bg-[#cfe3d0]">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg,#fff 2px,transparent 2px)", backgroundSize: "28px 28px" }} />
            <MapPin size={30} className="relative text-red-500" fill="#fecaca" />
          </div>
          <div className="px-2 py-1">
            <div className="text-[12px] font-semibold text-gray-800">{w.label}</div>
            <div className="text-[11px] text-gray-500">{w.address}</div>
          </div>
        </div>
      );
    case "photo":
      return (
        <div className="mb-1 overflow-hidden rounded-lg bg-white">
          <div className="relative flex h-24 flex-col gap-1 bg-gradient-to-b from-gray-50 to-gray-200 p-2">
            <div className="h-2 w-1/3 rounded bg-gray-400" />
            {[70, 55, 80, 40].map((x, i) => (
              <div key={i} className="h-1.5 rounded bg-gray-300" style={{ width: `${x}%` }} />
            ))}
            <div className="mt-auto self-end rounded bg-gray-400/70 px-1 text-[8px] text-white">BILL · demo</div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500">
            <FileText size={11} /> {w.name} · {w.size}
          </div>
        </div>
      );
    case "loa":
      return <LOACard widget={w} signed={resolved} />;
    case "list": {
      return <ListMessage widget={w} selectedId={selection} />;
    }
    case "secureLink":
      return <SecureLinkCard widget={w} done={resolved} />;
    case "summary":
      return (
        <div className="mb-1 overflow-hidden rounded-lg bg-white">
          <div className="bg-wa-teal px-2 py-1 text-[12px] font-semibold text-white">{w.title}</div>
          <table className="w-full text-[11px]">
            <tbody>
              {w.rows.map(([k, v]) => (
                <tr key={k} className="border-b border-gray-100 last:border-0">
                  <td className="px-2 py-0.5 text-gray-500">{k}</td>
                  <td className="px-2 py-0.5 text-right font-medium text-gray-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function ChatBubble({
  msg,
  resolved,
  selection,
  hasLater,
}: {
  msg: ChatMessage;
  resolved: boolean;
  selection?: string;
  hasLater: boolean;
}) {
  if (msg.speaker === "system") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="my-1 flex justify-center">
        <span className="rounded-md bg-[#FFF3C4] px-2 py-0.5 text-[11px] text-gray-700 shadow-sm">{msg.text}</span>
      </motion.div>
    );
  }
  const mine = msg.speaker === "customer";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[88%] rounded-lg px-2 py-1.5 text-[13px] leading-snug text-gray-900 shadow-sm ${
          mine ? "rounded-tr-none bg-wa-bubble" : "rounded-tl-none bg-white"
        }`}
      >
        {msg.widget && <WidgetView w={msg.widget} resolved={resolved} selection={selection} />}
        {msg.text && <Rich text={msg.text} />}
        <div className="mt-0.5 flex items-center justify-end gap-0.5 text-[10px] text-gray-500">
          {msg.time}
          {mine && <CheckCheck size={13} className="text-[#53BDEB]" />}
        </div>
      </div>
      {msg.replies && (
        <div className="w-[88%]">
          <QuickReplies options={msg.replies} selected={selection} disabled={hasLater} />
        </div>
      )}
    </motion.div>
  );
}
