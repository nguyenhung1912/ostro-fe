import type { Friend } from "@/types/user";
import UserAvatar from "@/components/common/avatar/UserAvatar";

interface InviteSuggestionListProps {
  filteredFriends: Friend[];
  onSelect: (friend: Friend) => void;
}

const InviteSuggestionList = ({
  filteredFriends,
  onSelect,
}: InviteSuggestionListProps) => {
  if (filteredFriends.length === 0) return null;
  return (
    <div className="border border-border/50 bg-white/[0.02] rounded-xl mt-2 max-h-40 overflow-y-auto divide-y divide-border/30 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {filteredFriends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => onSelect(friend)}
        >
          <UserAvatar
            type="sidebar"
            name={friend.displayName}
            avatarUrl={friend.avatarUrl}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              {friend.displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              @{friend.username}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default InviteSuggestionList;
