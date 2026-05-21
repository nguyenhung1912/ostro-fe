import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useNavigate } from "react-router-dom";
import UserAvatar from "@/components/common/avatar/UserAvatar";
import {
  MessageSquare,
  Contact,
  Users,
  Sun,
  Moon,
  Settings,
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

interface UtilityBarProps {
  activeTab: "chats" | "contacts" | "groups";
  setActiveTab: (val: "chats" | "contacts" | "groups") => void;
  setProfileOpen: (val: boolean) => void;
  setFriendRequestOpen: (val: boolean) => void;
  friendRequestCount: number;
  friendRequestBadge: string;
}

export function UtilityBar({
  activeTab,
  setActiveTab,
  setProfileOpen,
  setFriendRequestOpen,
  friendRequestCount,
  friendRequestBadge,
}: UtilityBarProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin", { viewTransition: true });
  };

  return (
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
  );
}
