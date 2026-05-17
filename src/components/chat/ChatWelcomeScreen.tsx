import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full w-full bg-transparent">
      <ChatWindowHeader />
      <div className="flex flex-1 items-center justify-center rounded-2xl bg-primary-foreground">
        <div className="text-center">
          <div className="pulse-ring mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-chat shadow-glow">
            <span className="text-3xl">😶‍🌫️</span>
          </div>
          <h2 className="mb-2 bg-gradient-chat bg-clip-text text-2xl font-bold text-transparent">
            Chào mừng bạn đến với Ostro!
          </h2>
          <p className="text-muted-foreground">
            Chọn một cuộc hội thoại để bắt đầu chat!
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
