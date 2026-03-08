import { memo } from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/features/chat/hooks/useChat";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

function SidebarInner({ open = true, onClose, className }: SidebarProps) {
  const {
    conversations,
    activeConversationId,
    newChat,
    selectConversation,
    deleteConversation,
  } = useChat();

  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-[#333] bg-[#0f0f0f] transition-transform duration-200 ease-out",
        "fixed md:relative inset-y-0 left-0 z-50 h-[100dvh] md:h-auto",
        "pt-14 md:pt-0",
        !open && "-translate-x-full md:translate-x-0 md:w-0 md:min-w-0 md:overflow-hidden md:border-0",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-[#333] px-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-start gap-2 min-h-[44px] touch-manipulation"
          onClick={() => {
            newChat();
            onClose?.();
          }}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                activeConversationId === conv.id
                  ? "bg-[#2a2a2a] text-[#ececec]"
                  : "text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#ececec]",
              )}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 text-left min-h-[44px] touch-manipulation py-2"
                onClick={() => {
                  selectConversation(conv.id);
                  onClose?.();
                }}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate text-sm">{conv.title}</span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 min-w-[44px] min-h-[44px] touch-manipulation hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

export const Sidebar = memo(SidebarInner);
