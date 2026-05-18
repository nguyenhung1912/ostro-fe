import { useLayoutEffect, useRef, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    fetchMessages,
    messages: allMessages,
  } = useChatStore();

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;

  const selectedConvo = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === activeConversationId,
      ),
    [conversations, activeConversationId],
  );

  const lastMessageStatus = useMemo(
    () => ((selectedConvo?.seenBy?.length ?? 0) > 0 ? "seen" : "delivered"),
    [selectedConvo?.seenBy?.length],
  );

  const key = `chat-scroll-${activeConversationId}`;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeConversationId]);

  const fetchMoreMessages = useCallback(async () => {
    if (!activeConversationId) return;

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("[ChatWindowBody] Failed to load more messages:", error);
    }
  }, [activeConversationId, fetchMessages]);

  const handleScrollSave = useCallback(() => {
    const container = containerRef.current;

    if (!container || !activeConversationId) return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
      }),
    );
  }, [activeConversationId, key]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item) as { scrollTop: number };
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [key, messages.length]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground font-medium text-sm bg-transparent">
        Chưa có tin nhắn nào
      </div>
    );
  }

  return (
    <div
      id="scrollableDiv"
      ref={containerRef}
      onScroll={handleScrollSave}
      className="flex-1 h-0 flex flex-col-reverse overflow-x-hidden overflow-y-auto beautiful-scrollbar pl-4 pr-8 py-4"
    >
      <div ref={messagesEndRef} />
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMoreMessages}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        loader={
          <p className="text-center text-xs text-muted-foreground py-2">
            Đang tải thêm...
          </p>
        }
        inverse
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          overflow: "visible",
        }}
      >
        {reversedMessages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            message={message}
            index={index}
            messages={reversedMessages}
            selectedConvo={selectedConvo}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ChatWindowBody;
