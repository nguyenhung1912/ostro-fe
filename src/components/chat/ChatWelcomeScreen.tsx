import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full w-full bg-background border-[3px] border-black shadow-neobrutal flex-col">
      <ChatWindowHeader />
      <div className="flex flex-1 items-center justify-center bg-card">
        <div className="text-center flex flex-col items-center">
          <div className="mb-6 flex size-24 items-center justify-center bg-primary border-[3px] border-black shadow-neobrutal rounded-none hover:-translate-y-1 transition-transform">
            <span className="text-5xl">👀</span>
          </div>
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-black bg-accent px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
            Chào mừng đến Ostro!
          </h2>
          <p className="text-black font-bold text-lg mt-4 border-b-[2px] border-black pb-1">
            Hãy chọn một đoạn chat để bắt đầu.
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
