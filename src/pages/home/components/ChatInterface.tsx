import { Toaster } from 'react-hot-toast';
import type { Settings } from '../../../types';
import ImageModal from '../../../components/ImageModal';
import DragDropOverlay from '../../../components/DragDropOverlay';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChatBox } from '../../../contexts/chatbox';
import { useConversations } from '../../../contexts/conversations';

interface ChatInterfaceProps {
    onToggleSidebar: () => void;
    sidebarCollapsed: boolean;
    settings: Settings;
}

export default function ChatInterface({
    onToggleSidebar,
    sidebarCollapsed,
}: ChatInterfaceProps) {
    // Get all chat state and handlers from context
    const {
        currentConversation,
        inputValue,
        setInputValue,
        attachedFiles,
        isDragging,
        isSending,
        selectedImage,
        setSelectedImage,
        handleSendMessage,
        handleCancelSend,
        handleRetryMessage,
        handleFileSelect,
        handleDragOver,
        handleDrop,
        removeFile,
        clearFiles,
        handleFileClick,
    } = useChatBox();

    const { loadMoreMessages, loadMoreMessagesError } = useConversations();

    // Check if any message is loading
    const isLoading = currentConversation?.messages.some((msg) => msg.isLoading) ?? false;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!inputValue.trim() && attachedFiles.length === 0) || isLoading) return;

        const message = inputValue.trim();
        const files = [...attachedFiles];

        setInputValue('');
        clearFiles();

        await handleSendMessage(message, files.length > 0 ? files : undefined);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div
            className="flex flex-col h-full w-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Toast Container with high z-index */}
            <Toaster
                position="top-center"
                toastOptions={{
                    className: '',
                    style: {
                        zIndex: 9999,
                    },
                }}
            />

            {/* Drag Overlay */}
            <DragDropOverlay isVisible={isDragging} />

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage.url}
                    fileName={selectedImage.name}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            {/* Header */}
            <ChatHeader
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={onToggleSidebar}
            />

            {/* Messages */}
            <MessageList
                messages={currentConversation?.messages || []}
                onFileClick={handleFileClick}
                onRetryMessage={handleRetryMessage}
                onLoadMore={() => currentConversation && loadMoreMessages(currentConversation.id)}
                hasMore={currentConversation?.messagePagination ? currentConversation.messagePagination.page < currentConversation.messagePagination.total_pages : false}
                isLoadingMore={false}
                loadMoreError={loadMoreMessagesError === currentConversation?.id}
                onRegenerateMessage={() => {
                    // TODO: Implement regenerate API when available
                }}
            />

            {/* Input */}
            <ChatInput
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                attachedFiles={attachedFiles}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
                onFileClick={handleFileClick}
                isLoading={isLoading}
                isSending={isSending}
                onCancelSend={handleCancelSend}
            />
        </div>
    );
}
