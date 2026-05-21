import { cn, formatMessageTime } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { FileIcon } from "lucide-react";

interface FileMessageBubbleProps {
  message: Message;
  isLastInGroup: boolean;
}

export const FileMessageBubble = ({
  message,
  isLastInGroup,
}: FileMessageBubbleProps) => {
  // Placeholder for when we add file sharing
  return (
    <div className="flex items-center gap-2">
      <FileIcon className="size-5" />
      <span className="text-sm font-medium">Tệp đính kèm</span>
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
  );
};
