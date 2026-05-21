import { cn, formatMessageTime } from "@/lib/utils";
import type { Message } from "@/types/chat";

interface ImageMessageBubbleProps {
  message: Message;
  isLastInGroup: boolean;
}

export const ImageMessageBubble = ({
  message,
  isLastInGroup,
}: ImageMessageBubbleProps) => {
  return (
    <>
      <img
        src={message.imgUrl ?? undefined}
        alt="Ảnh trong tin nhắn"
        loading="lazy"
        className={cn(
          "max-h-80 w-full max-w-72 rounded-xl object-cover",
          message.content ? "mb-2" : "",
        )}
      />
      {!message.content && isLastInGroup && (
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
    </>
  );
};
