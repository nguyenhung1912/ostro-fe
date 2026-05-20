import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/chat", element: <ChatAppPage /> }],
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
            "!rounded-xl !border !border-border !bg-background !shadow-sm !text-foreground !font-medium !text-sm",
          style: {
            borderRadius: "12px",
          },
        }}
      />
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
      >
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
