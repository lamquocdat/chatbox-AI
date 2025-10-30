export interface User {
    id: string;
    email: string;
    is_verified: boolean;
    is_active: boolean;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface AuthPayload {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface VerifyRequest {
    email: string;
    code: string;
}

export interface ResendCodeRequest {
    email: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string | null;
    pagination?: Pagination;
}

export interface Pagination {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

export interface AIHubGenerateResponse {
    data: {
        code: number;
        status: string;
        data: string;
        conversation_id?: string; // Returned when conversation is saved
        error: any;
        detail: any;
    };
}

export interface ConversationResponse {
    _id: string;
    user_id: string;
    conversation_type: 'chatbot' | 'document' | 'test';
    title: string;
    document_id?: string | null;
    message_count: number;
    created_at: string;
    updated_at: string;
}

export interface MessageResponse {
    _id: string;
    conversation_id: string;
    sequence: number;
    role: 'user' | 'assistant';
    content: string;
    model?: string | null;
    token_in?: number | null;
    token_out?: number | null;
    created_at: string;
}
