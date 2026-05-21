import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocketStore } from "@/stores/useSocketStore";
import { chatService } from "@/services/chatService";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/common/avatar/UserAvatar";
import StatusBadge from "@/components/common/badges/StatusBadge";
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DirectChatHeader = ({ currentChat }: { currentChat: Conversation }) => {
  const { deleteConversation } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const otherUsers = currentChat.participants.filter(
    (p) => p._id !== user?._id,
  );
  const otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

  if (!user || !otherUser) return null;

  const defaultName = otherUser?.nickname || otherUser?.displayName;

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
          <div className="relative">
            <UserAvatar
              type="sidebar"
              name={otherUser.displayName ?? ""}
              avatarUrl={otherUser.avatarUrl ?? undefined}
            />
            <StatusBadge
              status={
                onlineUsers.includes(otherUser._id) ? "online" : "offline"
              }
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
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4 mr-2" /> Xoá cuộc trò chuyện
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
    </header>
  );
};

export default DirectChatHeader;
