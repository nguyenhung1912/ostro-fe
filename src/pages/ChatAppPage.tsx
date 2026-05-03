import Logout from "@/components/auth/logout";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <>
      {user?.username}
      <Logout />
    </>
  );
};
export default ChatAppPage;
