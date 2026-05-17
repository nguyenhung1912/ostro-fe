import { useSocketStore } from "@/stores/useSocketStore";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";
import UserAvatar from "../chat/UserAvatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
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
    <Card className="h-52 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0">
      <CardContent className="mt-20 flex flex-col items-center gap-6 pb-8 sm:flex-row sm:items-end">
        <div className="relative">
          <UserAvatar
            type="profile"
            name={user.displayName}
            avatarUrl={user.avatarUrl ?? undefined}
            className="ring-4 ring-white shadow-lg"
          />

          <AvatarUploader />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {user.displayName}
          </h1>

          <p className="mt-2 max-w-lg line-clamp-2 text-sm text-white/70">
            {bio}
          </p>
        </div>

        <Badge
          className={cn(
            "flex items-center gap-1 capitalize",
            isOnline
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-700",
          )}
        >
          <div
            className={cn(
              "size-2 rounded-full",
              isOnline ? "bg-green-500 animate-pulse" : "bg-slate-500",
            )}
          />

          {isOnline ? "online" : "offline"}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
