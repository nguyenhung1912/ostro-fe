import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import React, { useState } from "react";
import { ImagePlus, Send, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");

  if (!user) return;

  const sendMessage = async () => {
    if (!value.trim()) return;
    const currentValue = value;
    setValue("");

    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser._id, currentValue);
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue);
      }
    } catch (error) {
      console.error("[MessageInput] Failed to send message:", error);
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-3 pb-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl glass border-0 shadow-none">
        {/* Attach button */}
        <button
          type="button"
          className="shrink-0 flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
        >
          <ImagePlus className="size-4" />
        </button>

        {/* Text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60 min-w-0"
        />

        {/* Emoji picker */}
        <div className="shrink-0 flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground cursor-pointer">
          <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)} />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={sendMessage}
          disabled={!value.trim()}
          className="shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
