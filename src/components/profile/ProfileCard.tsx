import { useSocketStore } from "@/stores/useSocketStore";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";
import UserAvatar from "../chat/UserAvatar";
import AvatarUploader from "./AvatarUploader";

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const bio = user.bio?.trim() || "Will code for food";
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-4">
        <div className="relative shrink-0">
          <UserAvatar
            type="profile"
            name={user.displayName}
            avatarUrl={user.avatarUrl ?? undefined}
            className="ring-2 ring-white/40 shadow-lg"
          />
          <AvatarUploader />
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <h2 className="text-xl font-semibold text-white truncate leading-tight">
            {user.displayName}
          </h2>
          <p className="text-sm text-white/70 truncate mt-0.5">{bio}</p>
        </div>

        {/* Online status badge */}
        <div
          className={cn(
            "shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
            isOnline
              ? "bg-green-500/25 text-green-300 border border-green-400/30"
              : "bg-slate-500/25 text-slate-300 border border-slate-400/30",
          )}
        >
          <div
            className={cn(
              "size-1.5 rounded-full",
              isOnline ? "bg-green-400 animate-pulse" : "bg-slate-400",
            )}
          />
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
