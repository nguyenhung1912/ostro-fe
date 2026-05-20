import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Users, Crown } from "lucide-react";
import type { Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  createdBy?: string;
  currentUserId: string;
}

const GroupMembersModal = ({
  isOpen,
  onClose,
  participants,
  createdBy,
  currentUserId,
}: GroupMembersModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 font-semibold text-xl text-foreground">
            <Users className="w-5 h-5 text-muted-foreground" />
            Thành viên nhóm ({participants.length})
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto pr-1 divide-y divide-border/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          {participants.map((p) => {
            const isCreator = createdBy === p._id;
            const isMe = currentUserId === p._id;

            return (
              <div
                key={p._id}
                className="flex items-center justify-between py-3 first:pt-1 last:pb-1"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar
                    type="sidebar"
                    name={p.displayName}
                    avatarUrl={p.avatarUrl ?? undefined}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {p.displayName}
                      {isMe && (
                        <span className="text-muted-foreground font-normal text-xs">
                          (Bạn)
                        </span>
                      )}
                    </span>
                    {p.nickname && (
                      <span className="text-xs text-muted-foreground">
                        Biệt danh: {p.nickname}
                      </span>
                    )}
                  </div>
                </div>

                {isCreator && (
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 px-2 py-1 rounded-full text-[10px] font-medium border border-amber-500/20">
                    <Crown className="size-3" />
                    Trưởng nhóm
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersModal;
