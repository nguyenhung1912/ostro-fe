import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import ProfileDialog from "../profile/ProfileDialog";
import FriendRequestDialog from "../friend-request/FriendRequestDialog";
import { Sidebar } from "@/components/ui/sidebar";
import { UtilityBar } from "./UtilityBar";
import { SidebarListContent } from "./SidebarListContent";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { conversations, fetchConversations } = useChatStore();
  const { getAllFriendRequest, receivedList, getFriends } = useFriendStore();

  const [activeTab, setActiveTab] = useState<"chats" | "contacts" | "groups">(
    "chats",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");

  const [friendRequestOpen, setFriendRequestOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetchConversations().catch(() => {});
    getFriends().catch(() => {});
    getAllFriendRequest().catch(() => {});
  }, [fetchConversations, getFriends, getAllFriendRequest]);

  const friendRequestCount = receivedList.length;
  const friendRequestBadge =
    friendRequestCount > 5 ? "5+" : friendRequestCount.toString();

  const unreadCountTotal = React.useMemo(() => {
    if (!user) return 0;
    return conversations.reduce((total, convo) => {
      const count = convo.unreadCounts?.[user._id] ?? 0;
      return total + count;
    }, 0);
  }, [conversations, user]);

  return (
    <Sidebar
      variant="inset"
      className="overflow-hidden border-r border-border bg-sidebar"
      {...props}
    >
      <div className="flex h-full w-full select-none">
        <UtilityBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setProfileOpen={setProfileOpen}
          setFriendRequestOpen={setFriendRequestOpen}
          friendRequestCount={friendRequestCount}
          friendRequestBadge={friendRequestBadge}
        />
        <SidebarListContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterTab={filterTab}
          setFilterTab={setFilterTab}
          unreadCountTotal={unreadCountTotal}
        />
      </div>

      <FriendRequestDialog
        open={friendRequestOpen}
        setOpen={setFriendRequestOpen}
      />
      <ProfileDialog open={profileOpen} setOpen={setProfileOpen} />
    </Sidebar>
  );
}
