import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import type { Conversation } from "@/types/chat";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { useSocketStore } from "./useSocketStore";

const sortConversations = (conversations: Conversation[]) => {
  return [...conversations].sort((a, b) => {
    const timeA =
      a.lastMessage?.createdAt || a.lastMessageAt || a.updatedAt || a.createdAt;
    const timeB =
      b.lastMessage?.createdAt || b.lastMessageAt || b.updatedAt || b.createdAt;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();

          set({
            conversations: sortConversations(conversations),
            convoLoading: false,
          });
        } catch (error) {
          console.error("[ChatStore] Failed to fetch conversations:", error);
          set({ convoLoading: false });
        }
      },

      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );

          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("[ChatStore] Failed to fetch messages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
          );

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("[ChatStore] Failed to send direct message:", error);
          throw error;
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imgUrl);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("[ChatStore] Failed to send group message:", error);
          throw error;
        }
      },

      recallMessage: async (messageId, conversationId) => {
        try {
          const recalled = await chatService.recallMessage(messageId);
          get().markMessageRecalled(
            recalled._id,
            recalled.conversationId ?? conversationId,
            undefined,
          );
        } catch (error) {
          console.error("[ChatStore] Failed to recall message:", error);
          throw error;
        }
      },

      markMessageRecalled: (messageId, conversationId, lastMessage) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: {
              ...(state.messages[conversationId] ?? {
                items: [],
                hasMore: false,
                nextCursor: null,
              }),
              items: (state.messages[conversationId]?.items ?? []).map((m) =>
                m._id === messageId
                  ? {
                      ...m,
                      isDeleted: true,
                      content: null,
                      imgUrl: null,
                    }
                  : m,
              ),
            },
          },
          conversations: state.conversations.map((c) =>
            c._id === conversationId && c.lastMessage?._id === messageId
              ? {
                  ...c,
                  lastMessage: lastMessage ?? {
                    ...c.lastMessage,
                    content: "Tin nhắn đã bị thu hồi",
                  },
                }
              : c,
          ),
        }));
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return state;
            }

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error("[ChatStore] Failed to add message:", error);
        }
      },

      updateConversation: (conversation) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c._id === conversation._id,
          );
          const newConvs = exists
            ? state.conversations.map((c) =>
                c._id === conversation._id ? { ...c, ...conversation } : c,
              )
            : [conversation as Conversation, ...state.conversations];
          return {
            conversations: sortConversations(newConvs),
          };
        });
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) return;

          const convo = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!convo) return;

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) return;

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.error("[ChatStore] Failed to mark as seen:", error);
        }
      },

      addConvo: (convo) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c._id.toString() === convo._id.toString(),
          );
          const newConvs = exists
            ? state.conversations
            : [convo, ...state.conversations];

          return {
            conversations: sortConversations(newConvs),
            activeConversationId: convo._id,
          };
        });
      },

      createConversation: async (type, name, memberIds) => {
        try {
          set({ loading: true });
          const conversation = await chatService.createConversation(
            type,
            name,
            memberIds,
          );

          get().addConvo(conversation);

          if (!get().messages[conversation._id]) {
            await get().fetchMessages(conversation._id);
          }

          useSocketStore
            .getState()
            .socket?.emit("join-conversation", conversation._id);
        } catch (error) {
          console.error("[ChatStore] Failed to create conversation:", error);
        } finally {
          set({ loading: false });
        }
      },

      deleteConversation: async (conversationId) => {
        try {
          await chatService.deleteConversation(conversationId);
          get().removeConversation(conversationId);
        } catch (error) {
          console.error("[ChatStore] Failed to delete conversation:", error);
          throw error;
        }
      },

      removeConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.filter(
            (c) => c._id !== conversationId,
          ),
          activeConversationId:
            state.activeConversationId === conversationId
              ? null
              : state.activeConversationId,
        }));
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);
