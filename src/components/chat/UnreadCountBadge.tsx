import { Badge } from "../ui/badge";

const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="absolute z-20 -top-2 -right-2">
      <Badge className="size-6 text-xs bg-accent text-black border-[2px] border-black shadow-[2px_2px_0px_0px_#000000] rounded-none font-bold flex items-center justify-center p-0">
        {unreadCount > 5 ? "5+" : unreadCount}
      </Badge>
    </div>
  );
};
export default UnreadCountBadge;
