import { useState, useEffect, useRef } from 'react';
import { Clock, ChevronDown, ChevronRight, RefreshCw, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ConversationItem from './ConversationItem';
import type { Conversation } from '../../types';

interface HistorySectionProps {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    sendingConversationId?: string | null;
    onSelectConversation: (id: string) => void;
    onRenameConversation: (id: string, newTitle: string) => void;
    onDeleteConversation: (id: string) => void;
    onRefreshConversations?: () => void;
    onLoadMoreConversations?: () => void;
    hasMoreConversations?: boolean;
    isLoadingMore?: boolean;
}

export default function HistorySection({
    conversations,
    currentConversation,
    sendingConversationId,
    onSelectConversation,
    onRenameConversation,
    onDeleteConversation,
    onRefreshConversations,
    onLoadMoreConversations,
    hasMoreConversations = false,
    isLoadingMore = false,
}: HistorySectionProps) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(true);
    const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const optionsRef = useRef<HTMLDivElement>(null);

    // Close options popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setOpenOptionsId(null);
            }
        };

        if (openOptionsId) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [openOptionsId]);

    const handleStartRename = (conv: Conversation) => {
        setRenamingId(conv.id);
        setRenameValue(conv.title);
        setOpenOptionsId(null);
    };

    const handleSaveRename = async (id: string) => {
        if (renameValue.trim() && renameValue !== conversations.find(c => c.id === id)?.title) {
            await onRenameConversation(id, renameValue.trim());
        }
        setRenamingId(null);
    };

    const handleCancelRename = () => {
        setRenamingId(null);
        setRenameValue('');
    };

    const handleDeleteConversation = async (id: string) => {
        setOpenOptionsId(null);
        await onDeleteConversation(id);
    };

    const filteredConversations = conversations.filter(conv => !conv.isNew);

    return (
        <>
            {/* History Tab Header */}
            <div className="mb-2">
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group"
                >
                    <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="flex-1 text-left font-medium text-sm">History</span>

                    {/* Refresh Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRefreshConversations?.();
                        }}
                        className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title={t('button.refresh')}
                    >
                        <RefreshCw size={14} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                    ) : (
                        <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
                    )}
                </div>
            </div>

            {/* Conversation List */}
            {isExpanded && (
                <>
                    {filteredConversations.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{t('sidebar.noConversations')}</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    isActive={currentConversation?.id === conversation.id}
                                    isSending={sendingConversationId === conversation.id && currentConversation?.id !== conversation.id}
                                    isRenaming={renamingId === conversation.id}
                                    renameValue={renameValue}
                                    isOptionsOpen={openOptionsId === conversation.id}
                                    onSelect={() => onSelectConversation(conversation.id)}
                                    onStartRename={() => handleStartRename(conversation)}
                                    onSaveRename={() => handleSaveRename(conversation.id)}
                                    onCancelRename={handleCancelRename}
                                    onRenameValueChange={setRenameValue}
                                    onToggleOptions={() => setOpenOptionsId(openOptionsId === conversation.id ? null : conversation.id)}
                                    onDelete={() => handleDeleteConversation(conversation.id)}
                                    optionsRef={optionsRef}
                                />
                            ))}
                        </div>
                    )}

                    {/* See More Button */}
                    {hasMoreConversations && (
                        <div className="mt-2 px-2">
                            <button
                                onClick={onLoadMoreConversations}
                                disabled={isLoadingMore}
                                className="w-full py-2 px-3 text-sm text-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingMore ? t('chat.loading') : t('button.seeMore')}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
