import { memo } from "react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

function TypingIndicatorInner({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex gap-1 px-4 py-4", className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a]">
        <span className="text-[#10a37f]">●</span>
      </div>
      <div className="flex items-center gap-1 pt-2">
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-[#666]"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-[#666]"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-[#666]"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export const TypingIndicator = memo(TypingIndicatorInner);
