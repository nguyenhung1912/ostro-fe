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
      console.error(
        "[ChatApp - ChatWindowBody]: Lỗi khi tải thêm tin nhắn.",
        error,
      );
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
      <div className="flex h-full items-center justify-center text-black font-bold uppercase tracking-widest bg-card">
        Chưa có tin nhắn nào
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-card p-4">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="beautiful-scrollbar flex flex-col-reverse overflow-x-hidden overflow-y-auto"
      >
        <div ref={messagesEndRef} />
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p>Đang tải...</p>}
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
    </div>
  );
};

export default ChatWindowBody;
