import { memo } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
  className?: string;
}

function HeaderInner({ onMenuClick, showMenu = true, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-[#333] bg-[#0f0f0f] px-4",
        "sticky top-0 z-30",
        className
      )}
    >
      {showMenu && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="min-w-[44px] min-h-[44px] touch-manipulation">
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <h1 className="text-lg font-semibold text-[#ececec]">ChatGPT</h1>
    </header>
  );
}

export const Header = memo(HeaderInner);
