import { createContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  darkMode: ThemeMode;
  switchDark: () => void;
  switchLight: () => void;
  switchSystem: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: 'light', // default value
  switchDark: () => {},
  switchLight: () => {},
  switchSystem: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (darkMode === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (darkMode === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (darkMode === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      if (systemPrefersDark.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      systemPrefersDark.addEventListener('change', handleSystemThemeChange);
      return () => {
        systemPrefersDark.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [darkMode]);

  const switchDark = () => setDarkMode('dark');
  const switchLight = () => setDarkMode('light');
  const switchSystem = () => setDarkMode('system');

  return (
    <ThemeContext.Provider value={{ darkMode, switchDark, switchLight, switchSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
