import { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    icon: 'Zap',
    color: '#10a37f'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks',
    icon: 'Brain',
    color: '#8b5cf6'
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s constitutional AI',
    icon: 'Shield',
    color: '#ff6b35'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s multimodal AI',
    icon: 'Sparkles',
    color: '#4285f4'
  }
];

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
