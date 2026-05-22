import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import { useSocketStore } from "@/stores/useSocketStore";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/common/avatar/UserAvatar";
import StatusBadge from "@/components/common/badges/StatusBadge";
import DirectMessageCard from "@/components/chat-list/DirectMessageCard";
import GroupChatCard from "@/components/chat-list/GroupChatCard";
import AddFriendModal from "../add-friend-modal/AddFriendModal";
import NewGroupChatModal from "../new-group-chat/NewGroupChatModal";
import { Search, X } from "lucide-react";

interface SidebarListContentProps {
  activeTab: "chats" | "contacts" | "groups";
  setActiveTab: (val: "chats" | "contacts" | "groups") => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterTab: "all" | "unread";
  setFilterTab: (val: "all" | "unread") => void;
  unreadCountTotal: number;
}

export function SidebarListContent({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  filterTab,
  setFilterTab,
  unreadCountTotal,
}: SidebarListContentProps) {
  const { user } = useAuthStore();
  const { conversations, convoLoading, createConversation } = useChatStore();
  const { friends } = useFriendStore();
  const { onlineUsers } = useSocketStore();

  const handleSelectFriend = async (friendId: string) => {
    try {
      await createConversation("direct", "", [friendId]);
      setActiveTab("chats");
    } catch (error) {
      console.error("[SidebarListContent] Failed to select friend:", error);
    }
  };

  const getFilteredChats = () => {
    const filteredByQuery = conversations.filter((convo) => {
      const lastMsgContent = convo.lastMessage?.content?.toLowerCase() || "";
      if (convo.type === "direct") {
        const other = convo.participants.find((p) => p._id !== user?._id);
        if (!other) return false;
        const displayName = (other.displayName || "").toLowerCase();
        const nickname = (other.nickname || "").toLowerCase();
        return (
          displayName.includes(searchQuery.toLowerCase()) ||
          nickname.includes(searchQuery.toLowerCase()) ||
          lastMsgContent.includes(searchQuery.toLowerCase())
        );
      } else {
        const groupName = (convo.group?.name || "").toLowerCase();
        return (
          groupName.includes(searchQuery.toLowerCase()) ||
          lastMsgContent.includes(searchQuery.toLowerCase())
        );
      }
    });

    if (filterTab === "unread" && user) {
      return filteredByQuery.filter(
        (c) => (c.unreadCounts?.[user._id] ?? 0) > 0,
      );
    }

    return filteredByQuery;
  };

  const getFilteredFriends = () => {
    return friends.filter((friend) => {
      const displayName = (friend.displayName || "").toLowerCase();
      const username = (friend.username || "").toLowerCase();
      return (
        displayName.includes(searchQuery.toLowerCase()) ||
        username.includes(searchQuery.toLowerCase())
      );
    });
  };

  const getFilteredGroups = () => {
    const groupChats = conversations.filter((convo) => convo.type === "group");
    const filteredByQuery = groupChats.filter((convo) => {
      const groupName = (convo.group?.name || "").toLowerCase();
      const lastMsgContent = convo.lastMessage?.content?.toLowerCase() || "";
      return (
        groupName.includes(searchQuery.toLowerCase()) ||
        lastMsgContent.includes(searchQuery.toLowerCase())
      );
    });

    if (filterTab === "unread" && user) {
      return filteredByQuery.filter(
        (c) => (c.unreadCounts?.[user._id] ?? 0) > 0,
      );
    }

    return filteredByQuery;
  };

  const renderListContent = () => {
    if (activeTab === "chats") {
      const displayChats = getFilteredChats();
      if (displayChats.length === 0) {
        return (
          <div className="p-8 text-center text-xs text-muted-foreground select-none">
            {searchQuery
              ? "Không tìm thấy cuộc trò chuyện"
              : "Chưa có cuộc trò chuyện"}
          </div>
        );
      }
      return (
        <div className="flex flex-col">
          {displayChats.map((convo) => {
            if (convo.type === "direct") {
              return <DirectMessageCard convo={convo} key={convo._id} />;
            } else {
              return <GroupChatCard convo={convo} key={convo._id} />;
            }
          })}
        </div>
      );
    }

    if (activeTab === "contacts") {
      const displayFriends = getFilteredFriends();
      if (displayFriends.length === 0) {
        return (
          <div className="p-8 text-center text-xs text-muted-foreground select-none">
            {searchQuery ? "Không tìm thấy bạn bè" : "Chưa có bạn bè"}
          </div>
        );
      }
      return (
        <div className="flex flex-col">
          {displayFriends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => handleSelectFriend(friend._id)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors border-b border-border/20 last:border-0"
            >
              <div className="relative flex-shrink-0">
                <UserAvatar
                  type="sidebar"
                  className="size-10 pointer-events-none"
                  name={friend.displayName}
                  avatarUrl={friend.avatarUrl ?? undefined}
                />
                <StatusBadge
                  status={
                    onlineUsers.includes(friend._id) ? "online" : "offline"
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {friend.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{friend.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "groups") {
      const displayGroups = getFilteredGroups();
      if (displayGroups.length === 0) {
        return (
          <div className="p-8 text-center text-xs text-muted-foreground select-none">
            {searchQuery ? "Không tìm thấy nhóm" : "Chưa có nhóm"}
          </div>
        );
      }
      return (
        <div className="flex flex-col">
          {displayGroups.map((convo) => (
            <GroupChatCard convo={convo} key={convo._id} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full overflow-hidden">
      {/* Top header: Ostro Title & Search actions */}
      <div className="p-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight text-foreground select-none">
            Ostro
          </h1>
          {/* Quick Actions (Add Friend & Create Group) */}
          <div className="flex items-center gap-1.5">
            <AddFriendModal />
            <NewGroupChatModal />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center mb-3">
          <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 bg-secondary/60 hover:bg-secondary/80 focus:bg-background border border-transparent focus:border-border/80 rounded-lg text-sm transition-all duration-150 outline-none placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-all"
              title="Xóa"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filters (All / Unread) - Only for Chat/Group lists */}
        {activeTab !== "contacts" && (
          <div className="flex gap-2 mb-1.5 select-none animate-in fade-in duration-200">
            <button
              onClick={() => setFilterTab("all")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer",
                filterTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary",
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterTab("unread")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1",
                filterTab === "unread"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary",
              )}
            >
              Chưa đọc
              {unreadCountTotal > 0 && (
                <span
                  className={cn(
                    "size-2 ml-1 rounded-full bg-red-500",
                    filterTab === "unread" && "bg-white",
                  )}
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 border-t border-border/10">
        {convoLoading ? (
          <div className="p-4 space-y-4">
            {/* Skeletons */}
            <div className="flex items-center gap-3">
              <div className="size-10 bg-muted animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-muted animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </div>
          </div>
        ) : (
          renderListContent()
        )}
      </div>
    </div>
  );
}
