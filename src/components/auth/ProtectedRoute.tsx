import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const loading = useAuthStore((s) => s.loading);
  const authChecked = useAuthStore((s) => s.authChecked);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  if (!authChecked || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};
export default ProtectedRoute;
