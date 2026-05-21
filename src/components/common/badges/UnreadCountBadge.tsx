import { Badge } from "@/components/ui/badge";

const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="absolute z-20 -top-2 -right-2">
      <Badge className="size-5 text-[10px] bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center p-0 shadow-sm">
        {unreadCount > 5 ? "5+" : unreadCount}
      </Badge>
    </div>
  );
};
export default UnreadCountBadge;
