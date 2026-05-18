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
        "rounded-none border-2 border-black bg-card",
        className ?? "",
        type === "sidebar" &&
          "size-12 text-base shadow-[2px_2px_0px_0px_#000000]",
        type === "chat" && "size-8 text-sm",
        type === "profile" &&
          "size-24 text-3xl shadow-[4px_4px_0px_0px_#000000]",
      )}
    >
      <AvatarImage
        src={avatarUrl}
        alt={name}
        className="rounded-none object-cover"
      />
      <AvatarFallback className={`bg-accent text-black font-bold rounded-none`}>
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
