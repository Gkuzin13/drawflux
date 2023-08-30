import { act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../theme';
import { storage } from '@/utils/storage';
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

    await act(async () => {
      result.current.set('default');
    });

    expect(result.current.value).toBe('default');
  });

  it('sets dark theme from storage', async () => {
    storage.set(LOCAL_STORAGE_THEME_KEY, 'dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.value).toBe('dark');
  });
});
