import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowSkeleton from "../skeleton/ChatWindowSkeleton";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowBody from "./ChatWindowBody";
import ChatWindowHeader from "./ChatWindowHeader";
import MessageInput from "./MessageInput";

const ChatWindowLayout = () => {
  const {
    activeConversationId,
    conversations,
    markAsSeen,
    messageLoading,
    messages,
  } = useChatStore();

  const selectedConvo =
    conversations.find(
      (conversation) => conversation._id === activeConversationId,
    ) ?? null;
  const selectedMessages = selectedConvo
    ? (messages[selectedConvo._id]?.items ?? [])
    : [];

  useEffect(() => {
    if (!selectedConvo) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error("Lỗi khi markSeen", error);
      }
    };

    markSeen();
  }, [markAsSeen, selectedConvo]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (messageLoading && selectedMessages.length === 0) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className="flex h-full flex-1 flex-col overflow-hidden border-[3px] border-black shadow-neobrutal rounded-none bg-card">
      <ChatWindowHeader chat={selectedConvo} />

      <div className="flex-1 overflow-y-auto bg-card">
        <ChatWindowBody />
      </div>

      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
