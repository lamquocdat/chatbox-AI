import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

const THEME_STORAGE_KEY = 'chatbox_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored as Theme);
    }

    // Apply system theme detection
    if (stored === 'system' || !stored) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme === 'system') {
          updateDocumentClass('system');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      handleChange(); // Apply initial state
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const updateDocumentClass = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    updateDocumentClass(newTheme);
  };

  // Apply theme on mount
  useEffect(() => {
    updateDocumentClass(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}
