import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "@/components/common/avatar/UserAvatar";
import { Reply, SmilePlus, MoreHorizontal } from "lucide-react";
import EmojiPicker from "@/components/chat/input/EmojiPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores/useChatStore";
import { sileo } from "sileo";
import { TextMessageBubble } from "@/components/chat/message/TextMessageBubble";
import { ImageMessageBubble } from "@/components/chat/message/ImageMessageBubble";

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
      sileo.error({
        title: "Không thể thu hồi",
        description:
          "Tin nhắn đã quá thời hạn được phép thu hồi hoặc đã bị xoá.",
      });
    }
  };

  if (message.isSystem) {
    return (
      <div className="flex justify-center w-full my-4">
        <span className="text-xs italic text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full border border-border/50 shadow-sm">
          {message.content}
        </span>
      </div>
    );
  }

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
          {selectedConvo.type === "group" && !message.isOwn && isGroupBreak && (
            <span className="text-[11px] font-semibold text-muted-foreground/85 select-none ml-1 mb-0.5 animate-in fade-in duration-200">
              {participant?.nickname ||
                participant?.displayName ||
                "Thành viên"}
            </span>
          )}
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
                    <ImageMessageBubble
                      message={message}
                      isLastInGroup={!message.content && isLastInGroup}
                    />
                  )}
                  {message.content && (
                    <TextMessageBubble
                      message={message}
                      searchKeyword={searchKeyword}
                      isLastInGroup={isLastInGroup}
                    />
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
