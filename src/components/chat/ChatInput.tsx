import { memo, useCallback, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

function ChatInputInner({
  onSend,
  disabled = false,
  placeholder = "Message ChatGPT...",
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-xl border border-[#333] bg-[#2a2a2a] p-2",
        "min-h-[52px] sm:min-h-0",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="min-h-[44px] max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[#ececec] placeholder:text-[#666] focus:outline-none text-base"
        style={{ fieldSizing: "content" }}
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="shrink-0 min-w-[44px] min-h-[44px] touch-manipulation"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const ChatInput = memo(ChatInputInner);
