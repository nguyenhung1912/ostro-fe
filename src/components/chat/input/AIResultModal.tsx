import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface AIResultModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  isLoading: boolean;
}

export const AIResultModal: React.FC<AIResultModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  content,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {title}
            </span>
          </DialogTitle>
          <DialogDescription>
            Kết quả từ Gemini AI
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-2 min-h-[100px] text-sm text-foreground/90 whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">AI đang xử lý...</p>
            </div>
          ) : content ? (
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              {content}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Không có nội dung.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
