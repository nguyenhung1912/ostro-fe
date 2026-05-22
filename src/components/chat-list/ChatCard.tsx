import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useChatStore } from "@/stores/useChatStore";
import { sileo } from "sileo";
import { Pin, PinOff } from "lucide-react";

interface ChatCardProps {
  convoId: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  timestamp?: string;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
  isPinned?: boolean;
}

const ChatCard = ({
  convoId,
  name,
  isActive,
  onSelect,
  unreadCount = 0,
  timestamp,
  leftSection,
  subtitle,
  isPinned = false,
}: ChatCardProps) => {
  const { togglePinConversation } = useChatStore();

  const handleTogglePin = async () => {
    try {
      await togglePinConversation(convoId);
    } catch {
      sileo.error({
        title: "Lỗi",
        description: "Không thể ghim cuộc trò chuyện.",
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          key={convoId}
          className={cn(
            "flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 border-b border-border/20 last:border-0 select-none",
            isActive
              ? "bg-blue-50/80 dark:bg-blue-950/20 text-foreground"
              : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-foreground",
          )}
          onClick={() => onSelect(convoId)}
        >
          <div className="relative flex-shrink-0">{leftSection}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h3
                className={cn(
                  "text-[14px] truncate",
                  unreadCount > 0
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground",
                )}
              >
                {name}
              </h3>
              {timestamp && (
                <div className="flex items-center gap-1 ml-2">
                  {isPinned && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary rotate-45"
                    >
                      <line x1="12" x2="12" y1="17" y2="22" />
                      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                    </svg>
                  )}
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {timestamp}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-1">{subtitle}</div>
              {unreadCount > 0 && (
                <div className="ml-2 flex-shrink-0">
                  <span className="h-4.5 min-w-4.5 px-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount > 5 ? "5+" : unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-background border-border shadow-md">
        <ContextMenuItem className="cursor-pointer" onSelect={handleTogglePin}>
          {isPinned ? (
            <>
              <PinOff className="size-4 mr-2" /> Bỏ ghim
            </>
          ) : (
            <>
              <Pin className="size-4 mr-2" /> Ghim cuộc trò chuyện
            </>
          )}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
export default ChatCard;
