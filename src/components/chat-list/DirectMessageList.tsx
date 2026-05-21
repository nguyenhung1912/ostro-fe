import { useChatStore } from "@/stores/useChatStore";
import ConversationSkeleton from "../skeleton/ConversationSkeleton";
import DirectMessageCard from "@/components/chat-list/DirectMessageCard";

const DirectMessageList = () => {
  const { conversations, convoLoading } = useChatStore();

  if (!conversations) return null;

  if (convoLoading) {
    return (
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <ConversationSkeleton />
      </div>
    );
  }

  const directConversations = conversations.filter(
    (convo) => convo.type === "direct",
  );

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-2">
      {directConversations.map((convo) => (
        <DirectMessageCard convo={convo} key={convo._id} />
      ))}
    </div>
  );
};

export default DirectMessageList;
