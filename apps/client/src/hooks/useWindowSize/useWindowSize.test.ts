import { renderHook, waitFor } from '@testing-library/react';
import useWindowSize from './useWindowSize';

describe('useWindowSize', () => {
  it('should return updated window size', async () => {
    const { result } = renderHook(() => useWindowSize());

    await waitFor(() => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual([800, 600]);
  });
});
