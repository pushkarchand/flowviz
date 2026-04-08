import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppTheme } from '@styles/theme';
import { lightTheme, darkTheme } from '@styles/theme';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  currentTheme: AppTheme;
}

const STORAGE_KEY = 'fv-theme-preference';

// Check localStorage first, then system preference, default to dark
const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === 'dark';
  }
  
  if (window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  return true; // Default to dark
};

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggleTheme: () => {},
  currentTheme: darkTheme,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(getInitialTheme);
  
  const toggleTheme = useCallback(() => {
    setIsDark((d) => {
      const newValue = !d;
      localStorage.setItem(STORAGE_KEY, newValue ? 'dark' : 'light');
      return newValue;
    });
  }, []);
  
  const currentTheme = isDark ? darkTheme : lightTheme;

  // Listen for system preference changes (only if no stored preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
