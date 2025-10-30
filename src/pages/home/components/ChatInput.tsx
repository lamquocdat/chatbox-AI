import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, Paperclip, Square } from 'lucide-react';
import type { FileAttachment } from '../../../types';
import FilePreview from '../../../components/FilePreview';

interface ChatInputProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    attachedFiles: FileAttachment[];
    onFileSelect: (files: FileList | null) => void;
    onRemoveFile: (fileId: string) => void;
    onFileClick: (file: FileAttachment) => void;
    isLoading: boolean;
    isSending?: boolean;
    onCancelSend?: () => void;
}

export default function ChatInput({
    inputValue,
    onInputChange,
    onSubmit,
    onKeyDown,
    attachedFiles,
    onFileSelect,
    onRemoveFile,
    onFileClick,
    isLoading,
    isSending = false,
    onCancelSend,
}: ChatInputProps) {
    const { t } = useTranslation();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onInputChange(e.target.value);

        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleMicClick = () => {
        // TODO: Implement speech-to-text functionality
    };

    const handleSendOrCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSending && onCancelSend) {
            onCancelSend();
        } else {
            // Trigger submit by calling the onSubmit handler directly
            onSubmit(e as any);
        }
    };

    return (
        <div className="p-4" style={{ borderColor: 'transparent' }}>
            <div className="max-w-3xl mx-auto">
                {/* File Attachments Preview */}
                {attachedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {attachedFiles.map((file) => (
                            <FilePreview
                                key={file.id}
                                file={file}
                                onRemove={() => onRemoveFile(file.id)}
                                onClick={() => onFileClick(file)}
                            />
                        ))}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex gap-3">
                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => onFileSelect(e.target.files)}
                        className="hidden"
                    />

                    <div
                        className="flex flex-1 border rounded-lg px-2 gap-2 relative"
                        style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--input)',
                        }}
                    >
                        {/* Paperclip Button - Inside Input */}
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all z-10"
                                title={t('chat.attachFile')}
                                disabled={isLoading}
                            >
                                <Paperclip size={16} />
                            </button>
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={onKeyDown}
                            placeholder={t('input.message')}
                            className="w-full resize-none rounded-lg py-3 border-0 focus:outline-none focus:ring-0 dark:bg-gray-900 disabled:bg-transparent dark:text-white max-h-64 min-h-10 overflow-y-auto"
                            rows={1}
                            disabled={isLoading}
                        />

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleMicClick}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                title={t('chat.speechToText')}
                                disabled={isLoading || isSending}
                            >
                                <Mic size={16} />
                            </button>
                            <button
                                type={isSending ? 'button' : 'submit'}
                                onClick={isSending ? handleSendOrCancel : undefined}
                                disabled={!isSending && (!inputValue.trim() || isLoading)}
                                className="p-2 rounded-lg text-white transition-all hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                style={{ backgroundColor: isSending ? '#ef4444' : 'var(--primary)' }}
                                title={isSending ? t('button.cancel') : t('button.send')}
                            >
                                {isSending ? <Square size={16} fill="white" /> : <Send size={16} />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
