import { memo, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/globalTypes";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  loading?: boolean;
  className?: string;
}

function ChatMessagesInner({
  messages,
  loading,
  className,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <ScrollArea
      ref={scrollRef}
      className={cn("flex-1 overflow-y-auto", className)}
    >
      <div className="mx-auto max-w-3xl w-full px-2 sm:px-0">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-12 sm:py-16 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#ececec]">
              How can I help you today?
            </h2>
            <p className="text-sm sm:text-base text-[#a0a0a0]">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}

export const ChatMessages = memo(ChatMessagesInner);
