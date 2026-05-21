import { cn } from "@/lib/utils";

interface ChatCardProps {
  convoId: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  timestamp?: string;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
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
}: ChatCardProps) => {
  return (
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
            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
              {timestamp}
            </span>
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
  );
};
export default ChatCard;
