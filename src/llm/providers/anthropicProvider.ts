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

const body = (messages: ReturnType<typeof toApiMessages>) => ({
  provider: "anthropic",
  messages,
  stream: true,
});

export const anthropicProvider: LLMProvider = {
  async sendMessage(messages: ChatMessage[]) {
    const { data } = await apiClient.post<{ message?: string; content?: string }>(endpoints.chat, {
      provider: "anthropic",
      messages: toApiMessages(messages),
      stream: false,
    });
    return { content: data.message ?? data.content ?? "" };
  },

  async *streamMessage(messages: ChatMessage[]) {
    for await (const raw of streamPost(endpoints.chatStream, body(toApiMessages(messages)))) {
      try {
        const parsed = JSON.parse(raw) as { delta?: { content?: string }; content?: string };
        const content = parsed?.delta?.content ?? parsed?.content;
        if (content) yield content;
      } catch {
        // skip invalid JSON
      }
    }
  },
};
