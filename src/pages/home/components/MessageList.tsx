import { useRef, useEffect, useState } from 'react';
import LoadMoreMessages from './messages/LoadMoreMessages';
import MessageItem from './messages/MessageItem';
import type { Message, FileAttachment } from '../../../types';

interface MessageListProps {
    messages: Message[];
    onFileClick: (file: FileAttachment) => void;
    onRetryMessage: (messageId: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    loadMoreError?: boolean;
    onRegenerateMessage?: (messageId: string) => void;
}

export default function MessageList({
    messages,
    onFileClick,
    onRetryMessage,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    loadMoreError = false,
    onRegenerateMessage
}: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (shouldScrollToBottom) {
            scrollToBottom();
        }
    }, [messages, shouldScrollToBottom]);

    // Handle scroll event to detect if user scrolled to top
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Check if scrolled to top (with small threshold)
        const isAtTop = container.scrollTop <= 50;

        if (isAtTop && hasMore && !isLoadingMore) {
            onLoadMore?.();
        }

        // Disable auto-scroll if user manually scrolls up
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        setShouldScrollToBottom(isAtBottom);
    };

    if (messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
                        <p className="text-lg mb-2">Start a conversation</p>
                        <p className="text-sm">Type a message below to begin chatting with AI</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4"
        >
            <div className="max-w-3xl mx-auto space-y-4">
                {/* Loading More Indicator or Error */}
                <LoadMoreMessages
                    isLoading={isLoadingMore}
                    hasError={loadMoreError}
                    onLoadMore={onLoadMore}
                />

                {/* Messages */}
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        onFileClick={onFileClick}
                        onRetryMessage={onRetryMessage}
                        onRegenerateMessage={onRegenerateMessage}
                    />
                ))}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
