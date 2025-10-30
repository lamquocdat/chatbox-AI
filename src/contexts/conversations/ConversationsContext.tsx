import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import AIHubService from '../../services/AIHubService';
import type { Conversation, Message } from '../../types';
import type { ConversationResponse, MessageResponse } from '../authen/types';

const STORAGE_KEY = 'chatbox_conversations';

// Helper: Convert API response to local Conversation type
const convertApiConversation = (apiConv: ConversationResponse): Conversation => ({
    _id: apiConv._id,
    id: apiConv._id,
    user_id: apiConv.user_id,
    conversation_type: apiConv.conversation_type,
    title: apiConv.title,
    document_id: apiConv.document_id,
    message_count: apiConv.message_count,
    messages: [],
    createdAt: new Date(apiConv.created_at),
    updatedAt: new Date(apiConv.updated_at),
});

// Helper: Convert API message to local Message type
const convertApiMessage = (apiMsg: MessageResponse): Message => ({
    _id: apiMsg._id,
    id: apiMsg._id,
    conversation_id: apiMsg.conversation_id,
    sequence: apiMsg.sequence,
    role: apiMsg.role,
    content: apiMsg.content,
    model: apiMsg.model || undefined,
    token_in: apiMsg.token_in || undefined,
    token_out: apiMsg.token_out || undefined,
    timestamp: new Date(apiMsg.created_at),
});

interface ConversationsContextType {
    conversations: Conversation[];
    currentConversationId: string | null;
    currentConversation: Conversation | null;
    isLoading: boolean;
    sendingConversationId: string | null; // Track which conversation is sending
    conversationPagination: {
        page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
    } | null;
    loadMoreMessagesError: string | null;
    createConversation: (userId: string) => Conversation;
    selectConversation: (id: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    addMessage: (conversationId: string, messageData: Omit<Message, 'id'>) => string;
    updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
    deleteMessage: (conversationId: string, messageId: string) => void;
    updateConversationTitle: (id: string, title: string) => Promise<void>;
    updateConversationWithAPI: (tempId: string, conversationId: string) => void;
    loadConversationMessages: (conversationId: string) => Promise<void>;
    loadMoreConversations: () => Promise<void>;
    loadMoreMessages: (conversationId: string) => Promise<void>;
    refreshConversations: () => Promise<void>;
    clearAllConversations: () => void;
    setSendingConversationId: (id: string | null) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const useConversations = () => {
    const context = useContext(ConversationsContext);
    if (!context) {
        throw new Error('useConversations must be used within ConversationsProvider');
    }
    return context;
};

interface ConversationsProviderProps {
    children: ReactNode;
}

export const ConversationsProvider: React.FC<ConversationsProviderProps> = ({ children }) => {
    const { t } = useTranslation();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadMoreMessagesError, setLoadMoreMessagesError] = useState<string | null>(null);
    const [sendingConversationId, setSendingConversationId] = useState<string | null>(null);
    const [conversationPagination, setConversationPagination] = useState<{
        page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
    } | null>(null);

    // Load conversations from API on mount (only once)
    useEffect(() => {
        loadConversationsFromAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadConversationsFromAPI = async () => {
        try {
            setIsLoading(true);
            const response = await AIHubService.getConversations({
                conversation_type: 'chatbot',
                page: 1,
                page_size: 10
            });

            if (response.success && response.data) {
                const convertedConversations = response.data.map(convertApiConversation);

                setConversations(prev => {
                    const tempConversations = prev.filter(conv => conv.isNew);
                    return [...tempConversations, ...convertedConversations];
                });

                // Cập nhật pagination
                if (response.pagination) {
                    setConversationPagination(response.pagination);
                }
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
            toast.error(t('toast.failedToLoadConversations'), {
                duration: 3000,
                position: 'top-center',
            });
            loadConversationsFromLocalStorage();
        } finally {
            setIsLoading(false);
        }
    };

    const loadConversationsFromLocalStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const conversationsWithDates = parsed.map((conv: any) => ({
                    ...conv,
                    createdAt: new Date(conv.createdAt),
                    updatedAt: new Date(conv.updatedAt),
                    messages: conv.messages?.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    })) || [],
                }));

                setConversations(prev => {
                    const tempConversations = prev.filter(conv => conv.isNew);
                    return [...tempConversations, ...conversationsWithDates];
                });

            }
        } catch (error) {
            console.error('Failed to load conversations from localStorage:', error);
        }
    };

    // Save conversations to localStorage whenever they change (backup)
    useEffect(() => {
        try {
            const savedConversations = conversations.filter(conv => !conv.isNew);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedConversations));
        } catch (error) {
            console.error('Failed to save conversations:', error);
        }
    }, [conversations]);

    const loadConversationMessages = async (conversationId: string) => {
        try {
            const response = await AIHubService.getConversationMessages(conversationId, 1, 10);

            if (response.success && response.data) {
                const convertedMessages = response.data.map(convertApiMessage);

                setConversations(prev => prev.map(conv =>
                    conv.id === conversationId
                        ? {
                            ...conv,
                            messages: convertedMessages.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)),
                            messagePagination: response.pagination
                        }
                        : conv
                ));
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
            toast.error(t('toast.failedToLoadMessages'), {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const loadMoreConversations = async () => {
        if (!conversationPagination) return;
        if (conversationPagination.page >= conversationPagination.total_pages) return;

        try {
            setIsLoading(true);
            const nextPage = conversationPagination.page + 1;

            const response = await AIHubService.getConversations({
                conversation_type: 'chatbot',
                page: nextPage,
                page_size: 10
            });

            if (response.success && response.data) {
                const convertedConversations = response.data.map(convertApiConversation);

                setConversations(prev => {
                    const tempConversations = prev.filter(conv => conv.isNew);
                    const existingConversations = prev.filter(conv => !conv.isNew);
                    return [...tempConversations, ...existingConversations, ...convertedConversations];
                });

                if (response.pagination) {
                    setConversationPagination(response.pagination);
                }
            }
        } catch (error) {
            console.error('Failed to load more conversations:', error);
            toast.error(t('toast.failedToLoadConversations'), {
                duration: 3000,
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreMessages = async (conversationId: string) => {
        const conversation = conversations.find(conv => conv.id === conversationId);
        if (!conversation || !conversation.messagePagination) return;
        if (conversation.messagePagination.page >= conversation.messagePagination.total_pages) return;

        try {
            setLoadMoreMessagesError(null);
            const nextPage = conversation.messagePagination.page + 1;

            const response = await AIHubService.getConversationMessages(conversationId, nextPage, 10);

            if (response.success && response.data) {
                const convertedMessages = response.data.map(convertApiMessage);

                setConversations(prev => prev.map(conv =>
                    conv.id === conversationId
                        ? {
                            ...conv,
                            messages: [...convertedMessages, ...conv.messages].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)),
                            messagePagination: response.pagination
                        }
                        : conv
                ));
            }
        } catch (error) {
            console.error('Failed to load more messages:', error);
            setLoadMoreMessagesError(conversationId);
            toast.error(t('toast.failedToLoadMessages'), {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const createConversation = (userId: string) => {
        // Check if there's already a new conversation (isNew: true)
        const existingNewConv = conversations.find(conv => conv.isNew === true);

        if (existingNewConv) {
            // Return existing new conversation
            setCurrentConversationId(existingNewConv.id);
            return existingNewConv;
        }

        // Create new conversation
        const newConversation: Conversation = {
            id: `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            user_id: userId,
            conversation_type: 'chatbot',
            title: 'New Chat',
            message_count: 0,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isNew: true,
        };

        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);

        return newConversation;
    };

    const selectConversation = async (id: string) => {
        setCurrentConversationId(id);

        const conversation = conversations.find(conv => conv.id === id);

        if (conversation && conversation.messages.length === 0 && !conversation.isNew) {
            await loadConversationMessages(id);
        }
    };

    const deleteConversation = async (id: string) => {
        try {
            const conversation = conversations.find(conv => conv.id === id);

            if (conversation && conversation._id) {
                await AIHubService.deleteConversation(conversation._id);
            }

            setConversations(prev => prev.filter(conv => conv.id !== id));

            if (id === currentConversationId) {
                const remaining = conversations.filter(conv => conv.id !== id);
                setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
            throw error;
        }
    };

    const addMessage = (conversationId: string, messageData: Omit<Message, 'id'>) => {
        const message: Message = {
            ...messageData,
            id: messageData._id || `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                const updatedMessages = [...conv.messages, message];

                return {
                    ...conv,
                    messages: updatedMessages,
                    message_count: updatedMessages.length,
                    updatedAt: new Date(),
                };
            }
            return conv;
        }));

        return message.id;
    };

    const updateMessage = (conversationId: string, messageId: string, updates: Partial<Message>) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: conv.messages.map(msg =>
                        msg.id === messageId ? { ...msg, ...updates } : msg
                    ),
                    updatedAt: new Date(),
                };
            }
            return conv;
        }));
    };

    const deleteMessage = (conversationId: string, messageId: string) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: conv.messages.filter(msg => msg.id !== messageId),
                    updatedAt: new Date(),
                };
            }
            return conv;
        }));
    };

    const updateConversationTitle = async (id: string, title: string) => {
        try {
            const conversation = conversations.find(conv => conv.id === id);

            if (conversation && conversation._id) {
                await AIHubService.updateConversationTitle(conversation._id, title);
            }

            setConversations(prev => prev.map(conv =>
                conv.id === id
                    ? { ...conv, title, updatedAt: new Date() }
                    : conv
            ));
        } catch (error) {
            console.error('Failed to update conversation title:', error);
            throw error;
        }
    };

    const updateConversationWithAPI = (tempId: string, conversationId: string) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === tempId) {
                return {
                    ...conv,
                    _id: conversationId,
                    id: conversationId,
                    isNew: false,
                };
            }
            return conv;
        }));

        if (currentConversationId === tempId) {
            setCurrentConversationId(conversationId);
        }
    };

    const clearAllConversations = () => {
        setConversations([]);
        setCurrentConversationId(null);
    };

    const currentConversation = useMemo(() => {
        if (!currentConversationId) return null;
        return conversations.find(conv => conv.id === currentConversationId) || null;
    }, [currentConversationId, conversations]);

    const value: ConversationsContextType = {
        conversations,
        currentConversationId,
        currentConversation,
        isLoading,
        sendingConversationId,
        conversationPagination,
        loadMoreMessagesError,
        createConversation,
        selectConversation,
        deleteConversation,
        addMessage,
        updateMessage,
        deleteMessage,
        updateConversationTitle,
        updateConversationWithAPI,
        loadConversationMessages,
        loadMoreConversations,
        loadMoreMessages,
        refreshConversations: loadConversationsFromAPI,
        clearAllConversations,
        setSendingConversationId,
    };

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
};
