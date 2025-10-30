import { useState, useEffect } from 'react';
import { Settings } from '../types';

const SETTINGS_STORAGE_KEY = 'chatbox_settings';

const defaultSettings: Settings = {
    theme: 'system',
    language: 'en',
    temperature: 0.7,
    maxTokens: 1000,
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        // Load settings from localStorage
        try {
            const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setSettings({ ...defaultSettings, ...parsed });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }, []);

    useEffect(() => {
        // Save settings to localStorage
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return {
        settings,
        updateSettings,
        resetSettings,
    };
}
