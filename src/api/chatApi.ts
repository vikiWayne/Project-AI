import { apiClient } from "./client";
import { streamPost } from "./streamClient";
import { endpoints } from "./endpoints";
import type { ChatMessage } from "@/types/globalTypes";

export interface SendMessageRequest {
  messages: Array<{ role: ChatMessage["role"]; content: string }>;
  stream?: boolean;
}

export interface SendMessageResponse {
  message: string;
  id?: string;
}

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const { data } = await apiClient.post<SendMessageResponse>(endpoints.chat, request);
  return data;
}

export async function* streamMessage(request: SendMessageRequest): AsyncGenerator<string> {
  yield* streamPost(endpoints.chatStream, { ...request, stream: true });
}
