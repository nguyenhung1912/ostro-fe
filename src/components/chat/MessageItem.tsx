import { memo } from "react";
import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000; // 5 min

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );
  return (
    <>
      {/* time */}
      {isShowTime && (
        <span className="text-xs text-muted-foreground px-1">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Ostro"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* message */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          <Card
            className={cn(
              "p-3 rounded-none",
              message.isOwn ? "chat-bubble-sent" : "chat-bubble-received",
            )}
          >
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>
          </Card>

          {/* seen or delivered */}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-4 border-[2px] border-black rounded-none shadow-[1px_1px_0px_0px_#000000] font-black uppercase tracking-wider",
                lastMessageStatus === "seen"
                  ? "bg-accent text-black"
                  : "bg-white text-black",
              )}
            >
              {lastMessageStatus === "seen" ? "Đã xem" : "Đã gửi"}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(MessageItem, (prevProps, nextProps) => {
  // Only re-render if the core message content or ID changed
  if (prevProps.message._id !== nextProps.message._id) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;

  // Check if its position in the list changed (unlikely for infinite scroll top append, but safe)
  if (prevProps.index !== nextProps.index) return false;

  // Check if the previous message (for grouping logic) changed
  const prevNextMessage = prevProps.messages[prevProps.index + 1];
  const nextNextMessage = nextProps.messages[nextProps.index + 1];
  if (prevNextMessage?._id !== nextNextMessage?._id) return false;

  // Track if it's the last message in the conversation.
  // If it was the last message, or became the last message, we need to check if the status changed.
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

  // If nothing above triggered a change, it's safe to skip rendering
  return true;
});
