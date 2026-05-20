import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
  type: "sidebar" | "chat" | "profile";
  name: string;
  avatarUrl?: string;
  className?: string;
}

const UserAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  if (!name) {
    name = "Ostro";
  }
  return (
    <Avatar
      className={cn(
        "rounded-full bg-gradient-to-br from-primary/30 to-primary/10",
        className ?? "",
        type === "sidebar" && "size-12 text-base ring-1 ring-white/10",
        type === "chat" && "size-8 text-sm",
        type === "profile" && "size-24 text-3xl ring-2 ring-white/20",
      )}
    >
      <AvatarImage
        src={avatarUrl}
        alt={name}
        className="rounded-full object-cover"
      />
      <AvatarFallback className="bg-primary/20 text-primary font-semibold rounded-full">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
