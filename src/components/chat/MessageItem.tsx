import { memo, useState } from "react";
import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Reply, SmilePlus, MoreHorizontal } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
  searchKeyword?: string;
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
  searchKeyword = "",
}: MessageItemProps) => {
  const { recallMessage } = useChatStore();
  const isDeleted = message.isDeleted || false;
  const [reactions, setReactions] = useState<
    { emoji: string; count: number }[]
  >(message.reactions || []);

  const olderMsg =
    index + 1 < messages.length ? messages[index + 1] : undefined;
  const newerMsg = index > 0 ? messages[index - 1] : undefined;

  const isGroupBreak =
    !olderMsg ||
    message.senderId !== olderMsg.senderId ||
    new Date(message.createdAt).getTime() -
      new Date(olderMsg.createdAt).getTime() >
      300000;

  const isLastInGroup =
    !newerMsg ||
    newerMsg.senderId !== message.senderId ||
    new Date(newerMsg.createdAt).getTime() -
      new Date(message.createdAt).getTime() >
      300000;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  const handleAddReaction = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
  };

  const handleRecallMessage = async () => {
    try {
      await recallMessage(message._id, message.conversationId);
    } catch (error) {
      console.error("[MessageItem] Failed to recall message:", error);
      toast.error("Thu hồi tin nhắn thất bại. Vui lòng thử lại.");
    }
  };

  const renderContent = (content: string, keyword: string) => {
    if (!keyword.trim()) return <span>{content}</span>;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = content.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-yellow-400/90 text-black font-semibold rounded-[3px] px-1 shadow-sm mx-[1px]"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return (
    <>
      <div
        className={cn(
          "flex gap-2 message-bounce w-full group",
          isLastInGroup ? "mb-4" : "mb-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8 shrink-0">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Ostro"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* message & actions wrapper */}
        <div className="flex flex-col gap-1 max-w-[calc(100%-3rem)]">
          {isDeleted ? (
            <div
              className={cn(
                "text-sm italic text-muted-foreground/70 bg-transparent border border-dashed border-border px-4 py-2.5 rounded-2xl w-fit",
                message.isOwn ? "self-end" : "self-start",
              )}
            >
              Tin nhắn đã bị thu hồi
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center gap-2",
                message.isOwn ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "text-sm leading-relaxed break-words relative",
                    message.isOwn ? "chat-bubble-sent" : "chat-bubble-received",
                  )}
                >
                  {message.imgUrl && (
                    <img
                      src={message.imgUrl}
                      alt="Ảnh trong tin nhắn"
                      loading="lazy"
                      className={cn(
                        "max-h-80 w-full max-w-72 rounded-xl object-cover",
                        message.content ? "mb-2" : "",
                      )}
                    />
                  )}
                  {message.content &&
                    renderContent(message.content, searchKeyword)}
                  {isLastInGroup && (
                    <div
                      className={cn(
                        "text-[10px] mt-1 block",
                        message.isOwn
                          ? "text-right text-[hsl(var(--chat-bubble-sent-foreground))]/75"
                          : "text-left text-[hsl(var(--chat-bubble-received-foreground))]/65",
                      )}
                    >
                      {formatMessageTime(new Date(message.createdAt))}
                    </div>
                  )}
                </div>

                {/* reactions display */}
                {reactions.length > 0 && (
                  <div
                    className={cn(
                      "absolute -bottom-3 flex -space-x-1 z-10",
                      message.isOwn ? "right-2" : "left-2",
                    )}
                  >
                    {reactions.slice(0, 3).map((r) => (
                      <div
                        key={r.emoji}
                        className="flex items-center justify-center size-5 rounded-full bg-background ring-2 ring-background text-[10px] shadow-sm"
                      >
                        <span>{r.emoji}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* hover menu */}
              <div
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
                  message.isOwn ? "flex-row-reverse" : "flex-row",
                )}
              >
                <button
                  title="Trả lời"
                  className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground transition-colors shadow-sm bg-background border border-border"
                >
                  <Reply className="size-3.5" />
                </button>
                <EmojiPicker onChange={handleAddReaction}>
                  <button
                    title="Thả cảm xúc"
                    className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground transition-colors shadow-sm bg-background border border-border"
                  >
                    <SmilePlus className="size-3.5" />
                  </button>
                </EmojiPicker>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      title="Thêm"
                      className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground transition-colors shadow-sm bg-background border border-border"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={message.isOwn ? "end" : "start"}
                    className="w-48 bg-background border-border shadow-md"
                  >
                    <DropdownMenuItem>Copy tin nhắn</DropdownMenuItem>
                    <DropdownMenuItem>Ghim tin nhắn</DropdownMenuItem>
                    <DropdownMenuItem>Đánh dấu tin nhắn</DropdownMenuItem>
                    <DropdownMenuItem>Chọn nhiều tin nhắn</DropdownMenuItem>
                    <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    {message.isOwn && (
                      <DropdownMenuItem
                        onClick={handleRecallMessage}
                        className="text-red-500/80 focus:bg-red-500/10 focus:text-red-500/90 font-medium"
                      >
                        Thu hồi
                      </DropdownMenuItem>
                    )}
                    {message.isOwn && (
                      <DropdownMenuItem className="text-muted-foreground">
                        Delete for me Only
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* seen or delivered */}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <div className="w-full flex justify-end mt-1">
              <span className="text-[10px] text-muted-foreground/70">
                {lastMessageStatus === "seen" ? "Đã xem" : "Đã gửi"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(MessageItem, (prevProps, nextProps) => {
  if (prevProps.message._id !== nextProps.message._id) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;
  if (prevProps.message.imgUrl !== nextProps.message.imgUrl) return false;

  if (prevProps.index !== nextProps.index) return false;

  const prevNextMessage = prevProps.messages[prevProps.index + 1];
  const nextNextMessage = nextProps.messages[nextProps.index + 1];
  if (prevNextMessage?._id !== nextNextMessage?._id) return false;

  const wasLastMessage =
    prevProps.message._id === prevProps.selectedConvo.lastMessage?._id;
  const isLastMessage =
    nextProps.message._id === nextProps.selectedConvo.lastMessage?._id;

  if (wasLastMessage !== isLastMessage) return false;
  if (
    isLastMessage &&
    prevProps.lastMessageStatus !== nextProps.lastMessageStatus
  )
    return false;

  if (prevProps.searchKeyword !== nextProps.searchKeyword) return false;

  return true;
});
