import { useFriendStore } from "@/stores/useFriendStore";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Users, UserPlus, Search } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Friend } from "@/types/user";
import type { Participant } from "@/types/chat";
import InviteSuggestionList from "../new-group-chat/InviteSuggestionList";
import SelectedUsersList from "../new-group-chat/SelectedUsersList";
import { sileo } from "sileo";
import { useChatStore } from "@/stores/useChatStore";
import { chatService } from "@/services/chatService";

interface AddGroupMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  existingParticipants: Participant[];
}

const AddGroupMemberModal = ({
  isOpen,
  onClose,
  conversationId,
  existingParticipants,
}: AddGroupMemberModalProps) => {
  const [search, setSearch] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { friends, getFriends } = useFriendStore();
  const [loading, setLoading] = useState(false);
  const { updateConversation } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      getFriends();
    }
  }, [isOpen, getFriends]);

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
      !existingParticipants.some((p) => p._id === friend._id) &&
      !invitedUsers.some((u) => u._id === friend._id),
  );

  const handleRemoveFriend = (friend: Friend) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (invitedUsers.length === 0) {
        sileo.warning({ title: "Chưa chọn thành viên", description: "Vui lòng chọn ít nhất một người bạn để thêm vào nhóm." });
        return;
      }

      setLoading(true);
      const updated = await chatService.addGroupMembers(
        conversationId,
        invitedUsers.map((u) => u._id),
      );

      updateConversation(updated);
      sileo.success({ title: "Thêm thành viên thành công", description: `Đã thêm ${invitedUsers.length} thành viên mới vào nhóm.` });
      onClose();
    } catch (error) {
      console.error("[AddGroupMemberModal] Failed to add members:", error);
      sileo.error({ title: "Thêm thành viên thất bại", description: "Bạn có thể không có quyền quản trị hoặc kết nối mạng có vấn đề." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 font-semibold text-xl text-foreground">
            <UserPlus className="w-5 h-5 text-muted-foreground" />
            Thêm thành viên vào nhóm
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="invite-member"
                className="text-sm font-semibold text-foreground/90"
              >
                Chọn bạn bè (Chỉ người đã kết bạn)
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="invite-member"
                  placeholder="Tìm bạn bè bằng tên..."
                  className="h-10 pl-9 bg-white/5 border-border/50 focus-visible:ring-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {search && filteredFriends.length > 0 && (
              <InviteSuggestionList
                filteredFriends={filteredFriends}
                onSelect={handleSelectFriend}
              />
            )}

            <SelectedUsersList
              invitedUsers={invitedUsers}
              onRemove={handleRemoveFriend}
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border/30">
            <Button
              type="submit"
              disabled={loading || invitedUsers.length === 0}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed h-10 font-medium transition-all"
            >
              {loading ? (
                <span>Đang thêm...</span>
              ) : (
                <>
                  <Users className="size-4 mr-2" />
                  Thêm vào nhóm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddGroupMemberModal;
