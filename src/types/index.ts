export interface Message {
    _id?: string; // MongoDB ID from API
    id: string; // Local ID for UI
    conversation_id?: string; // Conversation this message belongs to
    sequence?: number; // Message order in conversation
    role: 'user' | 'assistant';
    content: string;
    model?: string; // AI model used (for assistant messages)
    token_in?: number; // Input tokens (for user messages)
    token_out?: number; // Output tokens (for assistant messages)
    timestamp: Date; // created_at from API
    isLoading?: boolean; // Local UI state
    isError?: boolean; // Local UI state
    attachments?: FileAttachment[];
}

export interface FileAttachment {
    id: string;
    name: string;
    type: string; // MIME type
    size: number;
    url: string; // Data URL or object URL
    file?: File; // Original file object
}

export interface Conversation {
    _id?: string; // MongoDB ID from API
    id: string; // Local ID for UI (same as _id when from API)
    user_id: string; // User who owns this conversation
    conversation_type: 'chatbot' | 'document' | 'test';
    title: string;
    document_id?: string | null; // For document type conversations
    message_count: number; // Number of messages in conversation
    messages: Message[]; // Loaded messages (not all, paginated)
    messagePagination?: {
        page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
    };
    createdAt: Date; // created_at from API
    updatedAt: Date; // updated_at from API
    isNew?: boolean; // Local flag for unsaved conversations
}

export interface Settings {
    theme: Theme;
    language: string;
    temperature: number;
    maxTokens: number;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    startupWithWindows: boolean;
    autoSave: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

export type Theme = 'light' | 'dark' | 'system';
