import { useContext } from 'react';
import { ChatBoxContext } from '../contexts/chatbox/ChatboxContext';

/**
 * Hook để sử dụng ChatBox context
 * @throws Error nếu sử dụng ngoài ChatboxProvider
 */
export const useChatBox = () => {
    const context = useContext(ChatBoxContext);

    if (!context || Object.keys(context).length === 0) {
        throw new Error('useChatBox must be used within ChatboxProvider');
    }

    return context;
};
