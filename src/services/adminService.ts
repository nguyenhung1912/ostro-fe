import api from "@/lib/axios";

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: "admin" | "moderator" | "user";
  isBanned: boolean;
  isActivated: boolean;
  createdAt: string;
  status: "online" | "offline" | "banned" | "inactive";
}

export interface AdminGroupParticipant {
  userId: {
    _id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
  nickname: string | null;
  joinedAt: string;
}

export interface AdminGroup {
  _id: string;
  type: "group";
  participants: AdminGroupParticipant[];
  group: {
    name: string;
    createdBy: {
      _id: string;
      displayName: string;
      username: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  dau: number;
  mau: number;
  messageVolume: { date: string; count: number }[];
  registrationGrowth: { date: string; count: number }[];
}

export const adminService = {
  fetchUsers: async (): Promise<AdminUser[]> => {
    const { data } = await api.get<AdminUser[]>("/admin/users");
    return data;
  },

  updateUserRole: async (userId: string, role: string): Promise<void> => {
    await api.patch(`/admin/users/${userId}/role`, { role });
  },

  toggleBan: async (userId: string): Promise<{ isBanned: boolean }> => {
    const { data } = await api.patch<{ user: { isBanned: boolean } }>(
      `/admin/users/${userId}/ban`,
    );
    return { isBanned: data.user.isBanned };
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  fetchGroups: async (): Promise<AdminGroup[]> => {
    const { data } = await api.get<AdminGroup[]>("/admin/groups");
    return data;
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await api.delete(`/admin/groups/${groupId}`);
  },

  fetchAnalytics: async (): Promise<AnalyticsData> => {
    const { data } = await api.get<AnalyticsData>("/admin/analytics");
    return data;
  },
};
