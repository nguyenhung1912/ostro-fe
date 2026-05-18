import type { Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";

interface GroupChatAvatarProps {
  participants: Participant[];
  type: "chat" | "sidebar";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
  const avatars = [];
  const limit = Math.min(participants.length, 4);

  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatars.push(
      <UserAvatar
        key={i}
        type={type}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
      />,
    );
  }
  return (
    <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-[2px] *:data-[slot=avatar]:ring-black">
      {avatars}

      {/* > 4 avatar thì render ... */}
      {participants.length > limit && (
        <div
          className="flex items-center z-10 justify-center size-8 
          rounded-none bg-accent border-[2px] border-black shadow-[2px_2px_0px_0px_#000000] text-black font-bold"
        >
          <Ellipsis className="size-4 text-black" />
        </div>
      )}
    </div>
  );
};
export default GroupChatAvatar;
