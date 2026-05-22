import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { sileo } from "sileo";
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
      sileo.error({ 
        title: "Không thể đổi ảnh đại diện", 
        description: "Đã có lỗi xảy ra khi tải ảnh lên. Bạn thử lại xem sao nhé." 
      });
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
      sileo.error({ 
        title: "Không thể đổi ảnh bìa", 
        description: "Tải ảnh lên không thành công. Bạn vui lòng thử lại nhé." 
      });
      throw error;
    }
  },

  updateProfile: async (payload) => {
    try {
      const { setUser } = useAuthStore.getState();
      const user = await userService.updateProfile(payload);
      setUser(user);
      useChatStore.getState().fetchConversations();
      sileo.success({ 
        title: "Cập nhật thành công", 
        description: "Thông tin mới của bạn đã được lưu lại rồi nhé." 
      });
    } catch (error) {
      console.error("[UserStore] Failed to update profile:", error);
      sileo.error({ 
        title: "Không thể lưu thông tin", 
        description: "Đã có lỗi xảy ra. Bạn vui lòng kiểm tra và thử lại sau nha." 
      });
      throw error;
    }
  },

  changePassword: async (payload) => {
    try {
      await userService.changePassword(payload);
      sileo.success({ 
        title: "Đổi mật khẩu thành công", 
        description: "Bạn nhớ dùng mật khẩu mới này cho lần đăng nhập tới nhé!" 
      });
    } catch (error) {
      console.error("[UserStore] Failed to change password:", error);
      sileo.error({ 
        title: "Đổi mật khẩu thất bại", 
        description: "Mật khẩu hiện tại chưa đúng hoặc đã có lỗi xảy ra. Bạn thử lại nhé." 
      });
      throw error;
    }
  },

  deleteAccount: async (password) => {
    try {
      await userService.deleteAccount(password);
      sileo.success({ 
        title: "Đã xóa tài khoản", 
        description: "Tài khoản của bạn đã được gỡ bỏ. Cảm ơn bạn đã đồng hành cùng Ostro nhé!" 
      });
      useAuthStore.getState().clearState();
    } catch (error) {
      console.error("[UserStore] Failed to delete account:", error);
      sileo.error({ 
        title: "Không thể xóa tài khoản", 
        description: "Mật khẩu xác nhận chưa chính xác. Bạn vui lòng kiểm tra lại nha." 
      });
      throw error;
    }
  },
}));