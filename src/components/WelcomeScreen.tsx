import { MessageSquare, Zap, Shield, Globe, Menu, Minimize2 } from 'lucide-react';

interface WelcomeScreenProps {
  onNewConversation: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function WelcomeScreen({
  onNewConversation,
  onToggleSidebar,
  sidebarCollapsed,
}: WelcomeScreenProps) {
  const handleMinimizeToBubble = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeToBubble();
    }
  };

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Smart Conversations',
      description: 'Engage in natural, intelligent conversations with advanced AI models.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast & Responsive',
      description: 'Experience lightning-fast responses and smooth interactions.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Privacy Focused',
      description: 'Your conversations are stored locally and kept private.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-language',
      description: 'Communicate in multiple languages with natural fluency.',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {sidebarCollapsed && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 mr-3"
            >
              <Menu size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome to AI Chatbox
          </h1>
        </div>
        
        {/* Minimize to Bubble Button */}
        <button
          onClick={handleMinimizeToBubble}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          title="Minimize to bubble"
        >
          <Minimize2 size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Chatbox
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your intelligent desktop companion for conversations, creativity, and productivity
            </p>
            <button
              onClick={onNewConversation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <MessageSquare size={20} />
              Start New Conversation
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
