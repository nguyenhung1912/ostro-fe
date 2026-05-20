import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn, formatLastMessageTime } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import { useSocketStore } from "@/stores/useSocketStore";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const otherUser = convo.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = convo.unreadCounts[user._id] ?? 0;
  const lastMessage = convo.lastMessage?.content ?? "";
  const timestamp = formatLastMessageTime(
    convo.lastMessage?.createdAt || convo.lastMessageAt || convo.updatedAt,
  );

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={otherUser.nickname ?? otherUser.displayName ?? ""}
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      timestamp={timestamp}
      leftSection={
        <div className="relative">
          <UserAvatar
            type="sidebar"
            className="size-10 pointer-events-none"
            name={otherUser.displayName ?? ""}
            avatarUrl={otherUser.avatarUrl ?? undefined}
          />
          <StatusBadge
            status={
              onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"
            }
          />
        </div>
      }
      subtitle={
        <p
          className={cn(
            "text-[12px] truncate",
            unreadCount > 0
              ? "font-semibold text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessage || "Chưa có tin nhắn"}
        </p>
      }
    />
  );
};
export default DirectMessageCard;
