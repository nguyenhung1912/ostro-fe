import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { SidebarInset } from "@/components/ui/sidebar";
import ChatWindowSkeleton from "@/components/skeleton/ChatWindowSkeleton";
import ChatWelcomeScreen from "@/components/chat/window/ChatWelcomeScreen";
import ChatWindowBody from "@/components/chat/window/ChatWindowBody";
import ChatWindowHeader from "@/components/chat/header/ChatWindowHeader";
import MessageInput from "@/components/chat/input/MessageInput";

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

  const selectedConvoId = selectedConvo?._id;
  const lastMessageId = selectedConvo?.lastMessage?._id;

  useEffect(() => {
    if (!selectedConvoId) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error(
          "[ChatWindowLayout] Failed to mark messages as seen:",
          error,
        );
      }
    };

    markSeen();
  }, [markAsSeen, selectedConvoId, lastMessageId]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (messageLoading && selectedMessages.length === 0) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className="flex h-full flex-1 flex-col overflow-hidden bg-background">
      <ChatWindowHeader chat={selectedConvo} />
      <ChatWindowBody />
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
