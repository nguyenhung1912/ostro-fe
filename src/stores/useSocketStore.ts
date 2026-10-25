import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";
import type { Conversation } from "@/types/chat";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

let isRefreshingSocket = false;
let visibilityHandler: (() => void) | null = null;

const syncChatData = async () => {
  try {
    await useChatStore.getState().fetchConversations();
    const activeConversationId = useChatStore.getState().activeConversationId;
    if (activeConversationId) {
      await useChatStore
        .getState()
        .syncActiveConversation(activeConversationId);
    }
  } catch (err) {
    console.error("[Socket client] Error syncing chat data:", err);
  }
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseUrl, {
      auth: (cb) => {
        cb({ token: useAuthStore.getState().accessToken });
      },
      transports: ["websocket", "polling"],
    });

    set({ socket });

    // Handle connection & reconnection sync
    socket.on("connect", () => {
      console.log("[Socket client] Connected:", socket.id);
      syncChatData();
    });

    // Handle connect_error & expired token refresh
    socket.on("connect_error", async (error) => {
      console.warn("[Socket client] Connect error:", error.message);

      const isUnauthorized =
        error.message.toLowerCase().includes("unauthorized") ||
        error.message.includes("Token");
      const isBanned = error.message.includes("bị khóa");

      if (isUnauthorized && !isBanned) {
        if (isRefreshingSocket) return;
        isRefreshingSocket = true;

        try {
          const refreshed = await useAuthStore
            .getState()
            .refresh({ showErrorToast: false });
          if (refreshed) {
            socket.connect();
          }
        } catch (refreshErr) {
          console.error(
            "[Socket client] Failed to refresh token upon connect_error:",
            refreshErr,
          );
        } finally {
          isRefreshingSocket = false;
        }
      }
    });

    // online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      console.log(
        "[Socket client] Received new-message:",
        message,
        conversation,
        unreadCounts,
      );
      useChatStore.getState().addMessage(message);

      const senderId = conversation.lastMessage?.senderId;
      const currentUser = useAuthStore.getState().user;
      const existingConvo = useChatStore
        .getState()
        .conversations.find((c) => c._id === message.conversationId);

      let displayName = "";
      let avatarUrl = null;

      if (senderId) {
        if (currentUser && senderId === currentUser._id) {
          displayName = currentUser.displayName;
          avatarUrl = currentUser.avatarUrl ?? null;
        } else {
          const participant = existingConvo?.participants.find(
            (p) => p._id === senderId,
          );
          if (participant) {
            displayName = participant.displayName;
            avatarUrl = participant.avatarUrl ?? null;
          }
        }
      }

      const lastMessage = conversation.lastMessage
        ? {
            _id: conversation.lastMessage._id,
            content: conversation.lastMessage.content,
            createdAt: conversation.lastMessage.createdAt,
            senderId: senderId
              ? {
                  _id: senderId,
                  displayName: displayName,
                  avatarUrl: avatarUrl,
                }
              : null,
          }
        : null;

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        useChatStore.getState().markAsSeen();
      }

      useChatStore.getState().updateConversation(updatedConversation);
    });

    // read message
    socket.on(
      "read-message",
      ({ conversationId, lastMessage, seenBy, unreadCounts }) => {
        const updated = {
          _id: conversationId,
          lastMessage,
          unreadCounts,
          seenBy,
        } as Conversation;

        useChatStore.getState().updateConversation(updated);
      },
    );

    socket.on(
      "message-recalled",
      ({ messageId, conversationId, lastMessage }) => {
        useChatStore
          .getState()
          .markMessageRecalled(messageId, conversationId, lastMessage);
      },
    );

    // new group chat
    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
    });

    socket.on("delete-conversation", ({ conversationId }) => {
      useChatStore.getState().removeConversation(conversationId);
    });

    socket.on("rename-conversation", ({ conversation }) => {
      useChatStore.getState().updateConversation(conversation);
    });

    // Handle tab visibility change (sync when tab/app becomes visible)
    if (typeof document !== "undefined") {
      if (visibilityHandler) {
        document.removeEventListener("visibilitychange", visibilityHandler);
      }

      visibilityHandler = () => {
        if (document.visibilityState === "visible") {
          const currentSocket = get().socket;
          if (currentSocket && !currentSocket.connected) {
            currentSocket.connect();
          }
          syncChatData();
        }
      };

      document.addEventListener("visibilitychange", visibilityHandler);
    }
  },

  disconnectSocket: () => {
    if (typeof document !== "undefined" && visibilityHandler) {
      document.removeEventListener("visibilitychange", visibilityHandler);
      visibilityHandler = null;
    }

    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
