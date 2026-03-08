export const endpoints = {
  chat: "/chat",
  chatStream: "/chat/stream",
  conversations: "/conversations",
  conversation: (id: string) => `/conversations/${id}`,
} as const;
