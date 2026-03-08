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
  provider: "custom",
  messages,
  stream: true,
});

export const customProvider: LLMProvider = {
  async sendMessage(messages: ChatMessage[]) {
    const { data } = await apiClient.post<{ message?: string; content?: string }>(endpoints.chat, {
      provider: "custom",
      messages: toApiMessages(messages),
      stream: false,
    });
    return { content: data.message ?? data.content ?? "" };
  },

  async *streamMessage(messages: ChatMessage[]) {
    for await (const raw of streamPost(endpoints.chatStream, body(toApiMessages(messages)))) {
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const choices = parsed?.choices as Array<{ delta?: { content?: string } }> | undefined;
        const delta = parsed?.delta as { content?: string } | undefined;
        const content =
          choices?.[0]?.delta?.content ?? delta?.content ?? (parsed?.content as string);
        if (typeof content === "string") yield content;
      } catch {
        // skip invalid JSON
      }
    }
  },
};
