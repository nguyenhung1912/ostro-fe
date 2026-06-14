import api from "@/lib/axios";
import type { User } from "@/types/user";

export interface UpdateProfilePayload {
  displayName: string;
  bio?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post("/users/uploadAvatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  uploadCover: async (formData: FormData) => {
    const res = await api.post("/users/uploadCover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data as { coverUrl: string };
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const res = await api.patch("/users/me", payload);
    return res.data.user as User;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    await api.patch("/users/password", payload);
  },

  deleteAccount: async (password: string) => {
    await api.delete("/users/me", { data: { password } });
  },
};
