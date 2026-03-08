import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Conversation } from "@/types/globalTypes";
import { generateId } from "@/lib/utils";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;

  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, updater: (m: ChatMessage) => ChatMessage) => void;
  setConversation: (conversation: Conversation) => void;
  setActiveConversation: (id: string | null) => void;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  loadConversation: (id: string) => Conversation | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      loading: false,
      error: null,

      addMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: Date.now(),
                  title: c.title || (message.role === "user" ? getMessagePreview(message) : c.title),
                }
              : c
          ),
        }));
      },

      updateMessage: (conversationId, messageId, updater) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === messageId ? updater(m) : m)),
                  updatedAt: Date.now(),
                }
              : c
          ),
        }));
      },

      setConversation: (conversation) => {
        set((state) => {
          const exists = state.conversations.some((c) => c.id === conversation.id);
          return {
            conversations: exists
              ? state.conversations.map((c) => (c.id === conversation.id ? conversation : c))
              : [conversation, ...state.conversations],
          };
        });
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      createConversation: () => {
        const id = generateId();
        const conversation: Conversation = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId: state.activeConversationId === id ? state.conversations[0]?.id ?? null : state.activeConversationId,
        }));
      },

      loadConversation: (id) => {
        return get().conversations.find((c) => c.id === id);
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      clearConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, messages: [], title: "New Chat", updatedAt: Date.now() } : c
          ),
        }));
      },
    }),
    { name: "chatgpt-clone-store", partialize: (s) => ({ conversations: s.conversations }) }
  )
);

function getMessagePreview(message: ChatMessage): string {
  const text = message.content.find((c) => c.type === "text");
  if (text?.type === "text") {
    return text.text.slice(0, 50) + (text.text.length > 50 ? "..." : "");
  }
  return "New Chat";
}
