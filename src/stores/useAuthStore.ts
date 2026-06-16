import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import type { AuthState, FetchMeOptions, RefreshOptions } from "@/types/store";
import { authToast, explicitSignOut } from "@/lib/authUtils";
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
          authToast.success(
            "Đăng ký thành công!",
            "Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu.",
          );
          return true;
        } catch {
          authToast.error(
            "Đăng ký không thành công",
            "Tên đăng nhập hoặc email có thể đã được sử dụng. Vui lòng kiểm tra lại.",
          );
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          get().clearState();
          set({ loading: true });

          const { accessToken } = await authService.signIn(username, password);
          get().setAccessToken(accessToken);

          const fetchedUser = await get().fetchMe({ showErrorToast: false });
          if (!fetchedUser) {
            authToast.error(
              "Phiên đăng nhập đã hết hạn",
              "Không thể tải thông tin. Vui lòng đăng nhập lại để tiếp tục.",
            );
            return false;
          }

          explicitSignOut.clear();
          useChatStore.getState().fetchConversations();

          authToast.success(
            "Chào mừng trở lại!",
            "Bạn đã đăng nhập vào Ostro thành công.",
          );
          return true;
        } catch {
          get().clearState();
          authToast.error(
            "Đăng nhập không thành công",
            "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
          );
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signInWithGoogle: async (credential) => {
        try {
          get().clearState();
          set({ loading: true });

          const { accessToken } = await authService.googleSignIn(credential);
          get().setAccessToken(accessToken);

          const fetchedUser = await get().fetchMe({ showErrorToast: false });
          if (!fetchedUser) {
            authToast.error(
              "Phiên đăng nhập đã hết hạn",
              "Không thể tải thông tin. Vui lòng đăng nhập lại để tiếp tục.",
            );
            return false;
          }

          explicitSignOut.clear();
          useChatStore.getState().fetchConversations();

          authToast.success(
            "Đăng nhập Google thành công!",
            "Bạn đã đăng nhập vào Ostro thông qua tài khoản Google của bạn.",
          );
          return true;
        } catch {
          get().clearState();
          authToast.error(
            "Đăng nhập Google thất bại",
            "Không thể xác thực tài khoản Google. Vui lòng thử lại.",
          );
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });

        try {
          await authService.signOut();
          authToast.success(
            "Đăng xuất thành công",
            "Hẹn gặp lại bạn lần sau nhé!",
          );
        } catch {
          authToast.error(
            "Đã đăng xuất thành công",
            "Tài khoản của bạn đã được thoát an toàn khỏi thiết bị này.",
          );
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
            authToast.error(
              "Không thể tải dữ liệu",
              "Kết nối bị gián đoạn hoặc bạn đã hết thời gian đăng nhập. Vui lòng thử lại hoặc đăng nhập lại nhé.",
            );
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
            authToast.error(
              "Bạn đã hết thời gian đăng nhập",
              "Để bảo mật tài khoản, vui lòng đăng nhập lại để tiếp tục sử dụng.",
            );
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
