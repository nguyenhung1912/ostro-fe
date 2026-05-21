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
import { sileo } from "sileo";

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
  const { leaveGroup } = useChatStore();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeaveGroup = async () => {
    try {
      setIsLeaving(true);
      await leaveGroup(currentChat._id);
      sileo.success({ title: "Đã rời nhóm", description: "Bạn sẽ không còn nhận được tin nhắn mới từ nhóm này." });
      setIsLeaveDialogOpen(false);
    } catch (error) {
      const message = (error as any).response?.data?.message || "Hệ thống gặp sự cố. Kiểm tra kết nối mạng và thử lại.";
      sileo.error({ title: "Không thể rời nhóm", description: message });
    } finally {
      setIsLeaving(false);
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
            onSelect={() => setIsLeaveDialogOpen(true)}
          >
            <Trash2 className="size-4 mr-2" /> Rời nhóm
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rời nhóm?</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground text-sm py-2">
            Bạn có chắc chắn muốn rời khỏi nhóm này không? Bạn sẽ không thể xem hay gửi tin nhắn nữa.
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsLeaveDialogOpen(false)}
              disabled={isLeaving}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              disabled={isLeaving}
            >
              {isLeaving ? "Đang rời..." : "Rời nhóm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupChatSettingsDropdown;
