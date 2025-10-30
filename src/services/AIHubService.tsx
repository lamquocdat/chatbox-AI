import interceptor from '../apis/Interceptor';
import {
    LoginRequest,
    RegisterRequest,
    VerifyRequest,
    ResendCodeRequest,
    ApiResponse,
    AuthPayload,
    User,
    AIHubGenerateResponse,
    ConversationResponse,
    MessageResponse
} from '../contexts/authen/types';

class AIHubService {
    // 1. Register New User
    static async register(data: RegisterRequest): Promise<ApiResponse<{ message: string }>> {
        const response = await interceptor.post('/auth/register', data);
        return response.data;
    }

    // 2. Verify Email
    static async verify(data: VerifyRequest): Promise<ApiResponse<{ message: string }>> {
        const response = await interceptor.post('/auth/verify', data);
        return response.data;
    }

    // 3. Resend Verification Code
    static async resendCode(data: ResendCodeRequest): Promise<ApiResponse<{ message: string }>> {
        const response = await interceptor.post('/auth/resend-code', data);
        return response.data;
    }

    // 4. Login
    static async login(data: LoginRequest): Promise<ApiResponse<AuthPayload>> {
        const response = await interceptor.post('/auth/login', data);
        return response.data;
    }

    // 5. Get Current User
    static async getCurrentUser(): Promise<ApiResponse<User>> {
        const response = await interceptor.get('/auth/me');
        return response.data;
    }

    // 6. Generate Content (AI Chat) with Conversation Support
    static async generate(
        params: {
            model: string;
            contents: string;
            thinking?: boolean;
            response_mime_type?: string;
            conversation_type?: 'chatbot' | 'document' | 'test';
            conversation_id?: string;
            conversation_title?: string;
            document_id?: string;
        },
        signal?: AbortSignal
    ): Promise<AIHubGenerateResponse> {
        const response = await interceptor.post<AIHubGenerateResponse['data']>(
            '/generate',
            params,
            { signal }
        );
        return { data: response.data };
    }

    // 7. Get Conversations List
    static async getConversations(params?: {
        conversation_type?: 'chatbot' | 'document' | 'test';
        document_id?: string;
        page: number;
        page_size: number;
    }): Promise<ApiResponse<ConversationResponse[]>> {
        const response = await interceptor.get('/conversations', { params });
        return response.data;
    }

    // 8. Get Conversation Messages
    static async getConversationMessages(
        conversationId: string,
        page?: number,
        page_size?: number
    ): Promise<ApiResponse<MessageResponse[]>> {
        const response = await interceptor.get(`/conversations/${conversationId}/messages`, {
            params: { page, page_size }
        });
        return response.data;
    }

    // 9. Update Conversation Title
    static async updateConversationTitle(
        conversationId: string,
        title: string
    ): Promise<ApiResponse<any>> {
        const response = await interceptor.put(`/conversations/${conversationId}`, { title });
        return response.data;
    }

    // 10. Delete Conversation
    static async deleteConversation(conversationId: string): Promise<ApiResponse<any>> {
        const response = await interceptor.delete(`/conversations/${conversationId}`);
        return response.data;
    }
}

export default AIHubService;