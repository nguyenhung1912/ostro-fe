import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full w-full flex-col overflow-hidden bg-background">
      <ChatWindowHeader />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center flex flex-col items-center select-none">
          {/* Floating glow orb */}
          <div className="relative mb-8">
            <div className="relative size-24 flex items-center justify-center bg-secondary rounded-full">
              <img src="/logo.svg" alt="Ostro logo" className="size-12 opacity-80" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Chào mừng đến Ostro
          </h2>
          <p className="text-muted-foreground text-sm">
            Hãy chọn một đoạn chat để bắt đầu.
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
