import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import FilePreview from '../../../../components/FilePreview';
import MessageActions from './MessageActions';
import type { Message, FileAttachment } from '../../../../types';

interface MessageItemProps {
    message: Message;
    onFileClick: (file: FileAttachment) => void;
    onRetryMessage: (messageId: string) => void;
    onRegenerateMessage?: (messageId: string) => void;
}

export default function MessageItem({ message, onFileClick, onRetryMessage, onRegenerateMessage }: MessageItemProps) {
    const { t } = useTranslation();

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            toast.success(t('toast.copiedToClipboard'), {
                duration: 2000,
                position: 'top-center',
            });
        }).catch(() => {
            toast.error(t('toast.failedToCopy'), {
                duration: 2000,
                position: 'top-center',
            });
        });
    };

    return (
        <div
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
        >
            <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === 'user'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'bg-transparent text-gray-900 dark:text-gray-100'
                    }`}
            >
                {message.isLoading ? (
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                        ></div>
                    </div>
                ) : (
                    <>
                        {/* File Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {message.attachments.map((file) => (
                                    <FilePreview
                                        key={file.id}
                                        file={file}
                                        onClick={() => onFileClick(file)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Message Content */}
                        {message.content && (
                            message.role === 'assistant' ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap break-words">
                                    {message.content}
                                </div>
                            )
                        )}

                        {/* Action Buttons - Copy & Retry (only for assistant) */}
                        {message.content && !message.isLoading && message.role === 'assistant' && (
                            <MessageActions
                                onCopy={() => handleCopyMessage(message.content)}
                                onRegenerate={onRegenerateMessage ? () => onRegenerateMessage(message.id) : undefined}
                                showRegenerate={!message.isError}
                            />
                        )}

                        {/* Error Retry Button */}
                        {message.isError && message.role === 'assistant' && (
                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    onClick={() => onRetryMessage(message.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <RotateCw size={14} />
                                    {t('button.retry')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
