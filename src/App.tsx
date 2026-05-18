import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";

const router = createBrowserRouter([
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <ChatAppPage /> }],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark, setTheme]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken, connectSocket, disconnectSocket]);

  return (
    <>
      <Toaster
        position="bottom-right"
        expand={false}
        richColors={false}
        toastOptions={{
          className:
            "!rounded-2xl !border !border-white/15 !bg-white/80 dark:!bg-[#18181f]/90 !backdrop-blur-2xl !shadow-[0_8px_32px_rgba(0,0,0,0.18)] !text-foreground !font-medium !text-sm",
          style: {
            background: "rgba(255,255,255,0.80)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.20)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
