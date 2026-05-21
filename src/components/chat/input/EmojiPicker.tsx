import { useThemeStore } from "@/stores/useThemeStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  children?: React.ReactNode;
}

interface EmojiSelection {
  native?: string;
}

const EmojiPicker = ({ onChange, children }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger asChild={!!children} className="cursor-pointer">
        {children || <Smile className="size-4" />}
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-12"
      >
        <Picker
          theme={isDark ? "dark" : "light"}
          data={data}
          onEmojiSelect={(emoji: EmojiSelection) => {
            if (emoji.native) {
              onChange(emoji.native);
            }
          }}
          emojiSize={24}
        />
      </PopoverContent>
    </Popover>
  );
};
export default EmojiPicker;
