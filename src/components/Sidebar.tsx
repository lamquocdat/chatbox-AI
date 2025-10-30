
import { Plus, Settings, Sun, Moon, Menu, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HistorySection from './sidebar/HistorySection';
import type { Conversation, Theme } from '../types';

interface SidebarProps {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    sendingConversationId?: string | null;
    onNewConversation: () => void;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onRenameConversation: (id: string, newTitle: string) => void;
    onToggleTheme: () => void;
    onOpenSettings: () => void;
    onToggleSidebar: () => void;
    onLoadMoreConversations?: () => void;
    onRefreshConversations?: () => void;
    hasMoreConversations?: boolean;
    isLoadingMore?: boolean;
    theme: Theme;
}

export default function Sidebar({
    conversations,
    currentConversation,
    sendingConversationId,
    onNewConversation,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    onToggleTheme,
    onOpenSettings,
    onToggleSidebar,
    onLoadMoreConversations,
    onRefreshConversations,
    hasMoreConversations = false,
    isLoadingMore = false,
    theme,
}: SidebarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { clearAuth } = useAuth();

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {t('common.hpt')}
                        </span>{' '}
                        {t('common.assistant')}
                    </h1>
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                        title={t('sidebar.toggleSidebar')}
                    >
                        <Menu size={18} />
                    </button>
                </div>

                <button
                    onClick={onNewConversation}
                    className="w-full flex items-center gap-2 px-3 py-2 text-white rounded-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--primary)' }}
                >
                    <Plus size={16} />
                    {t('sidebar.newConversation')}
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
                <HistorySection
                    conversations={conversations}
                    currentConversation={currentConversation}
                    sendingConversationId={sendingConversationId}
                    onSelectConversation={onSelectConversation}
                    onRenameConversation={onRenameConversation}
                    onDeleteConversation={onDeleteConversation}
                    onRefreshConversations={onRefreshConversations}
                    onLoadMoreConversations={onLoadMoreConversations}
                    hasMoreConversations={hasMoreConversations}
                    isLoadingMore={isLoadingMore}
                />
            </div>

            {/* Footer */}
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title={t('common.logout')}
                    >
                        <LogOut size={16} />
                    </button>

                    <div className="flex-1"></div>

                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                        title={theme === 'dark' ? t('common.light') : t('common.dark')}
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <button
                        onClick={onOpenSettings}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                        title={t('common.settings')}
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
