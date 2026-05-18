import * as React from "react";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import FriendCarousel from "./FriendCarousel";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <Sidebar variant="inset" className="glass border-r-0 my-2 ml-2 rounded-2xl overflow-hidden" {...props}>
      {/* Header */}
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center justify-between px-3 py-2.5 mb-2">
              <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Ostro
              </h1>
              <div className="flex items-center gap-2">
                <Sun className="size-3.5 text-muted-foreground" />
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="size-3.5 text-muted-foreground" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent className="beautiful-scrollbar pt-2">
        {/* Friends Carousel */}
        <SidebarGroup className="pt-0 pb-2">
          <SidebarGroupContent>
            <FriendCarousel />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Group Chat */}
        <SidebarGroup>
          <div className="flex items-center justify-between mt-4">
            <SidebarGroupLabel className="uppercase font-semibold text-muted-foreground tracking-wider text-xs">
              nhóm chat
            </SidebarGroupLabel>
            <NewGroupChatModal />
          </div>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Direct Message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-semibold text-muted-foreground tracking-wider text-xs mt-4">
            bạn bè
          </SidebarGroupLabel>
          <SidebarGroupAction title="Kết Bạn" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
