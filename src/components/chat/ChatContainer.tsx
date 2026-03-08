import { memo } from "react";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/features/chat/hooks/useChat";
import { Button } from "@/components/ui/button";

function ChatContainerInner() {
  const {
    activeConversation,
    loading,
    error,
    sendMessage,
    clearError,
  } = useChat();

  const messages = activeConversation?.messages ?? [];

  return (
    <div className="flex flex-1 flex-col">
      {error && (
        <div className="flex items-center justify-between gap-4 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={clearError}>
            Dismiss
          </Button>
        </div>
      )}
      <ChatMessages messages={messages} loading={loading} className="flex-1" />
      <div className="border-t border-[#333] p-3 sm:p-4">
        <div className="mx-auto max-w-3xl w-full">
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}

export const ChatContainer = memo(ChatContainerInner);
