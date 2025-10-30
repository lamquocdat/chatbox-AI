import { Copy, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MessageActionsProps {
    onCopy: () => void;
    onRegenerate?: () => void;
    showRegenerate?: boolean;
}

export default function MessageActions({ onCopy, onRegenerate, showRegenerate = true }: MessageActionsProps) {
    const { t } = useTranslation();

    return (
        <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy Button */}
            <button
                onClick={onCopy}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                title={t('button.copy')}
            >
                <Copy size={12} />
            </button>

            {/* Regenerate Button */}
            {showRegenerate && onRegenerate && (
                <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    title={t('button.retry')}
                >
                    <RotateCw size={12} />
                </button>
            )}
        </div>
    );
}
