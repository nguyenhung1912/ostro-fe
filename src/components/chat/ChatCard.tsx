import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface ChatCardProps {
  convoId: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
}

const ChatCard = ({
  convoId,
  name,
  isActive,
  onSelect,
  unreadCount,
  leftSection,
  subtitle,
}: ChatCardProps) => {
  return (
    <Card
      key={convoId}
      className={cn(
        "border border-transparent p-3 cursor-pointer transition-colors rounded-xl hover:bg-accent hover:text-accent-foreground group",
        isActive && "bg-secondary text-secondary-foreground",
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={cn(
                "font-medium text-sm truncate",
                unreadCount && unreadCount > 0
                  ? "font-semibold text-foreground"
                  : "text-foreground",
              )}
            >
              {name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ChatCard;
