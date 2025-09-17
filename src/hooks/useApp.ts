import { useState, useEffect } from 'react';
import { Conversation, AppSettings } from '@/types';
import { AI_MODELS, STORAGE_KEYS } from '@/utils/constants';
import { 
  saveToStorage, 
  loadFromStorage, 
  createNewConversation, 
  createMessage,
  generateTitle,
  applyTheme
} from '@/utils/helpers';

const defaultSettings: AppSettings = {
  theme: 'system',
  selectedModel: 'gpt-3.5',
  startupWithWindows: false,
  autoSave: true,
  fontSize: 'medium',
};

export const useApp = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    const savedConversations = loadFromStorage<Conversation[]>(STORAGE_KEYS.conversations, []);
    const savedSettings = loadFromStorage<AppSettings>(STORAGE_KEYS.settings, defaultSettings);
    
    // Convert date strings back to Date objects
    const processedConversations = savedConversations.map(conv => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
    
    setConversations(processedConversations);
    setSettings(savedSettings);
    
    // Apply theme
    applyTheme(savedSettings.theme);
    
    // Select first conversation if exists
    if (processedConversations.length > 0) {
      setCurrentConversationId(processedConversations[0].id);
    }
  }, []);

  // Auto-save conversations
  useEffect(() => {
    if (settings.autoSave && conversations.length > 0) {
      saveToStorage(STORAGE_KEYS.conversations, conversations);
    }
  }, [conversations, settings.autoSave]);

  // Auto-save settings
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  // Get current conversation
  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  // Create new conversation
  const createConversation = () => {
    const newConversation = createNewConversation();
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation;
  };

  // Delete conversation
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (currentConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Select conversation
  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!currentConversationId) {
      createConversation();
      return;
    }

    const userMessage = createMessage('user', content);
    
    // Update conversation with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, userMessage],
          updatedAt: new Date(),
        };
        
        // Update title if it's the first message
        if (conv.messages.length === 0) {
          updatedConv.title = generateTitle(content);
        }
        
        return updatedConv;
      }
      return conv;
    }));

    // Simulate AI response
    setIsLoading(true);
    
    setTimeout(() => {
      const aiMessage = createMessage('assistant', 'Hiện tại tôi chưa sẵn sàng');
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage],
            updatedAt: new Date(),
          };
        }
        return conv;
      }));
      
      setIsLoading(false);
    }, 1000);
  };

  // Update settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Apply theme immediately if it changed
      if (newSettings.theme && newSettings.theme !== prev.theme) {
        applyTheme(newSettings.theme);
      }
      
      return updated;
    });
  };

  // Export conversations
  const exportConversations = async () => {
    try {
      const result = await window.electronAPI?.showSaveDialog();
      if (result && !result.canceled && result.filePath) {
        const data = JSON.stringify({
          conversations,
          exportDate: new Date().toISOString(),
          version: '1.0'
        }, null, 2);
        
        await window.electronAPI?.writeFile(result.filePath, data);
        return { success: true };
      }
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: 'Export failed' };
    }
  };

  // Import conversations
  const importConversations = async () => {
    try {
      const result = await window.electronAPI?.showOpenDialog();
      if (result && !result.canceled && result.filePaths?.length > 0) {
        const fileResult = await window.electronAPI?.readFile(result.filePaths[0]);
        
        if (fileResult?.success && fileResult.data) {
          const importedData = JSON.parse(fileResult.data);
          
          if (importedData.conversations && Array.isArray(importedData.conversations)) {
            const processedConversations = importedData.conversations.map((conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            }));
            
            setConversations(processedConversations);
            if (processedConversations.length > 0) {
              setCurrentConversationId(processedConversations[0].id);
            }
            
            return { success: true };
          }
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, error: 'Import failed' };
    }
  };

  return {
    // State
    conversations,
    currentConversation,
    settings,
    isLoading,
    
    // Actions
    createConversation,
    deleteConversation,
    selectConversation,
    sendMessage,
    updateSettings,
    exportConversations,
    importConversations,
    
    // Computed
    availableModels: AI_MODELS,
  };
};
