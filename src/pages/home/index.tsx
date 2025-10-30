import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import Sidebar from '../../components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsModal from '../../components/SettingsModal';
import ChatInterface from './components/ChatInterface';
import { ChatboxProvider } from '../../contexts/chatbox';
import { useConversations } from '../../contexts/conversations';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../contexts/theme';
import { useAuth } from '../../hooks/useAuth';
import { getBlobFromFile, downloadBlob, isImageFile } from '../../utils/fileUtils';
import toast from 'react-hot-toast';
import type { FileAttachment } from '../../types';

function HomePage() {
    const { t } = useTranslation();
    const {
        conversations,
        currentConversation,
        conversationPagination,
        isLoading,
        createConversation,
        selectConversation,
        deleteConversation,
        updateConversationTitle,
        loadMoreConversations,
        refreshConversations,
    } = useConversations();

    const { settings, updateSettings } = useSettings();
    const { theme, toggleTheme } = useTheme();
    const { auth } = useAuth();

    const [showSettings, setShowSettings] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleNewConversation = () => {
        const userId = auth?.user?.id || 'default';
        const newConversation = createConversation(userId);
        selectConversation(newConversation.id);
    };

    const handleRenameConversation = async (id: string, newTitle: string) => {
        try {
            await updateConversationTitle(id, newTitle);
        } catch (error) {
            console.error('Failed to rename conversation:', error);
            toast.error(t('toast.failedToRename'), {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    // File click handler for downloads and image preview
    const handleFileClick = async (file: FileAttachment) => {
        // Xem ảnh
        if (isImageFile(file)) {
            // Will be handled by ChatInterface via context
            return;
        }

        // Tải file
        try {
            const blob = await getBlobFromFile(file);
            downloadBlob(blob, file.name);
        } catch (error) {
            console.error('Download error:', error);
            toast.error(t('toast.cannotDownloadFile'), {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const sidebarContent = (
        <Sidebar
            conversations={conversations}
            currentConversation={currentConversation}
            onNewConversation={handleNewConversation}
            onSelectConversation={selectConversation}
            onDeleteConversation={deleteConversation}
            onRenameConversation={handleRenameConversation}
            onToggleTheme={toggleTheme}
            onOpenSettings={() => setShowSettings(true)}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onLoadMoreConversations={loadMoreConversations}
            onRefreshConversations={refreshConversations}
            hasMoreConversations={conversationPagination ? conversationPagination.page < conversationPagination.total_pages : false}
            isLoadingMore={isLoading}
            theme={theme}
        />
    );

    return (
        <>
            <MainLayout
                sidebarContent={sidebarContent}
                sidebarOpen={sidebarOpen}
                onSidebarChange={setSidebarOpen}
            >
                {currentConversation ? (
                    <ChatboxProvider onFileClick={handleFileClick}>
                        <ChatInterface
                            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                            sidebarCollapsed={!sidebarOpen}
                            settings={settings}
                        />
                    </ChatboxProvider>
                ) : (
                    <WelcomeScreen
                        onNewConversation={handleNewConversation}
                        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        sidebarCollapsed={!sidebarOpen}
                    />
                )}
            </MainLayout>

            {showSettings && (
                <SettingsModal
                    settings={settings}
                    onUpdateSettings={updateSettings}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </>
    );
}

export default HomePage;
