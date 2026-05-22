import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import EmojiPicker from "@/components/chat/input/EmojiPicker";
import { AIActionsMenu } from "@/components/chat/input/AIActionsMenu";
import { useChatStore } from "@/stores/useChatStore";
import { sileo } from "sileo";
import { chatService } from "@/services/chatService";

const MAX_MESSAGE_IMAGE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewUrlRef = useRef("");
  const [value, setValue] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const setSelectedImageFile = (file: File | null) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    const nextPreviewUrl = file ? URL.createObjectURL(file) : "";

    imagePreviewUrlRef.current = nextPreviewUrl;
    setImagePreviewUrl(nextPreviewUrl);
    setImageFile(file);
  };

  if (!user) return;

  const sendMessage = async () => {
    if ((!value.trim() && !imageFile) || isSending) return;

    const currentValue = value.trim();
    const currentImageFile = imageFile;

    setValue("");
    setSendError("");
    setIsSending(true);
    setUploadProgress(currentImageFile ? 1 : 0);

    try {
      let imgUrl: string | undefined;

      if (currentImageFile) {
        const formData = new FormData();
        formData.append("file", currentImageFile);

        const uploaded = await chatService.uploadMessageImage(
          formData,
          (event) => {
            if (!event.total) return;
            setUploadProgress(Math.round((event.loaded * 100) / event.total));
          },
        );

        imgUrl = uploaded.imgUrl;
      }

      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];

        if (!otherUser) {
          throw new Error("Không tìm thấy người nhận.");
        }

        await sendDirectMessage(otherUser._id, currentValue, imgUrl);
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue, imgUrl);
      }

      setSelectedImageFile(null);
    } catch (error) {
      console.error("[MessageInput] Failed to send message:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Gửi tin nhắn thất bại. Vui lòng thử lại.";

      setValue(currentValue);
      setSendError(message);
      sileo.error({
        title: "Không gửi được tin nhắn",
        description: "Kiểm tra kết nối mạng hoặc thử gửi lại.",
      });
    } finally {
      setIsSending(false);
      setUploadProgress(0);
    }
  };

  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      sileo.error({
        title: "Không hỗ trợ định dạng này",
        description: "Chỉ có thể đính kèm ảnh JPG, PNG hoặc WebP.",
      });
      input.value = "";
      return;
    }

    if (file.size > MAX_MESSAGE_IMAGE_SIZE) {
      sileo.error({
        title: "Tệp tin quá lớn",
        description: "Chỉ có thể đính kèm ảnh có dung lượng dưới 1MB.",
      });
      input.value = "";
      return;
    }

    setSelectedImageFile(file);
    setSendError("");
    input.value = "";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-3 pb-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-secondary border border-transparent shadow-none">
        {/* Attach button */}
        <button
          type="button"
          disabled={isSending}
          aria-label="Đính kèm ảnh"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 flex items-center justify-center size-8 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
        >
          <ImagePlus className="size-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleSelectImage}
        />

        {/* Text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (sendError) setSendError("");
          }}
          onKeyDown={handleKeyPress}
          spellCheck={false}
          disabled={isSending}
          aria-invalid={!!sendError}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60 min-w-0"
        />

        {/* AI Action Menu */}
        <AIActionsMenu
          conversationId={selectedConvo._id}
          currentDraft={value}
          onUpdateDraft={setValue}
          disabled={isSending}
        />

        {/* Emoji picker */}
        <div className="shrink-0 flex items-center justify-center size-8 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
          <EmojiPicker
            onChange={(emoji: string) => setValue(`${value}${emoji}`)}
          />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={sendMessage}
          disabled={(!value.trim() && !imageFile) || isSending}
          aria-label="Gửi tin nhắn"
          className="shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>
      {imagePreviewUrl && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/60 p-2">
          <img
            src={imagePreviewUrl}
            alt="Ảnh chuẩn bị gửi"
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {imageFile?.name}
            </p>
            {isSending && uploadProgress > 0 && (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={isSending}
            aria-label="Gỡ ảnh"
            onClick={() => setSelectedImageFile(null)}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {sendError && (
        <p className="mt-2 px-3 text-xs font-medium text-destructive">
          {sendError}
        </p>
      )}
    </div>
  );
};

export default MessageInput;
