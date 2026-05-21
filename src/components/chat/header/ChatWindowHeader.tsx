import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DirectChatHeader from "@/components/chat/header/DirectChatHeader";
import GroupChatHeader from "@/components/chat/header/GroupChatHeader";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const currentChat =
    chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!currentChat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="ml-1 text-foreground" />
      </header>
    );
  }

  if (currentChat.type === "direct") {
    return <DirectChatHeader currentChat={currentChat} />;
  }

  return <GroupChatHeader currentChat={currentChat} />;
};

export default ChatWindowHeader;
