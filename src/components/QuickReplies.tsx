import { Check } from "lucide-react";

export function QuickReplies({
  options,
  selected,
  disabled,
}: {
  options: string[];
  selected?: string;
  disabled: boolean;
}) {
  return (
    <div className="mt-1 flex flex-col gap-1">
      {options.map((o) => {
        const isSel = selected === o;
        return (
          <div
            key={o}
            className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-center text-[13px] font-medium shadow-sm ${
              isSel
                ? "border-wa-teal bg-wa-teal text-white"
                : disabled
                  ? "border-gray-200 bg-white/70 text-gray-400"
                  : "border-white bg-white text-[#027EB5]"
            }`}
          >
            {isSel && <Check size={13} />}
            {o}
          </div>
        );
      })}
    </div>
  );
}
