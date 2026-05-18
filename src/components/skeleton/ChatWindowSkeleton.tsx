import { SidebarInset } from "../ui/sidebar";

const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-transparent">
      <div className="flex bg-white dark:bg-card border-l-[3px] border-black flex-1 items-center justify-center">
        <div className="text-center space-y-6">
          <div className="size-42 mx-auto mb-6 bg-muted border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_var(--shadow-color)] animate-pulse" />
          <div className="w-96 h-10 bg-muted border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_var(--shadow-color)] mx-auto animate-pulse" />
          <div className="w-72 h-8 bg-muted border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_var(--shadow-color)] mx-auto animate-pulse" />
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWindowSkeleton;
