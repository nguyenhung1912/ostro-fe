import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import type { AuthState, FetchMeOptions, RefreshOptions } from "@/types/store";
import {
  authToast,
  explicitSignOut,
  getAuthErrorMessage,
} from "@/lib/authUtils";
import {
  clearChatScrollSessionState,
  clearPersistedSessionState,
} from "@/lib/sessionState";
import { useChatStore } from "./useChatStore";

let authInitializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      authChecked: false,

      setAccessToken: (accessToken) => {
        set({ accessToken, authChecked: true });
      },

      setUser: (user) => {
        set({ user });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
          authChecked: true,
        });

        useChatStore.getState().reset();
        clearPersistedSessionState();
        clearChatScrollSessionState();
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({ loading: true });

          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );
          authToast.success("Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.");
          return true;
        } catch (error) {
          authToast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          get().clearState();
          set({ loading: true });

          clearPersistedSessionState();
          useChatStore.getState().reset();

          const { accessToken } = await authService.signIn(username, password);
          get().setAccessToken(accessToken);

          const fetchedUser = await get().fetchMe({ showErrorToast: false });
          if (!fetchedUser) {
            authToast.error("Xác minh thất bại. Vui lòng thử lại.");
            return false;
          }

          explicitSignOut.clear();
          useChatStore.getState().fetchConversations();

          authToast.success("Chào mừng trở lại Ostro! 👋");
          return true;
        } catch (error) {
          get().clearState();
          authToast.error("Đăng nhập thất bại. Sai tên đăng nhập hoặc mật khẩu.");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });

        try {
          await authService.signOut();
          authToast.success("Đã đăng xuất thành công.");
        } catch (error) {
          authToast.error("Đăng xuất thất bại. Vui lòng thử lại.");
        } finally {
          explicitSignOut.mark();
          get().clearState();
        }
      },

      fetchMe: async ({ showErrorToast = true }: FetchMeOptions = {}) => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user, authChecked: true });
          return true;
        } catch {
          set({ user: null, accessToken: null, authChecked: true });

          if (showErrorToast) {
            authToast.error("Không thể tải thông tin tài khoản. Vui lòng thử lại.");
          }

          return false;
        } finally {
          set({ loading: false });
        }
      },

      refresh: async ({ showErrorToast = true }: RefreshOptions = {}) => {
        if (explicitSignOut.check()) {
          get().clearState();
          return false;
        }

        try {
          set({ loading: true });
          const accessToken = await authService.refresh();

          get().setAccessToken(accessToken);

          if (!get().user) {
            return get().fetchMe({ showErrorToast });
          }

          return true;
        } catch {
          if (showErrorToast) {
            authToast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }

          get().clearState();
          return false;
        } finally {
          set({ loading: false });
        }
      },

      initializeAuth: async () => {
        if (get().authChecked) {
          return;
        }

        if (explicitSignOut.check()) {
          get().clearState();
          return;
        }

        if (authInitializationPromise) {
          return authInitializationPromise;
        }

        authInitializationPromise = (async () => {
          try {
            set({ loading: true });

            let accessToken = get().accessToken;
            if (!accessToken) {
              accessToken = await authService.refresh();
              set({ accessToken });
            }

            if (!get().user) {
              const user = await authService.fetchMe();
              set({ user });
            }
          } catch {
            get().clearState();
          } finally {
            set({ loading: false, authChecked: true });
            authInitializationPromise = null;
          }
        })();

        return authInitializationPromise;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
