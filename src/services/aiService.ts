import api from "@/lib/axios";

export const aiService = {
  async summarizeConversation(conversationId: string): Promise<string> {
    const res = await api.post("/ai/summarize", { conversationId });
    return res.data.summary;
  },

  async generateGroupTitle(conversationId: string): Promise<string> {
    const res = await api.post("/ai/title", { conversationId });
    return res.data.title;
  },

  async extractActionItems(conversationId: string): Promise<string> {
    const res = await api.post("/ai/actions", { conversationId });
    return res.data.actionItems;
  },

  async improveMessage(content: string, tone: string): Promise<string> {
    const res = await api.post("/ai/improve", { content, tone });
    return res.data.improved;
  },

  async translateMessage(content: string, targetLanguage: string): Promise<string> {
    const res = await api.post("/ai/translate", { content, targetLanguage });
    return res.data.translated;
  },
};
