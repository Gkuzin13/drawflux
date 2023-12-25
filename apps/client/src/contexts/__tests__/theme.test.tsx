import { act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../theme';
import { storage } from '@/utils/storage';
import { darkTheme } from 'shared';
import { LOCAL_STORAGE_THEME_KEY } from '@/constants/app';

describe('theme context', () => {
  it('toggles theme correctly', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await act(async () => {
      result.current.set('dark');
    });

    expect(result.current.value).toBe('dark');
    expect(storage.get(LOCAL_STORAGE_THEME_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains(darkTheme)).toBe(true);

    await act(async () => {
      result.current.set('default');
    });

    expect(result.current.value).toBe('default');
    expect(storage.get(LOCAL_STORAGE_THEME_KEY)).toBe('default');
    expect(document.documentElement.classList.contains(darkTheme)).toBe(false);
  });
});
