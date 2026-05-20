import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });

        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("[UserStore] Failed to update avatar URL:", error);
      toast.error("Tải ảnh đại diện thất bại. Vui lòng thử lại.");
    }
  },

  updateCoverUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadCover(formData);

      if (user) {
        setUser({
          ...user,
          coverUrl: data.coverUrl,
        });
      }
    } catch (error) {
      console.error("[UserStore] Failed to update cover URL:", error);
      toast.error("Tải ảnh bìa thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  updateProfile: async (payload) => {
    try {
      const { setUser } = useAuthStore.getState();
      const user = await userService.updateProfile(payload);
      setUser(user);
      useChatStore.getState().fetchConversations();
      toast.success("Đã cập nhật hồ sơ.");
    } catch (error) {
      console.error("[UserStore] Failed to update profile:", error);
      toast.error("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  changePassword: async (payload) => {
    try {
      await userService.changePassword(payload);
      toast.success("Đã đổi mật khẩu.");
    } catch (error) {
      console.error("[UserStore] Failed to change password:", error);
      toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.");
      throw error;
    }
  },

  deleteAccount: async (password) => {
    try {
      await userService.deleteAccount(password);
      toast.success("Tài khoản đã được xoá.");
      useAuthStore.getState().clearState();
    } catch (error) {
      console.error("[UserStore] Failed to delete account:", error);
      toast.error("Xoá tài khoản thất bại. Vui lòng kiểm tra mật khẩu.");
      throw error;
    }
  },
}));
