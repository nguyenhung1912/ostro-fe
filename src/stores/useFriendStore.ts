import { create } from "zustand";
import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  loading: false,
  receivedList: [],
  sentList: [],

  searchByUsername: async (username) => {
    try {
      set({ loading: true });
      return await friendService.searchByUsername(username);
    } catch (error) {
      console.error("[FriendStore] Failed to search user by username:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addFriend: async (to, message) => {
    try {
      set({ loading: true });
      return await friendService.sendFriendRequest(to, message);
    } catch (error) {
      console.error("[FriendStore] Failed to send friend request:", error);
      return "Lỗi xảy ra khi gửi kết bạn. Hãy thử lại!";
    } finally {
      set({ loading: false });
    }
  },

  getAllFriendRequest: async () => {
    try {
      set({ loading: true });

      const result = await friendService.getAllFriendRequest();
      if (!result) return;

      set({
        receivedList: result.received,
        sentList: result.sent,
      });
    } catch (error) {
      console.error("[FriendStore] Failed to fetch friend requests:", error);
    } finally {
      set({ loading: false });
    }
  },

  acceptRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestId,
        ),
      }));
    } catch (error) {
      console.error("[FriendStore] Failed to accept friend request:", error);
    } finally {
      set({ loading: false });
    }
  },

  declineRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestId,
        ),
      }));
    } catch (error) {
      console.error("[FriendStore] Failed to decline friend request:", error);
    } finally {
      set({ loading: false });
    }
  },

  getFriends: async () => {
    try {
      set({ loading: true });
      const friends = await friendService.getFriendList();
      set({ friends });
    } catch (error) {
      console.error("[FriendStore] Failed to fetch friends list:", error);
      set({ friends: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
