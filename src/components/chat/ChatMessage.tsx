import { memo } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/globalTypes";
import { MediaRenderer } from "./MediaRenderer";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

function ChatMessageInner({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4",
        isUser ? "bg-transparent" : "bg-[#1a1a1a]"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-[#10a37f]" : "bg-[#2a2a2a]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-[#10a37f]" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="font-medium text-[#a0a0a0] text-sm sm:text-base">
          {isUser ? "You" : "Assistant"}
        </div>
        <div className="text-[#ececec] text-sm sm:text-base break-words overflow-x-auto">
          {message.content.map((c, i) => (
            <MediaRenderer key={i} content={c} />
          ))}
        </div>
        {message.status === "error" && (
          <div className="text-sm text-red-500">Failed to send. Please retry.</div>
        )}
      </div>
    </div>
  );
}

export const ChatMessage = memo(ChatMessageInner);
