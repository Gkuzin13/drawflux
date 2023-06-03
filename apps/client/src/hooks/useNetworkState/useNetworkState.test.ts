import { renderHook } from '@testing-library/react';
import useNetworkState from './useNetworkState';

describe('useNetworkState', () => {
  it('should have correct state structure', () => {
    const hook = renderHook(() => useNetworkState());

    expect(typeof hook.result.current).toBe('object');
    expect(Object.keys(hook.result.current)).toEqual(['online']);
  });
});
