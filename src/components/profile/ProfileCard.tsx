import { useSocketStore } from "@/stores/useSocketStore";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/common/avatar/UserAvatar";
import AvatarUploader from "./AvatarUploader";
import { useRef, useState, type ChangeEvent } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();
  const { updateCoverUrl } = useUserStore();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  if (!user) return null;

  const bio = user.bio?.trim();
  const isOnline = onlineUsers.includes(user._id);

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
      input.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Ảnh bìa không được vượt quá 1MB.");
      input.value = "";
      return;
    }

    try {
      setCoverUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await updateCoverUrl(formData);
    } finally {
      setCoverUploading(false);
      input.value = "";
    }
  };

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl bg-secondary border border-border">
      {user.coverUrl && (
        <img
          src={user.coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/35 to-background/10" />

      <button
        type="button"
        disabled={coverUploading}
        onClick={() => coverInputRef.current?.click()}
        className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-70"
        aria-label="Tải ảnh bìa"
        title="Tải ảnh bìa"
      >
        {coverUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
      </button>
      <input
        ref={coverInputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp"
        onChange={handleCoverUpload}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-4">
        <div className="relative shrink-0">
          <UserAvatar
            type="profile"
            name={user.displayName}
            avatarUrl={user.avatarUrl ?? undefined}
            className="ring-2 ring-background shadow-sm"
          />
          <AvatarUploader />
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <h2 className="text-xl font-semibold text-foreground truncate leading-tight">
            {user.displayName}
          </h2>
          <p className="text-sm text-muted-foreground truncate mt-0.5">{bio}</p>
        </div>

        {/* Online status badge */}
        <div
          className={cn(
            "shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
            isOnline
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-muted text-muted-foreground",
          )}
        >
          <div
            className={cn(
              "size-1.5 rounded-full",
              isOnline ? "bg-green-500" : "bg-muted-foreground",
            )}
          />
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
