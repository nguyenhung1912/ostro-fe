import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";
import type { Conversation } from "@/types/chat";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseUrl, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("[SocketStore] Successfully established connection.");
    });

    // online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      const senderId = conversation.lastMessage.senderId;
      const currentUser = useAuthStore.getState().user;
      const existingConvo = useChatStore
        .getState()
        .conversations.find((c) => c._id === message.conversationId);

      let displayName = "";
      let avatarUrl = null;

      if (senderId === currentUser?._id) {
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

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        senderId: {
          _id: senderId,
          displayName: displayName,
          avatarUrl: avatarUrl,
        },
      };

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
      useChatStore
        .getState()
        .deleteConversation(conversationId)
        .catch(() => {});
    });

    socket.on("rename-conversation", ({ conversation }) => {
      useChatStore.getState().updateConversation(conversation);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
