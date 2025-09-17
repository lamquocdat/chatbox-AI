import { useState, useEffect } from 'react';
import { Conversation, Message } from '../types';

const STORAGE_KEY = 'chatbox_conversations';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setConversations(conversationsWithDates);
        
        // Select the most recent conversation if exists
        if (conversationsWithDates.length > 0) {
          setCurrentConversationId(conversationsWithDates[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }, [conversations]);

  const createConversation = () => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    
    return newConversation;
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If we're deleting the current conversation, select another one
    if (id === currentConversationId) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const addMessage = (conversationId: string, messageData: Omit<Message, 'id'>) => {
    const message: Message = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, message];
        
        // Update title if this is the first user message
        let title = conv.title;
        if (message.role === 'user' && conv.messages.length === 0) {
          title = message.content.length > 50 
            ? message.content.substring(0, 50) + '...'
            : message.content;
        }
        
        return {
          ...conv,
          title,
          messages: updatedMessages,
          updatedAt: new Date(),
        };
      }
      return conv;
    }));
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id 
        ? { ...conv, title, updatedAt: new Date() }
        : conv
    ));
  };

  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversationId(null);
  };

  // Get current conversation
  const currentConversation = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId) || null
    : null;

  return {
    conversations,
    currentConversationId,
    currentConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    addMessage,
    updateConversationTitle,
    clearAllConversations,
  };
}
