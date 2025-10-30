import { Loader2, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadMoreMessagesProps {
    isLoading: boolean;
    hasError: boolean;
    onLoadMore?: () => void;
}

export default function LoadMoreMessages({ isLoading, hasError, onLoadMore }: LoadMoreMessagesProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="text-center py-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
            </div>
        );
    }

    if (hasError && onLoadMore) {
        return (
            <div className="text-center py-2">
                <button
                    onClick={onLoadMore}
                    className="flex items-center gap-2 px-4 py-2 mx-auto text-sm rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <RotateCw size={14} />
                    {t('button.retryLoadingMessages')}
                </button>
            </div>
        );
    }

    return null;
}
