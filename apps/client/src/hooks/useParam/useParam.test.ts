import { fireEvent, renderHook, waitFor } from '@testing-library/react';
import useParam from './useParam';

describe('useParam', () => {
  it('returns correct param value', () => {
    vi.stubGlobal('location', { search: '?page=1' });

    const { result } = renderHook(() => useParam('page'));

    expect(result.current).toEqual('1');
  });

  it('returns updated param value when url changes', async () => {
    vi.stubGlobal('location', { search: '?page=1' });

    const { result } = renderHook(() => useParam('page'));

    expect(result.current).toEqual('1');

    vi.stubGlobal('location', { search: '?page=2' });

    fireEvent.popState(window);

    await waitFor(() => expect(result.current).toEqual('2'));
  });

  it('returns null if search string is empty', () => {
    vi.stubGlobal('location', { search: '' });

    const { result } = renderHook(() => useParam('page'));

    expect(result.current).toEqual(null);
  });
});
