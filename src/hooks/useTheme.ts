import { useCallback } from 'react';
import { useThemeContext } from '../context/ThemeContext';

interface UseThemeResult {
  /** Current theme mode ('light' or 'dark') */
  mode: 'light' | 'dark';
  
  /** Function to toggle between light and dark mode */
  toggleTheme: () => void;
  
  /** Function to set the theme mode explicitly */
  setThemeMode: (mode: 'light' | 'dark') => void;
  
  /** Whether the current theme is dark mode */
  isDarkMode: boolean;
  
  /** Whether the current theme is light mode */
  isLightMode: boolean;
  
  /** Get a color value based on the current theme */
  getThemeColor: (lightColor: string, darkColor: string) => string;
}

/**
 * Custom hook for managing theme with helpful utilities
 */
export function useTheme(): UseThemeResult {
  const { mode, setMode } = useThemeContext();
  
  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, [setMode]);
  
  // Set the theme mode explicitly
  const setThemeMode = useCallback((newMode: 'light' | 'dark') => {
    setMode(newMode);
  }, [setMode]);
  
  // Get a color value based on the current theme
  const getThemeColor = useCallback(
    (lightColor: string, darkColor: string): string => {
      return mode === 'light' ? lightColor : darkColor;
    },
    [mode]
  );
  
  return {
    mode,
    toggleTheme,
    setThemeMode,
    isDarkMode: mode === 'dark',
    isLightMode: mode === 'light',
    getThemeColor
  };
}
