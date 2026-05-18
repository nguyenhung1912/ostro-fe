import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "../ui/input";
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
      console.error("[ChatApp - MessageInput]: Lỗi khi gửi tin nhắn.", error);
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 min-h-[56px] bg-card border-t-[3px] border-black">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none border-[3px] border-transparent hover:border-black hover:bg-accent transition-all hover:shadow-neobrutal-sm"
      >
        <ImagePlus className="size-5 text-black" />
      </Button>

      <div className="flex-1 relative">
        <Input
          onKeyPress={handleKeyPress}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="pr-12 h-12 bg-white border-[3px] border-black shadow-neobrutal-sm focus-visible:ring-0 focus-visible:border-primary rounded-none text-base font-bold transition-all text-black"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 rounded-none hover:bg-accent border-[2px] border-transparent hover:border-black transition-all"
          >
            <div>
              <EmojiPicker
                onChange={(emoji: string) => setValue(`${value}${emoji}`)}
              />
            </div>
          </Button>
        </div>
      </div>
      <Button
        onClick={sendMessage}
        className="h-12 w-12 btn-neobrutal bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!value.trim()}
      >
        <Send className="size-5" />
      </Button>
    </div>
  );
};
export default MessageInput;
