import { createContext, FC, PropsWithChildren, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useConversations } from '../conversations';
import { useAbortController } from '../../hooks/useAbortController';
import { useFileUpload } from '../../hooks/useFileUpload';
import AIHubService from '../../services/AIHubService';
import type { FileAttachment, Conversation } from '../../types';

type ChatBoxContextType = {
    // State
    inputValue: string;
    setInputValue: (value: string) => void;
    isSending: boolean;
    currentConversation: Conversation | null;

    // File upload state & methods
    attachedFiles: FileAttachment[];
    isDragging: boolean;
    handleFileSelect: (files: FileList | null) => Promise<void>;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => Promise<void>;
    removeFile: (fileId: string) => void;
    clearFiles: () => void;

    // Message actions
    handleSendMessage: (content: string, attachments?: FileAttachment[]) => Promise<void>;
    handleCancelSend: () => void;
    handleRetryMessage: (messageId: string) => void;
    handleFileClick: (file: FileAttachment) => void;

    // Pending message for restore
    pendingMessage: { content: string; attachments?: FileAttachment[] } | null;

    // Image modal
    selectedImage: { url: string; name: string } | null;
    setSelectedImage: (image: { url: string; name: string } | null) => void;
};

export const ChatBoxContext = createContext<ChatBoxContextType>({} as ChatBoxContextType);

interface ChatboxProviderProps extends PropsWithChildren {
    onFileClick?: (file: FileAttachment) => void;
}

const ChatboxProvider: FC<ChatboxProviderProps> = ({ children, onFileClick }) => {
    const { t } = useTranslation();
    const {
        currentConversation,
        sendingConversationId,
        setSendingConversationId,
        addMessage,
        deleteMessage,
        updateConversationTitle,
        updateConversationWithAPI,
    } = useConversations();

    const { createController, abort } = useAbortController();
    const {
        attachedFiles,
        isDragging,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeFile,
        clearFiles,
        setAttachedFiles,
    } = useFileUpload();

    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
    const pendingMessageRef = useRef<{ content: string; attachments?: FileAttachment[] } | null>(null);

    const handleCancelSend = useCallback(() => {
        // Cancel current request
        abort();
        setIsSending(false);

        // Restore pending message to input
        if (pendingMessageRef.current && currentConversation) {
            // Remove loading message if exists
            const loadingMessage = currentConversation.messages.find(msg => msg.isLoading);
            if (loadingMessage) {
                deleteMessage(currentConversation.id, loadingMessage.id);
            }

            // Remove user message that was just sent
            const lastUserMessage = [...currentConversation.messages]
                .reverse()
                .find(msg => msg.role === 'user' && !msg.isLoading);

            if (lastUserMessage) {
                deleteMessage(currentConversation.id, lastUserMessage.id);
            }

            // Restore message to input
            setInputValue(pendingMessageRef.current.content);
            if (pendingMessageRef.current.attachments) {
                setAttachedFiles(pendingMessageRef.current.attachments);
            }
        }
    }, [abort, currentConversation, deleteMessage, setAttachedFiles]);

    const handleRetryMessage = useCallback((messageId: string) => {
        if (!currentConversation) return;

        // Find the error message
        const errorMessageIndex = currentConversation.messages.findIndex(msg => msg.id === messageId);
        if (errorMessageIndex === -1) return;

        // Find the previous user message
        const previousMessages = currentConversation.messages.slice(0, errorMessageIndex);
        const lastUserMessage = [...previousMessages]
            .reverse()
            .find(msg => msg.role === 'user');

        if (!lastUserMessage) return;

        // Delete the error message
        deleteMessage(currentConversation.id, messageId);

        // Resend the message
        handleSendMessage(lastUserMessage.content, lastUserMessage.attachments);
    }, [currentConversation, deleteMessage]);

    const handleSendMessage = useCallback(async (content: string, attachments?: FileAttachment[]) => {
        if (!currentConversation) return;

        // Check if any conversation is already sending
        if (sendingConversationId) {
            toast.error(t('toast.pleaseWait'), {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        const conversationId = currentConversation.id;
        const isNewConversation = currentConversation.isNew;

        // Store pending message for potential restore
        pendingMessageRef.current = { content, attachments };
        setIsSending(true);
        setSendingConversationId(conversationId); // Mark this conversation as sending

        // Add user message with attachments
        addMessage(conversationId, {
            role: 'user',
            content,
            timestamp: new Date(),
            attachments: attachments,
        });

        // Add loading message from assistant
        const loadingMessageId = addMessage(conversationId, {
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isLoading: true,
        });

        try {
            // Create abort controller for this request
            const controller = createController();

            // Prepare API params
            const apiParams: any = {
                model: 'gemini-2.5-flash',
                contents: content,
                response_mime_type: "text/plain",
                conversation_type: 'chatbot',
            };

            // For new conversation - send title
            if (isNewConversation) {
                // Generate title from first message (max 5 words)
                const words = content.trim().split(/\s+/);
                const titleWords = words.slice(0, 5);
                const title = titleWords.join(' ') + (words.length > 5 ? '...' : '');

                apiParams.conversation_title = title;

                // Update local title immediately
                updateConversationTitle(conversationId, title);
            } else {
                // For existing conversation - send conversation_id
                if (currentConversation._id) {
                    apiParams.conversation_id = currentConversation._id;
                }
            }

            // Call AI service with abort signal
            const response = await AIHubService.generate(apiParams, controller.signal);

            // Remove loading message
            if (loadingMessageId) {
                deleteMessage(conversationId, loadingMessageId);
            }

            // Add AI response
            if (response.data && response.data.code === 200) {
                addMessage(conversationId, {
                    role: 'assistant',
                    content: response.data.data,
                    timestamp: new Date(),
                });

                // If this was a new conversation, update with API conversation_id
                if (isNewConversation && response.data.conversation_id) {
                    updateConversationWithAPI(conversationId, response.data.conversation_id);
                }
            } else {
                // Add error message if no response
                addMessage(conversationId, {
                    role: 'assistant',
                    content: t('chat.aiErrorMessage'),
                    timestamp: new Date(),
                    isError: true,
                });
            }

            // Clear pending message on success
            pendingMessageRef.current = null;
            setIsSending(false);
            setSendingConversationId(null); // Clear sending state
        } catch (error: any) {
            console.error('AI Service Error:', error);

            // Remove loading message
            if (loadingMessageId) {
                deleteMessage(conversationId, loadingMessageId);
            }

            // Check if error is from abort
            if (error.name === 'CanceledError' || error.message?.includes('cancel')) {
                // Request was cancelled - do nothing, handleCancelSend already handled it
                setSendingConversationId(null); // Clear sending state
                return;
            }

            // Add error message for other errors
            addMessage(conversationId, {
                role: 'assistant',
                content: t('chat.aiErrorMessage'),
                timestamp: new Date(),
                isError: true,
            });

            // Clear pending message
            pendingMessageRef.current = null;
            setIsSending(false);
            setSendingConversationId(null); // Clear sending state
        }
    }, [currentConversation, addMessage, deleteMessage, updateConversationTitle, updateConversationWithAPI, createController, t, sendingConversationId, setSendingConversationId]);

    const handleFileClickInternal = useCallback((file: FileAttachment) => {
        if (onFileClick) {
            onFileClick(file);
        }
    }, [onFileClick]);

    const value: ChatBoxContextType = {
        // State
        inputValue,
        setInputValue,
        isSending,
        currentConversation,

        // File upload
        attachedFiles,
        isDragging,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeFile,
        clearFiles,

        // Actions
        handleSendMessage,
        handleCancelSend,
        handleRetryMessage,
        handleFileClick: handleFileClickInternal,

        // Pending message
        pendingMessage: pendingMessageRef.current,

        // Image modal
        selectedImage,
        setSelectedImage,
    };

    return (
        <ChatBoxContext.Provider value={value}>
            {children}
        </ChatBoxContext.Provider>
    );
};

export default ChatboxProvider;
