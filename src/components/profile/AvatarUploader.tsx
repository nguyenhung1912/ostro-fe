import { useUserStore } from "@/stores/useUserStore";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Camera, Loader2 } from "lucide-react";
import { sileo } from "sileo";

const MAX_AVATAR_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { updateAvatarUrl } = useUserStore();

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      sileo.error({ title: "Không hỗ trợ định dạng này", description: "Ảnh đại diện chỉ có thể sử dụng định dạng JPG, PNG hoặc WebP." });
      input.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      sileo.error({ title: "Ảnh quá lớn", description: "Ảnh đại diện không được vượt quá 1MB. Vui lòng chọn ảnh nhỏ hơn." });
      input.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      await updateAvatarUrl(formData);
    } finally {
      setIsUploading(false);
      input.value = "";
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        onClick={handleClick}
        disabled={isUploading}
        aria-label="Tải ảnh đại diện"
        title="Tải ảnh đại diện"
        className="absolute -bottom-2 -right-2 size-9 rounded-full shadow-md hover:scale-115 transition duration-300 hover:bg-background disabled:pointer-events-none disabled:opacity-70"
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
      </Button>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleUpload}
      />
    </>
  );
};

export default AvatarUploader;
