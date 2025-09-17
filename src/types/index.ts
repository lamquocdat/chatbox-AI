export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  model: string;
  theme: Theme;
  language: string;
  temperature: number;
  maxTokens: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  selectedModel: string;
  startupWithWindows: boolean;
  autoSave: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export type Theme = 'light' | 'dark' | 'system';
