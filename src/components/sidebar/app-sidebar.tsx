import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import { useSocketStore } from "@/stores/useSocketStore";
import { cn } from "@/lib/utils";

// Components
import UserAvatar from "../chat/UserAvatar";
import StatusBadge from "../chat/StatusBadge";
import DirectMessageCard from "../chat/DirectMessageCard";
import GroupChatCard from "../chat/GroupChatCard";
import AddFriendModal from "../chat/AddFriendModal";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import ProfileDialog from "../profile/ProfileDialog";
import FriendRequestDialog from "../friendRequest/FriendRequestDialog";
import { Sidebar } from "@/components/ui/sidebar";

// UI / Icons
import {
  MessageSquare,
  Contact,
  Users,
  Sun,
  Moon,
  Settings,
  Search,
  X,
  LogOut,
  Bell,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const {
    conversations,
    convoLoading,
    fetchConversations,
    createConversation,
  } = useChatStore();
  const { getAllFriendRequest, receivedList, friends, getFriends } =
    useFriendStore();
  const { onlineUsers } = useSocketStore();

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

  const handleLogout = async () => {
    await signOut();
    navigate("/signin", { viewTransition: true });
  };

  const handleSelectFriend = async (friendId: string) => {
    try {
      await createConversation("direct", "", [friendId]);
      setActiveTab("chats");
    } catch (error) {
      console.error("[AppSidebar] Failed to select friend:", error);
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
    <Sidebar
      variant="inset"
      className="overflow-hidden border-r border-border bg-sidebar"
      {...props}
    >
      <div className="flex h-full w-full select-none">
        {/* Column 1: Narrow Utility Bar */}
        <div className="w-[64px] flex flex-col justify-between items-center py-4 bg-slate-50 text-slate-600 dark:bg-zinc-950 dark:text-zinc-400 border-r border-slate-200/80 dark:border-border/20 flex-shrink-0">
          {/* Top: Current User Avatar with green online dot */}
          <div className="flex flex-col items-center">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative focus:outline-none cursor-pointer active:scale-95 transition-transform">
                    <UserAvatar
                      type="sidebar"
                      className="size-11 ring-2 ring-black/5 dark:ring-white/5"
                      name={user.displayName}
                      avatarUrl={user.avatarUrl ?? undefined}
                    />
                    <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-slate-50 dark:border-zinc-950 rounded-full animate-in zoom-in-50 duration-200" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 p-2 rounded-xl border border-border bg-popover shadow-sm ml-2"
                  side="right"
                  align="start"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <UserAvatar
                        type="chat"
                        name={user.displayName}
                        avatarUrl={user.avatarUrl ?? undefined}
                      />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user.displayName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.username}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setProfileOpen(true)}
                      className="cursor-pointer"
                    >
                      <UserIcon className="size-4 mr-2" />
                      Tài Khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFriendRequestOpen(true)}
                      className="cursor-pointer"
                    >
                      <Bell className="size-4 mr-2" />
                      <span>Thông Báo</span>
                      {friendRequestCount > 0 && (
                        <Badge className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold">
                          {friendRequestBadge}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 hover:text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
                  >
                    <LogOut className="size-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Middle: Tab switching icons */}
          <div className="flex flex-col gap-5 w-full items-center">
            {/* Chats tab */}
            <button
              onClick={() => setActiveTab("chats")}
              className={cn(
                "relative p-3 rounded-xl transition-all duration-150 cursor-pointer active:scale-95",
                activeTab === "chats"
                  ? "text-primary bg-primary/10 dark:text-blue-400 dark:bg-blue-950/30"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 dark:text-zinc-500 dark:hover:text-zinc-350 dark:hover:bg-zinc-900/50",
              )}
              title="Tin nhắn"
            >
              {activeTab === "chats" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary dark:bg-blue-500 rounded-r-md" />
              )}
              <MessageSquare className="size-6" />
            </button>

            {/* Contacts tab */}
            <button
              onClick={() => setActiveTab("contacts")}
              className={cn(
                "relative p-3 rounded-xl transition-all duration-150 cursor-pointer active:scale-95",
                activeTab === "contacts"
                  ? "text-primary bg-primary/10 dark:text-blue-400 dark:bg-blue-950/30"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 dark:text-zinc-500 dark:hover:text-zinc-355 dark:hover:bg-zinc-900/50",
              )}
              title="Danh bạ"
            >
              {activeTab === "contacts" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary dark:bg-blue-500 rounded-r-md" />
              )}
              <Contact className="size-6" />
            </button>

            {/* Groups tab */}
            <button
              onClick={() => setActiveTab("groups")}
              className={cn(
                "relative p-3 rounded-xl transition-all duration-150 cursor-pointer active:scale-95",
                activeTab === "groups"
                  ? "text-primary bg-primary/10 dark:text-blue-400 dark:bg-blue-950/30"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 dark:text-zinc-500 dark:hover:text-zinc-360 dark:hover:bg-zinc-900/50",
              )}
              title="Nhóm"
            >
              {activeTab === "groups" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary dark:bg-blue-500 rounded-r-md" />
              )}
              <Users className="size-6" />
            </button>
          </div>

          {/* Bottom: Dark Mode & Settings */}
          <div className="flex flex-col gap-4 items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-slate-200/60 dark:hover:bg-zinc-900/50 text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300 transition-all duration-150 active:scale-95 cursor-pointer"
              title={isDark ? "Chế độ sáng" : "Chế độ tối"}
            >
              {isDark ? (
                <Sun className="size-5.5" />
              ) : (
                <Moon className="size-5.5" />
              )}
            </button>

            {/* Settings dropdown button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-3 rounded-xl hover:bg-slate-200/60 dark:hover:bg-zinc-900/50 text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300 transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none"
                  title="Cài đặt"
                >
                  <Settings className="size-5.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 p-2 rounded-xl border border-border bg-popover shadow-sm ml-2"
                side="right"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onClick={() => setProfileOpen(true)}
                  className="cursor-pointer"
                >
                  <UserIcon className="size-4 mr-2" />
                  Tài Khoản
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFriendRequestOpen(true)}
                  className="cursor-pointer"
                >
                  <Bell className="size-4 mr-2" />
                  <span>Thông Báo</span>
                  {friendRequestCount > 0 && (
                    <Badge className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold">
                      {friendRequestBadge}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
                >
                  <LogOut className="size-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Column 2: Chat / Contacts List */}
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
      </div>

      <FriendRequestDialog
        open={friendRequestOpen}
        setOpen={setFriendRequestOpen}
      />
      <ProfileDialog open={profileOpen} setOpen={setProfileOpen} />
    </Sidebar>
  );
}
