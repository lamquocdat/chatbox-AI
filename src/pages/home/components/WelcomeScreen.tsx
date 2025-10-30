import { MessageSquare, Zap, Shield, Globe, Menu, Minimize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const handleMinimizeToBubble = () => {
        if (window.electronAPI) {
            window.electronAPI.minimizeToBubble();
        }
    };

    const features = [
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: t('welcome.features.smartAssistant.title'),
            description: t('welcome.features.smartAssistant.description'),
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: t('welcome.features.fastResponse.title'),
            description: t('welcome.features.fastResponse.description'),
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: t('welcome.features.secure.title'),
            description: t('welcome.features.secure.description'),
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: t('welcome.features.multiLanguage.title'),
            description: t('welcome.features.multiLanguage.description'),
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-gray-200 dark:border-gray-700">
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
                        Welcome to HPT PC Assistant
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
                        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800">
                            <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                            {t('welcome.title')}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            {t('welcome.subtitle')}
                        </p>
                        <button
                            onClick={onNewConversation}
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all hover:opacity-90"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            <MessageSquare size={20} />
                            {t('welcome.startConversation')}
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-xl border transition-all hover:shadow-lg"
                                style={{
                                    backgroundColor: 'var(--card-bg)',
                                    borderColor: 'var(--border)'
                                }}
                            >
                                <div className="mb-3" style={{ color: 'var(--primary)' }}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
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
