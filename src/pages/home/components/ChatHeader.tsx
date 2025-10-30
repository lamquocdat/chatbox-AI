import { Minimize2, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatHeaderProps {
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}

export default function ChatHeader({ sidebarCollapsed, onToggleSidebar }: ChatHeaderProps) {
    const { t } = useTranslation();

    const handleMinimizeToBubble = () => {
        if (window.electronAPI) {
            window.electronAPI.minimizeToBubble();
        }
    };

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                {sidebarCollapsed && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        title={t('chat.openSidebar')}
                    >
                        <Menu size={20} />
                    </button>
                )}
            </div>

            <button
                onClick={handleMinimizeToBubble}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                title={t('chat.minimizeToBubble')}
            >
                <Minimize2 size={20} />
            </button>
        </div>
    );
}
