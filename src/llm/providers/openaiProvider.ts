import type { LLMProvider } from "../llmTypes";
import type { ChatMessage } from "@/types/globalTypes";
import { apiClient } from "@/api/client";
import { streamPost } from "@/api/streamClient";
import { endpoints } from "@/api/endpoints";

function toApiMessages(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role !== "system" || import.meta.env.DEV)
    .map((m) => {
      const text = m.content.find((c) => c.type === "text");
      return { role: m.role, content: text?.type === "text" ? text.text : "" };
    })
    .filter((m) => m.content);
}

export const openaiProvider: LLMProvider = {
  async sendMessage(messages: ChatMessage[]) {
    const { data } = await apiClient.post<{ message?: string; content?: string }>(endpoints.chat, {
      messages: toApiMessages(messages),
      stream: false,
    });
    return { content: data.message ?? data.content ?? "" };
  },

  async *streamMessage(messages: ChatMessage[]) {
    for await (const raw of streamPost(endpoints.chatStream, {
      messages: toApiMessages(messages),
      stream: true,
    })) {
      try {
        const parsed = JSON.parse(raw) as { choices?: Array<{ delta?: { content?: string } }> };
        const content = parsed?.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip invalid JSON
      }
    }
  },
};
