export const APP_CONFIG = {
    maxMessageLength: 4000,
    maxConversations: 100,
    maxMessagesPerConversation: 1000,
    autoCleanupDays: 180,
    animationDuration: 300,
    defaultBotResponse: 'Hiện tại tôi chưa sẵn sàng',
};

export const STORAGE_KEYS = {
    conversations: 'chatbox_conversations',
    settings: 'chatbox_settings',
    theme: 'chatbox_theme',
} as const;
