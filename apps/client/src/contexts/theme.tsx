import { useCallback, useEffect, useState } from 'react';
import { LOCAL_STORAGE_THEME_KEY } from '@/constants/app';
import { storage } from '@/utils/storage';
import { createContext } from './createContext';
import { darkTheme } from 'shared';

export type ThemeValue = 'default' | 'dark';

type ThemeContextValue = {
  value: ThemeValue;
  set: (theme: ThemeValue) => void;
};

const preferableTheme = getPreferableTheme();

setThemeToDocument(preferableTheme);

export const [ThemeContext, useTheme] =
  createContext<ThemeContextValue>('Theme');

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeValue>(preferableTheme);

  const handleThemeChange = useCallback((value: ThemeValue, persist = true) => {
    setTheme(value);
    setThemeToDocument(value);

    if (persist) {
      storage.set(LOCAL_STORAGE_THEME_KEY, value);
    }
  }, []);

  useEffect(() => {
    if (storage.get<ThemeValue>(LOCAL_STORAGE_THEME_KEY)) {
      return;
    }

    const darkColorScheme = prefersDarkColorScheme();

    const handleColorSchemeChange = (event: MediaQueryListEvent) => {
      handleThemeChange(event.matches ? 'dark' : 'default', false);
    };

    darkColorScheme.addEventListener('change', handleColorSchemeChange);

    return () => {
      darkColorScheme.removeEventListener('change', handleColorSchemeChange);
    };
  }, [handleThemeChange]);

  return (
    <ThemeContext.Provider value={{ value: theme, set: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

function getPreferableTheme(): ThemeValue {
  const storedThemeValue = storage.get<ThemeValue>(LOCAL_STORAGE_THEME_KEY);

  if (storedThemeValue) {
    return storedThemeValue;
  }

  return prefersDarkColorScheme().matches ? 'dark' : 'default';
}

function prefersDarkColorScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function setThemeToDocument(value: ThemeValue) {
  if (value === 'dark') {
    document.documentElement.classList.add(darkTheme);
  } else {
    document.documentElement.classList.remove(darkTheme);
  }
}
