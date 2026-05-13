import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Logout = () => {
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <Button variant="completeGhost" onClick={handleLogout}>
      <LogOut className="text-destructive" />
      Đăng xuất
    </Button>
  );
};
export default Logout;
