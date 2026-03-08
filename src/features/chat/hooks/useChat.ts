import { useCallback } from "react";
import { useChatStore } from "../store/chatStore";
import { chatService } from "../services/chatService";

export function useChat() {
  const {
    conversations,
    activeConversationId,
    loading,
    error,
    setActiveConversation,
    loadConversation,
    setError,
  } = useChatStore();

  const sendMessage = useCallback(
    (text: string) => {
      if (!activeConversationId) return;
      if (!text.trim()) return;
      chatService.sendMessage(activeConversationId, text.trim());
    },
    [activeConversationId]
  );

  const newChat = useCallback(() => {
    return chatService.createConversation();
  }, []);

  const removeConversation = useCallback((id: string) => {
    chatService.deleteConversation(id);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversation(id);
  }, [setActiveConversation]);

  const activeConversation = activeConversationId ? loadConversation(activeConversationId) : null;

  return {
    conversations,
    activeConversation,
    activeConversationId,
    loading,
    error,
    sendMessage,
    newChat,
    deleteConversation: removeConversation,
    selectConversation,
    clearError: () => setError(null),
  };
}
