import { renderHook } from '@testing-library/react';
import useClipboard from './useClipboard';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('useClipboard', () => {
  userEvent.setup();

  it('should copied true when calling copy', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should reset copied state after the timeout', async () => {
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

  it('should reset correctly', async () => {
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
