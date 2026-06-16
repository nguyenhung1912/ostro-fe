import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import ChatCard from "@/components/chat-list/ChatCard";
import GroupChatAvatar from "@/components/common/avatar/GroupChatAvatar";
import { cn, formatLastMessageTime } from "@/lib/utils";

const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return null;

  const unreadCount = convo.unreadCounts[user._id] ?? 0;
  const name = convo.group?.name ?? "";
  const lastMessageContent = convo.lastMessage?.content ?? "";
  const lastMessageSender = convo.lastMessage?.senderId;
  const lastMessageSenderId =
    typeof lastMessageSender === "object" && lastMessageSender !== null
      ? lastMessageSender._id
      : lastMessageSender;
  const isOwnLastMessage = lastMessageSenderId === user._id;
  const senderName = isOwnLastMessage
    ? "Bạn"
    : convo.participants.find((p) => p._id === lastMessageSenderId)?.nickname ||
      convo.participants.find((p) => p._id === lastMessageSenderId)
        ?.displayName ||
      (typeof lastMessageSender === "object" && lastMessageSender !== null
        ? lastMessageSender.displayName
        : "") ||
      "Ai đó";
  const timestamp = formatLastMessageTime(
    convo.lastMessage?.createdAt || convo.lastMessageAt || convo.updatedAt,
  );

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages(id);
    }
  };

  const subtitleText = lastMessageContent
    ? `${senderName}: ${lastMessageContent}`
    : `${convo.participants.length} thành viên`;

  return (
    <ChatCard
      convoId={convo._id}
      name={name}
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      timestamp={timestamp}
      isPinned={convo.pinnedBy?.includes(user._id)}
      leftSection={
        <GroupChatAvatar participants={convo.participants} type="chat" />
      }
      subtitle={
        <p
          className={cn(
            "text-[12px] truncate",
            unreadCount > 0
              ? "font-semibold text-foreground animate-pulse"
              : "text-muted-foreground",
          )}
        >
          {subtitleText}
        </p>
      }
    />
  );
};
export default GroupChatCard;
