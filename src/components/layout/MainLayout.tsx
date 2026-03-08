import { memo, useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatStore } from "@/features/chat/store/chatStore";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  className?: string;
}

function MainLayoutInner({ className }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const createConversation = useChatStore((s) => s.createConversation);
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  useEffect(() => {
    if (conversations.length === 0 && !activeConversationId) {
      createConversation();
    }
  }, [conversations.length, activeConversationId, createConversation]);

  return (
    <div className={cn("flex h-screen flex-col bg-[#0f0f0f] overflow-hidden", className)}>
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <main className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
}

export const MainLayout = memo(MainLayoutInner);
