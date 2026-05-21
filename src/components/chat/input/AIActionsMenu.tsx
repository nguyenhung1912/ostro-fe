import React, { useState } from "react";
import { Sparkles, Languages, ListTodo, PenSquare, MessageSquare, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { aiService } from "@/services/aiService";
import { AIResultModal } from "./AIResultModal";
import { sileo } from "sileo";

interface AIActionsMenuProps {
  conversationId: string;
  currentDraft: string;
  onUpdateDraft: (newDraft: string) => void;
  disabled?: boolean;
}

export const AIActionsMenu: React.FC<AIActionsMenuProps> = ({
  conversationId,
  currentDraft,
  onUpdateDraft,
  disabled,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    title: "",
    content: "",
    isLoading: false,
  });

  const openModal = (title: string) => {
    setModalState({ isOpen: true, title, content: "", isLoading: true });
  };

  const handleSummarize = async () => {
    openModal("Tóm tắt Hội thoại");
    try {
      const summary = await aiService.summarizeConversation(conversationId);
      setModalState((prev) => ({ ...prev, content: summary, isLoading: false }));
    } catch (error) {
      setModalState((prev) => ({ ...prev, isLoading: false }));
      sileo.error({ title: "Lỗi", description: "Không thể tóm tắt hội thoại." });
    }
  };

  const handleExtractActions = async () => {
    openModal("Công việc cần làm");
    try {
      const actions = await aiService.extractActionItems(conversationId);
      setModalState((prev) => ({ ...prev, content: actions, isLoading: false }));
    } catch (error) {
      setModalState((prev) => ({ ...prev, isLoading: false }));
      sileo.error({ title: "Lỗi", description: "Không thể trích xuất công việc." });
    }
  };

  const handleGenerateTitle = async () => {
    openModal("Đề xuất Tên Nhóm");
    try {
      const title = await aiService.generateGroupTitle(conversationId);
      setModalState((prev) => ({ ...prev, content: title, isLoading: false }));
    } catch (error) {
      setModalState((prev) => ({ ...prev, isLoading: false }));
      sileo.error({ title: "Lỗi", description: "Không thể tạo tên nhóm." });
    }
  };

  const handleImprove = async (tone: string) => {
    if (!currentDraft.trim()) {
      sileo.warning({ description: "Vui lòng nhập tin nhắn trước." });
      return;
    }
    sileo.info({ description: "Đang cải thiện tin nhắn..." });
    try {
      const improved = await aiService.improveMessage(currentDraft, tone);
      onUpdateDraft(improved);
      sileo.success({ description: "Đã cập nhật tin nhắn." });
    } catch (error) {
      sileo.error({ description: "Không thể cải thiện tin nhắn." });
    }
  };

  const handleTranslate = async (lang: string) => {
    if (!currentDraft.trim()) {
      sileo.warning({ description: "Vui lòng nhập tin nhắn trước." });
      return;
    }
    sileo.info({ description: "Đang dịch..." });
    try {
      const translated = await aiService.translateMessage(currentDraft, lang);
      onUpdateDraft(translated);
      sileo.success({ description: "Đã dịch tin nhắn." });
    } catch (error) {
      sileo.error({ description: "Không thể dịch tin nhắn." });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            aria-label="Tính năng AI"
            className="shrink-0 flex items-center justify-center size-8 rounded-full hover:bg-background transition-colors text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56" sideOffset={8}>
          <DropdownMenuItem onClick={handleSummarize}>
            <MessageSquare className="mr-2 size-4" />
            <span>Tóm tắt hội thoại</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExtractActions}>
            <ListTodo className="mr-2 size-4" />
            <span>Trích xuất công việc</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGenerateTitle}>
            <Tag className="mr-2 size-4" />
            <span>Đề xuất tên nhóm</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PenSquare className="mr-2 size-4" />
              <span>Viết lại tin nhắn</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleImprove("professional")}>
                  <span>Chuyên nghiệp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImprove("shorter")}>
                  <span>Ngắn gọn hơn</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImprove("friendlier")}>
                  <span>Thân thiện hơn</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImprove("clearer")}>
                  <span>Dễ hiểu hơn</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="mr-2 size-4" />
              <span>Dịch tin nhắn</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleTranslate("English")}>
                  <span>Sang Tiếng Anh</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTranslate("Vietnamese")}>
                  <span>Sang Tiếng Việt</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <AIResultModal
        isOpen={modalState.isOpen}
        onOpenChange={(open) => setModalState((prev) => ({ ...prev, isOpen: open }))}
        title={modalState.title}
        content={modalState.content}
        isLoading={modalState.isLoading}
      />
    </>
  );
};
