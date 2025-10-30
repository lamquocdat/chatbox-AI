import { MoreVertical, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Conversation } from '../../types';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    isSending: boolean;
    isRenaming: boolean;
    renameValue: string;
    isOptionsOpen: boolean;
    onSelect: () => void;
    onStartRename: () => void;
    onSaveRename: () => void;
    onCancelRename: () => void;
    onRenameValueChange: (value: string) => void;
    onToggleOptions: () => void;
    onDelete: () => void;
    optionsRef?: React.RefObject<HTMLDivElement>;
}

export default function ConversationItem({
    conversation,
    isActive,
    isSending,
    isRenaming,
    renameValue,
    isOptionsOpen,
    onSelect,
    onStartRename,
    onSaveRename,
    onCancelRename,
    onRenameValueChange,
    onToggleOptions,
    onDelete,
    optionsRef,
}: ConversationItemProps) {
    const { t } = useTranslation();

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div
            className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            onClick={onSelect}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    {/* Title - Editable when renaming */}
                    {isRenaming ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => onRenameValueChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onSaveRename();
                                    if (e.key === 'Escape') onCancelRename();
                                }}
                                className="w-3/4 flex-1 px-2 py-1 text-sm font-medium bg-white dark:bg-gray-800 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button
                                onClick={onSaveRename}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded"
                                title={t('button.save')}
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={onCancelRename}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
                                title={t('button.cancel')}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <h3 className="font-medium truncate text-sm">
                            {conversation.title}
                        </h3>
                    )}

                    <p className="text-xs opacity-60 mt-1">
                        {formatDate(conversation.updatedAt)}
                    </p>
                    {conversation.message_count > 0 && (
                        <p className="text-xs opacity-50 mt-1">
                            {conversation.message_count} messages
                        </p>
                    )}
                </div>

                {/* Options Button or Loading Indicator */}
                {!isRenaming && (
                    <div className="relative" ref={isOptionsOpen ? optionsRef : undefined}>
                        {/* Show loading icon if this conversation is sending */}
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleOptions();
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-opacity"
                            >
                                <MoreVertical size={14} />
                            </button>
                        )}

                        {/* Options Popup */}
                        {isOptionsOpen && (
                            <div
                                className="absolute right-0 top-8 z-50 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={onStartRename}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <Edit2 size={14} />
                                    {t('button.rename')}
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    {t('button.delete')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
