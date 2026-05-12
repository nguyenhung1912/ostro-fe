import { create } from "zustand";
import { authService } from "@/services/authService";
import type { AuthState, FetchMeOptions, RefreshOptions } from "@/types/store";
import {
  authToast,
  explicitSignOut,
  getAuthErrorMessage,
} from "@/lib/authUtils";
import { persist } from "zustand/middleware";
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

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
          authChecked: true,
        });
        localStorage.clear();
        useChatStore.getState().reset();
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
            "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.",
          );
          return true;
        } catch (error) {
          authToast.error(
            getAuthErrorMessage(error, "Đăng ký thất bại!", {
              400: "Thông tin đăng ký không hợp lệ. Hãy kiểm tra lại!",
              409: "Tên đăng nhập hoặc email đã được sử dụng.",
            }),
          );
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true });

          localStorage.clear();
          useChatStore.getState().reset();

          const { accessToken } = await authService.signIn(username, password);
          get().setAccessToken(accessToken);

          const fetchedUser = await get().fetchMe({ showErrorToast: false });
          if (!fetchedUser) {
            authToast.error(
              "Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!",
            );
            return false;
          }

          explicitSignOut.clear();
          useChatStore.getState().fetchConversations();

          authToast.success("Chào mừng bạn quay lại với Ostro");
          return true;
        } catch (error) {
          get().clearState();
          authToast.error(
            getAuthErrorMessage(error, "Đăng nhập thất bại!", {
              401: "Tên đăng nhập hoặc mật khẩu không đúng.",
              403: "Tên đăng nhập hoặc mật khẩu không đúng.",
            }),
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
          authToast.success("Đăng xuất thành công");
        } catch (error) {
          authToast.error(
            getAuthErrorMessage(error, "Lỗi xảy ra khi đăng xuất. Hãy thử lại"),
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
              "Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!",
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
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
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
