import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { MoreVertical, Trash2, UserPlus, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface GroupChatSettingsDropdownProps {
  currentChat: Conversation;
  onOpenMembers: () => void;
  onOpenAddMember: () => void;
}

const GroupChatSettingsDropdown = ({
  currentChat,
  onOpenMembers,
  onOpenAddMember,
}: GroupChatSettingsDropdownProps) => {
  const { deleteConversation } = useChatStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <>
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
          <DropdownMenuItem className="cursor-pointer" onSelect={onOpenMembers}>
            <Users className="size-4 mr-2" /> Thành viên nhóm
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={onOpenAddMember}
          >
            <UserPlus className="size-4 mr-2" /> Thêm thành viên
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4 mr-2" /> Xoá cuộc trò chuyện
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
};

export default GroupChatSettingsDropdown;
