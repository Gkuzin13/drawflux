import { renderHook, act } from '@testing-library/react';
import useClipboard from './useClipboard';
import userEvent from '@testing-library/user-event';

describe('useClipboard', () => {
  beforeAll(() => {
    userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });

  it('copies text to the clipboard', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copy('test');
    });

    const textContent = await window.navigator.clipboard.readText();

    expect(textContent).toBe('test');
  });

  it('sets copied state to true when text is copied', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('resets copied state after the timeout', async () => {
    vi.useFakeTimers();

    const resetTimeout = 1000;
    const { result } = renderHook(() => useClipboard(resetTimeout));

    await act(async () => {
      result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(resetTimeout);
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();

    vi.useRealTimers();
  });

  it('resets copied state when reset is called', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
