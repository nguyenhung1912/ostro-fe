import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "../chat/UserAvatar";

interface RequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem = ({
  requestInfo,
  actions,
  type,
}: RequestItemProps) => {
  if (!requestInfo) return;

  const info = type === "sent" ? requestInfo.to : requestInfo.from;

  if (!info) return;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 dark:bg-white/[0.03] p-3 mb-2 hover:bg-white/10 transition-all gap-4">
      <div className="flex items-center gap-3">
        <UserAvatar type="sidebar" name={info.displayName} avatarUrl={info.avatarUrl ?? undefined} />
        <div>
          <p className="font-semibold text-foreground">{info.displayName}</p>
          <p className="text-sm text-muted-foreground">
            @{info.username}
          </p>
        </div>
      </div>
      {actions}
    </div>
  );
};
export default FriendRequestItem;
