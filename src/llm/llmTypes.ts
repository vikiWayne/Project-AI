import type { ChatMessage } from "@/types/globalTypes";

export interface LLMProvider {
  sendMessage(messages: ChatMessage[]): Promise<{ content: string }>;
  streamMessage(messages: ChatMessage[]): AsyncIterable<string>;
}
