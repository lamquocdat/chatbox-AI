import { X, Settings as SettingsIcon, Globe, Power } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Settings } from '../types';

interface SettingsModalProps {
    settings: Settings;
    onUpdateSettings: (settings: Partial<Settings>) => void;
    onClose: () => void;
}

export default function SettingsModal({
    settings,
    onUpdateSettings,
    onClose,
}: SettingsModalProps) {
    const { t, i18n } = useTranslation();
    const [startupEnabled, setStartupEnabled] = useState(false);

    // Kiểm tra trạng thái startup khi component mount
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getStartup().then(setStartupEnabled);
        }
    }, []);

    // Xử lý thay đổi startup setting
    const handleStartupToggle = async (enabled: boolean) => {
        if (window.electronAPI) {
            await window.electronAPI.setStartup(enabled);
            setStartupEnabled(enabled);
        }
    };

    // Xử lý thay đổi ngôn ngữ
    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
        onUpdateSettings({ language });
    };

    const languages = [
        { id: 'en', name: t('settings.language.english'), flag: '🇺🇸' },
        { id: 'vi', name: t('settings.language.vietnamese'), flag: '🇻🇳' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t('settings.title')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-8">
                        {/* Startup Setting */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Power className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {t('settings.systemStartup.title')}
                                </h3>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t('settings.systemStartup.startWithSystem')}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('settings.systemStartup.description')}
                                    </p>
                                </div>
                                {/* Custom Switch */}
                                <button
                                    onClick={() => handleStartupToggle(!startupEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${startupEnabled
                                        ? 'bg-blue-600 dark:bg-blue-500'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${startupEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Language Selection */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {t('settings.language.title')}
                                </h3>
                            </div>
                            <select
                                value={settings.language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.id} value={lang.id}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
