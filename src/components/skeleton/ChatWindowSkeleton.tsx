import { SidebarInset } from "../ui/sidebar";

const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-transparent">
      <div className="flex bg-transparent flex-1 items-center justify-center">
        <div className="text-center space-y-6">
          <div className="size-24 mx-auto mb-6 bg-muted/40 rounded-full animate-pulse" />
          <div className="w-64 h-4 bg-muted/40 rounded-full mx-auto animate-pulse" />
          <div className="w-48 h-3 bg-muted/30 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWindowSkeleton;
