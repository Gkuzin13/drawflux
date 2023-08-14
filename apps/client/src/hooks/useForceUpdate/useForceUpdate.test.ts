import { renderHook } from '@testing-library/react';
import useForceUpdate from './useForceUpdate';

describe('useForceUpdate', () => {
  it('should trigger re-render when dependencies change', () => {
    const { result, rerender } = renderHook((deps) => useForceUpdate(deps), {
      initialProps: [1, 2, 3],
    });

    expect(result.current.rerenderCount).toBe(1);

    rerender([2, 1, 3]);
    expect(result.current.rerenderCount).toBe(2);

    rerender([2, 1, 3]); // Dependencies didn't change, re-render shouldn't occur
    expect(result.current.rerenderCount).toBe(2);

    rerender([3, 2, 1]);
    expect(result.current.rerenderCount).toBe(3);
  });
});
