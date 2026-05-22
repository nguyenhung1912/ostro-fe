import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { chatService } from "@/services/chatService";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import GroupChatAvatar from "@/components/common/avatar/GroupChatAvatar";
import { Phone, Video, Search, Edit2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sileo } from "sileo";
import GroupChatSettingsDropdown from "@/components/chat/header/GroupChatSettingsDropdown";
import AddGroupMemberModal from "@/components/group-management/AddGroupMemberModal";
import GroupMembersModal from "@/components/group-management/GroupMembersModal";

const GroupChatHeader = ({ currentChat }: { currentChat: Conversation }) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const defaultName = currentChat.group?.name;

  const handleEditSubmit = async () => {
    if (!editName.trim() || editName.trim() === defaultName) {
      setIsEditing(false);
      return;
    }
    try {
      await chatService.renameConversation(currentChat._id, editName);
      sileo.success({ title: "Tên nhóm đã cập nhật", description: "Tên mới đã được áp dụng và hiển thị cho mọi thành viên trong nhóm." });
    } catch {
      sileo.error({
        title: "Cập nhật tên nhóm thất bại",
        description: "Không thể lưu thay đổi. Kiểm tra kết nối mạng và thử lại.",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditSubmit();
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-10 px-5 flex items-center justify-between min-h-16 shrink-0 border-b border-border bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="p-2 w-full flex items-center gap-3">
          <div className="relative">
            <GroupChatAvatar
              participants={currentChat.participants}
              type="sidebar"
            />
          </div>
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => {
              setEditName(defaultName || "");
              setIsEditing(true);
            }}
          >
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditName(e.target.value)
                }
                onBlur={handleEditSubmit}
                onKeyDown={handleKeyDown}
                className="h-8 py-1 px-2 text-sm w-48 bg-white/5 border-border/50 focus-visible:ring-1"
              />
            ) : (
              <h2 className="font-semibold text-foreground select-none">
                {defaultName}
              </h2>
            )}
            {!isEditing && (
              <Edit2 className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <Phone className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gọi thoại (Sắp ra mắt)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <Video className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gọi video (Sắp ra mắt)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() =>
                  document.dispatchEvent(
                    new CustomEvent("toggle-message-search"),
                  )
                }
              >
                <Search className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tìm kiếm tin nhắn</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <GroupChatSettingsDropdown
          currentChat={currentChat}
          onOpenMembers={() => setIsMembersOpen(true)}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
        />
      </div>

      <AddGroupMemberModal
        key={`${currentChat._id}-${isAddMemberOpen}`}
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        conversationId={currentChat._id}
        existingParticipants={currentChat.participants}
      />
      <GroupMembersModal
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        participants={currentChat.participants}
        createdBy={currentChat.group?.createdBy}
        currentUserId={user?._id ?? ""}
      />
    </header>
  );
};

export default GroupChatHeader;
