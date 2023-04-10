import { act, renderHook } from '@testing-library/react';
import useDisclosure from './useDisclosure';

describe('useDisclosure', () => {
  it('handles open correctly', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current[1].open());
    expect(result.current[0]).toBe(true);
  });

  it('handles close correctly', () => {
    const { result } = renderHook(() => useDisclosure(true));

    act(() => result.current[1].close());
    expect(result.current[0]).toBe(false);
  });

  it('handles toggle correctly', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(false);
  });
});
