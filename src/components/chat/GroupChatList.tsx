import { useChatStore } from "@/stores/useChatStore";
import ConversationSkeleton from "../skeleton/ConversationSkeleton";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {
  const { conversations, convoLoading } = useChatStore();

  if (!conversations) return null;

  if (convoLoading) {
    return (
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <ConversationSkeleton />
      </div>
    );
  }

  const groupChats = conversations.filter((convo) => convo.type === "group");

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-2">
      {groupChats.map((convo) => (
        <GroupChatCard convo={convo} key={convo._id} />
      ))}
    </div>
  );
};

export default GroupChatList;
