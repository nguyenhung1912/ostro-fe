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
    <div className="flex items-center justify-between rounded-none shadow-[2px_2px_0px_0px_#000000] border-[2px] border-black bg-white p-3 mb-2 hover:-translate-y-1 hover:shadow-neobrutal transition-all gap-4">
      <div className="flex items-center gap-3">
        <UserAvatar type="sidebar" name={info.displayName} />
        <div>
          <p className="font-bold text-black">{info.displayName}</p>
          <p className="text-sm text-black opacity-80 font-medium">
            @{info.username}
          </p>
        </div>
      </div>
      {actions}
    </div>
  );
};
export default FriendRequestItem;
