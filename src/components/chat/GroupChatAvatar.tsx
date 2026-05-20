import type { Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupChatAvatarProps {
  participants: Participant[];
  type: "chat" | "sidebar";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
  const containerSize = type === "sidebar" ? "size-12" : "size-10";

  if (!participants || participants.length === 0) {
    return (
      <div
        className={cn(
          "rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-border/20",
          containerSize,
        )}
      >
        <Users className="size-4 text-muted-foreground" />
      </div>
    );
  }

  if (participants.length === 1) {
    const member = participants[0];
    return (
      <UserAvatar
        type={type}
        className={containerSize}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
      />
    );
  }

  const limit = Math.min(participants.length, 4);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-slate-200/80 dark:bg-zinc-800/40 flex-shrink-0 grid gap-[1px] p-[1px] border border-border/10",
        containerSize,
        limit === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2",
      )}
    >
      {participants.slice(0, limit).map((member, index) => {
        const isFirstOfThree = limit === 3 && index === 0;

        return (
          <div
            key={member._id || index}
            className={cn(
              "relative overflow-hidden bg-slate-300 dark:bg-zinc-700 flex items-center justify-center select-none",
              isFirstOfThree ? "col-span-2" : "col-span-1",
            )}
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.displayName}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <span className="text-[9px] font-bold text-slate-600 dark:text-zinc-300 leading-none">
                {member.displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default GroupChatAvatar;
