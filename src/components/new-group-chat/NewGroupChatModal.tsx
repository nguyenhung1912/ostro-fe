import { useFriendStore } from "@/stores/useFriendStore";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Users, MessageSquarePlus, Search } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Friend } from "@/types/user";
import InviteSuggestionList from "../new-group-chat/InviteSuggestionList";
import SelectedUsersList from "../new-group-chat/SelectedUsersList";
import { sileo } from "sileo";
import { useChatStore } from "@/stores/useChatStore";

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { friends, getFriends } = useFriendStore();
  const { loading, createConversation } = useChatStore();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      getFriends();
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
      !invitedUsers.some((u) => u._id === friend._id),
  );

  const handleRemoveFriend = (friend: Friend) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (invitedUsers.length < 2) {
        sileo.warning({
          title: "Chưa đủ thành viên",
          description: "Nhóm trò chuyện cần có ít nhất 2 người (ngoài bạn).",
        });
        return;
      }

      await createConversation(
        "group",
        groupName,
        invitedUsers.map((u) => u._id),
      );

      sileo.success({
        title: "Nhóm đã được tạo",
        description: `Nhóm "${groupName}" đã sẵn sàng. Hãy bắt đầu trò chuyện!`,
      });

      setSearch("");
      setInvitedUsers([]);
      setGroupName("");
      setOpen(false);
    } catch (error) {
      console.error("[NewGroupChatModal] Failed to create group:", error);
      sileo.error({
        title: "Tạo nhóm thất bại",
        description: "Không thể tạo nhóm. Kiểm tra kết nối mạng và thử lại.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer"
        >
          <Users className="size-4" />
          <span className="sr-only">Tạo nhóm</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 font-semibold text-xl text-foreground">
            <MessageSquarePlus className="w-5 h-5 text-muted-foreground" />
            Tạo nhóm mới
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="groupName"
              className="text-sm font-semibold text-foreground/90"
            >
              Tên nhóm
            </Label>
            <Input
              id="groupName"
              placeholder="Nhập tên nhóm..."
              className="h-10 bg-white/5 border-border/50 focus-visible:ring-1"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="invite"
                className="text-sm font-semibold text-foreground/90"
              >
                Thêm thành viên
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="invite"
                  placeholder="Tìm bạn bè..."
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
              disabled={loading || invitedUsers.length < 2}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed h-10 font-medium transition-all"
            >
              {loading ? (
                <span>Đang tạo...</span>
              ) : (
                <>
                  <Users className="size-4 mr-2" />
                  Tạo nhóm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default NewGroupChatModal;
