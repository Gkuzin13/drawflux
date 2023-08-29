import { LOCAL_STORAGE_THEME_KEY } from '@/constants/app';
import { storage } from '@/utils/storage';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { darkTheme } from 'shared';

type ThemeValue = 'default' | 'dark';

type ThemeContextValue = {
  value: ThemeValue;
  changeTheme: (theme: ThemeValue) => void;
};

function prefersDarkColorScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function getDefaultValue() {
  const storedThemeValue = storage.get<ThemeValue>(LOCAL_STORAGE_THEME_KEY);

  if (!storedThemeValue) {
    return prefersDarkColorScheme().matches ? 'dark' : 'default';
  }

  return storedThemeValue;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeValue>(getDefaultValue());

  useEffect(() => {
    if (storage.get<ThemeValue>(LOCAL_STORAGE_THEME_KEY)) {
      return;
    }

    const darkColorScheme = prefersDarkColorScheme();

    const handleColorSchemeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setTheme('dark');
      } else {
        setTheme('default');
      }
    };

    darkColorScheme.addEventListener('change', handleColorSchemeChange);

    return () => {
      darkColorScheme.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add(darkTheme);
    } else {
      document.documentElement.classList.remove(darkTheme);
    }
  }, [theme]);

  const handleThemeChange = (value: ThemeValue) => {
    setTheme(value);
    storage.set<ThemeValue>(LOCAL_STORAGE_THEME_KEY, value);
  };

  return (
    <ThemeContext.Provider
      value={{ value: theme, changeTheme: handleThemeChange }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);

  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return ctx;
};
