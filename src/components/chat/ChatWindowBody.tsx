import {
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    fetchMessages,
    messages: allMessages,
  } = useChatStore();

  const items = allMessages[activeConversationId!]?.items;
  const messages = useMemo(() => items ?? [], [items]);
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;

  const selectedConvo = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === activeConversationId,
      ),
    [conversations, activeConversationId],
  );

  const { user } = useAuthStore();

  const lastMessageStatus = useMemo(() => {
    const otherSeen = selectedConvo?.seenBy?.filter((u) => u._id !== user?._id);
    return (otherSeen?.length ?? 0) > 0 ? "seen" : "delivered";
  }, [selectedConvo?.seenBy, user?._id]);

  const key = `chat-scroll-${activeConversationId}`;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const handleToggleSearch = () => {
      setIsSearchOpen((prev) => {
        if (!prev) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        } else {
          setSearchKeyword("");
        }
        return !prev;
      });
    };

    document.addEventListener("toggle-message-search", handleToggleSearch);
    return () =>
      document.removeEventListener("toggle-message-search", handleToggleSearch);
  }, []);

  const filteredMessages = useMemo(() => {
    if (!searchKeyword.trim()) return reversedMessages;
    const lowerKeyword = searchKeyword.toLowerCase();
    return reversedMessages.filter((m) =>
      m.content?.toLowerCase().includes(lowerKeyword),
    );
  }, [reversedMessages, searchKeyword]);

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
    <div className="flex-1 h-0 flex flex-col overflow-hidden relative">
      {isSearchOpen && (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm animate-in slide-in-from-top fade-in duration-200">
          <div className="relative flex items-center bg-muted/30 border border-border/50 rounded-lg px-3 py-1.5 transition-colors focus-within:bg-background focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 mx-auto max-w-2xl">
            <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
            <Input
              ref={searchInputRef}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm trong cuộc trò chuyện..."
              className="border-0 h-8 focus-visible:ring-0 px-0 bg-transparent flex-1 text-sm shadow-none"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="text-muted-foreground hover:text-foreground p-1 shrink-0 rounded-md hover:bg-muted/80 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
            <div className="w-px h-4 bg-border/50 mx-2 shrink-0" />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchKeyword("");
              }}
              className="text-muted-foreground hover:text-foreground text-xs font-medium shrink-0 px-2 py-1 rounded-md hover:bg-muted/80 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex-1 h-0 flex flex-col-reverse overflow-x-hidden overflow-y-auto beautiful-scrollbar pl-4 pr-8 py-4"
      >
        <div ref={messagesEndRef} />
        {searchKeyword && filteredMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground font-medium text-sm bg-transparent">
            Không tìm thấy tin nhắn nào khớp với "{searchKeyword}"
          </div>
        ) : (
          <InfiniteScroll
            dataLength={filteredMessages.length}
            next={fetchMoreMessages}
            hasMore={searchKeyword ? false : hasMore}
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
            {filteredMessages.map((message, index) => (
              <MessageItem
                key={message._id ?? index}
                message={message}
                index={index}
                messages={filteredMessages}
                selectedConvo={selectedConvo}
                lastMessageStatus={lastMessageStatus}
                searchKeyword={searchKeyword}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default ChatWindowBody;
