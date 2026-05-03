import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Logout = () => {
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  return <Button onClick={handleLogout}>Đăng xuất</Button>;
};

export default Logout;
