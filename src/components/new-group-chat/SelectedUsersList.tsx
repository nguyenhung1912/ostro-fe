import type { Friend } from "@/types/user";
import UserAvatar from "@/components/common/avatar/UserAvatar";
import { X } from "lucide-react";

interface SelectedUsersListProps {
  invitedUsers: Friend[];
  onRemove: (user: Friend) => void;
}

const SelectedUsersList = ({
  invitedUsers,
  onRemove,
}: SelectedUsersListProps) => {
  if (invitedUsers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {invitedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-2 bg-primary/10 text-primary font-medium text-xs rounded-full border border-primary/20 pl-1 pr-2 py-1 transition-all hover:bg-primary/15"
        >
          <UserAvatar
            type="sidebar"
            name={user.displayName}
            avatarUrl={user.avatarUrl}
          />
          <span className="max-w-[100px] truncate">{user.displayName}</span>

          <button
            type="button"
            className="rounded-full p-0.5 hover:bg-primary/20 hover:text-red-400 transition-colors"
            onClick={() => onRemove(user)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
export default SelectedUsersList;
