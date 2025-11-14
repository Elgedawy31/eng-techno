'use client'
import { useTheme as useNextTheme, ThemeProvider as NextThemeProvider } from 'next-themes'

type Theme = 'dark' | 'light' | 'system'

export const ThemeProvider = NextThemeProvider;
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  return {
    theme: theme as Theme,
    setTheme: setTheme,
    resolvedTheme,
  };
};
