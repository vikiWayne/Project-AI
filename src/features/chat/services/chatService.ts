import { getLLMClient } from "@/llm/llmClient";
import { useChatStore } from "../store/chatStore";
import type { ChatMessage } from "@/types/globalTypes";
import { generateId } from "@/lib/utils";
import { llmConfig } from "@/config/llmConfig";

export const chatService = {
  async sendMessage(conversationId: string, userText: string) {
    const store = useChatStore.getState();
    const conversation = store.loadConversation(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: [{ type: "text", text: userText }],
      createdAt: Date.now(),
      status: "sent",
    };
    store.addMessage(conversationId, userMessage);

    const assistantId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: [{ type: "text", text: "" }],
      createdAt: Date.now(),
      status: "sending",
    };
    store.addMessage(conversationId, assistantMessage);

    const messages: ChatMessage[] = [...conversation.messages, userMessage, assistantMessage];
    store.setLoading(true);
    store.setError(null);

    try {
      const client = getLLMClient();

      if (llmConfig.enableStreaming) {
        let fullText = "";
        for await (const chunk of client.streamMessage(messages)) {
          fullText += chunk;
          store.updateMessage(conversationId, assistantId, (m) => ({
            ...m,
            content: [{ type: "text", text: fullText }],
            status: "sending",
          }));
        }
        store.updateMessage(conversationId, assistantId, (m) => ({
          ...m,
          status: "sent",
        }));
      } else {
        const { content } = await client.sendMessage(messages);
        store.updateMessage(conversationId, assistantId, (m) => ({
          ...m,
          content: [{ type: "text", text: content }],
          status: "sent",
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send message";
      store.setError(message);
      store.updateMessage(conversationId, assistantId, (m) => ({
        ...m,
        status: "error",
        content: [{ type: "text", text: `Error: ${message}` }],
      }));
    } finally {
      store.setLoading(false);
    }
  },

  createConversation() {
    return useChatStore.getState().createConversation();
  },

  deleteConversation(id: string) {
    useChatStore.getState().deleteConversation(id);
  },

  loadConversation(id: string) {
    return useChatStore.getState().loadConversation(id);
  },
};
