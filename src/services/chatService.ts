import api from "@/lib/axios";
import type { AxiosProgressEvent } from "axios";
import type { ConversationResponse, Message } from "@/types/chat";

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;

export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const res = await api.get("/conversations");
    return res.data;
  },

  async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
    const res = await api.get(
      `/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`,
    );
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string = "",
    imgUrl?: string,
    conversationId?: string,
  ) {
    const res = await api.post("/messages/direct", {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });

    return res.data.message;
  },

  async uploadMessageImage(
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  ): Promise<{ imgUrl: string; imageId?: string }> {
    const res = await api.post("/messages/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    return res.data;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imgUrl?: string,
  ) {
    const res = await api.post("/messages/group", {
      conversationId,
      content,
      imgUrl,
    });

    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversations/${conversationId}/seen`);
    return res.data;
  },

  async recallMessage(messageId: string): Promise<Message> {
    const res = await api.patch(`/messages/${messageId}/recall`);
    return res.data.message;
  },

  async createConversation(
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) {
    const res = await api.post("/conversations", { type, name, memberIds });
    return res.data.conversation;
  },

  async deleteConversation(conversationId: string) {
    const res = await api.delete(`/conversations/${conversationId}`);
    return res.data;
  },

  async renameConversation(conversationId: string, name: string) {
    const res = await api.patch(`/conversations/${conversationId}/rename`, {
      name,
    });
    return res.data.conversation;
  },
};
