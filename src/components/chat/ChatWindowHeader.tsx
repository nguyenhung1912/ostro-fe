import { useChatStore } from "@/stores/useChatStore";
import { chatService } from "@/services/chatService";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/stores/useSocketStore";
import { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  UserPlus,
  Users,
} from "lucide-react";
import AddGroupMemberModal from "./AddGroupMemberModal";
import GroupMembersModal from "./GroupMembersModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId, deleteConversation } =
    useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  let otherUser;

  const currentChat =
    chat ?? conversations.find((c) => c._id === activeConversationId);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!currentChat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="ml-1 text-foreground" />
      </header>
    );
  }

  if (currentChat.type === "direct") {
    const otherUsers = currentChat.participants.filter(
      (p) => p._id !== user?._id,
    );
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return null;
  }

  const defaultName =
    currentChat.type === "direct"
      ? otherUser?.nickname || otherUser?.displayName
      : currentChat.group?.name;

  const handleEditSubmit = async () => {
    if (!editName.trim() || editName.trim() === defaultName) {
      setIsEditing(false);
      return;
    }
    try {
      await chatService.renameConversation(currentChat._id, editName);
      toast.success("Đổi tên thành công!");
    } catch {
      toast.error("Không thể đổi tên cuộc trò chuyện");
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditSubmit();
    if (e.key === "Escape") setIsEditing(false);
  };

  const handleDeleteConversation = async () => {
    if (!currentChat?._id) return;
    try {
      setIsDeleting(true);
      await deleteConversation(currentChat._id);
      toast.success("Đã xoá cuộc trò chuyện");
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error("Không thể xoá cuộc trò chuyện");
    } finally {
      setIsDeleting(false);
    }
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
          {/* avatar */}
          <div className="relative">
            {currentChat.type === "direct" ? (
              <>
                <UserAvatar
                  type="sidebar"
                  name={otherUser?.displayName ?? ""}
                  avatarUrl={otherUser?.avatarUrl ?? undefined}
                />
                <StatusBadge
                  status={
                    onlineUsers.includes(otherUser?._id ?? "")
                      ? "online"
                      : "offline"
                  }
                />
              </>
            ) : (
              <GroupChatAvatar
                participants={currentChat.participants}
                type="sidebar"
              />
            )}
          </div>
          {/* name */}
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
                onChange={(e) => setEditName(e.target.value)}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:text-foreground ml-1"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-background border-border/50 shadow-xl"
          >
            {currentChat.type === "group" && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setIsMembersOpen(true)}
                >
                  <Users className="size-4 mr-2" />
                  Thành viên nhóm
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setIsAddMemberOpen(true)}
                >
                  <UserPlus className="size-4 mr-2" />
                  Thêm thành viên
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4 mr-2" />
              Xoá cuộc trò chuyện
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xoá cuộc trò chuyện?</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground text-sm py-2">
            Bạn có chắc chắn muốn xoá cuộc trò chuyện này không? Hành động này
            không thể hoàn tác.
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConversation}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xoá..." : "Xoá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentChat.type === "group" && (
        <>
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
        </>
      )}
    </header>
  );
};
export default ChatWindowHeader;
