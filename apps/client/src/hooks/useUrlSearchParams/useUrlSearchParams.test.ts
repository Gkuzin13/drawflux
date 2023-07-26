import { renderHook } from '@testing-library/react';
import useUrlSearchParams from './useUrlSearchParams';

describe('useUrlSearchParams', () => {
  it('returns correct params object', async () => {
    vi.stubGlobal('location', { search: '?param1=value1&param2=value2' });

    const { result } = renderHook(() => useUrlSearchParams());

    expect(result.current).toEqual({ param1: 'value1', param2: 'value2' });
  });

  it('returns empty object if search string is empty', async () => {
    vi.stubGlobal('location', { search: '' });

    const { result } = renderHook(() => useUrlSearchParams());

    expect(result.current).toEqual({});
  });
});
