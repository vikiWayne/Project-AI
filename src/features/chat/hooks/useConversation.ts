import { useCallback, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { chatService } from "../services/chatService";

export function useConversation() {
  const { activeConversationId, createConversation, setActiveConversation } = useChatStore();

  useEffect(() => {
    if (!activeConversationId && useChatStore.getState().conversations.length === 0) {
      createConversation();
    }
  }, [activeConversationId, createConversation]);

  const ensureActiveConversation = useCallback(() => {
    if (!activeConversationId) {
      return chatService.createConversation();
    }
    return activeConversationId;
  }, [activeConversationId]);

  return {
    activeConversationId,
    ensureActiveConversation,
    createConversation,
    setActiveConversation,
  };
}
