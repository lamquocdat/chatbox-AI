import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import WelcomeScreen from '../components/WelcomeScreen';
import SettingsModal from '../components/SettingsModal';
import { useConversations } from '../hooks/useConversations';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

function HomePage() {
  const {
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    addMessage
  } = useConversations();

  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNewConversation = () => {
    const newConversation = createConversation();
    selectConversation(newConversation.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) {
      // Create new conversation if none exists
      const newConversation = createConversation();
      selectConversation(newConversation.id);
      
      // Add user message
      addMessage(newConversation.id, {
        role: 'user',
        content,
        timestamp: new Date(),
      });

      // Add AI response (placeholder for now)
      setTimeout(() => {
        addMessage(newConversation.id, {
          role: 'assistant',
          content: 'Xin chào! Tôi là AI Chatbox. Tôi có thể giúp gì cho bạn?',
          timestamp: new Date(),
        });
      }, 1000);
    } else {
      // Add user message to existing conversation
      addMessage(currentConversation.id, {
        role: 'user',
        content,
        timestamp: new Date(),
      });

      // Add AI response (placeholder for now)
      setTimeout(() => {
        addMessage(currentConversation.id, {
          role: 'assistant',
          content: 'Cảm ơn bạn đã nhắn tin! Đây là phản hồi mẫu từ AI Chatbox.',
          timestamp: new Date(),
        });
      }, 1000);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme} relative`}>
      {/* Sidebar - Responsive với Tailwind */}
      <div className={`
        ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarCollapsed ? 'lg:w-0' : 'lg:w-80'}
        overflow-hidden
      `}>
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewConversation={handleNewConversation}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setShowSettings(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
        />
      </div>

      {/* Overlay cho màn hình nhỏ - chỉ hiện khi sidebar mở trên mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ChatInterface
            conversation={currentConversation}
            onSendMessage={handleSendMessage}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
            settings={settings}
          />
        ) : (
          <WelcomeScreen
            onNewConversation={handleNewConversation}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
          />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default HomePage;
