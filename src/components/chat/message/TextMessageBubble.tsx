import { cn, formatMessageTime } from "@/lib/utils";
import type { Message } from "@/types/chat";

interface TextMessageBubbleProps {
  message: Message;
  searchKeyword: string;
  isLastInGroup: boolean;
}

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renderContent = (content: string, keyword: string) => {
  const trimmed = keyword.trim();
  if (!trimmed) return <span>{content}</span>;
  try {
    const escaped = escapeRegex(trimmed);
    const regex = new RegExp(`(${escaped})`, "gi");
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
  } catch {
    return <span>{content}</span>;
  }
};

export const TextMessageBubble = ({
  message,
  searchKeyword,
  isLastInGroup,
}: TextMessageBubbleProps) => {
  return (
    <>
      {message.content && renderContent(message.content, searchKeyword)}
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
    </>
  );
};
