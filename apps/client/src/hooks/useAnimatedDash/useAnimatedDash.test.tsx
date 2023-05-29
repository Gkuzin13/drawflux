import { renderHook } from '@testing-library/react';
import { Line } from 'konva/lib/shapes/Line';
import useAnimatedDash from './useAnimatedDash';

describe('useAnimatedDash', () => {
  it('should run animation', async () => {
    const elementRef = {
      current: new Line(),
    };

    const { result, rerender } = renderHook((args) => useAnimatedDash(args), {
      initialProps: { enabled: false, elementRef, totalDashLength: 8 },
    });

    expect(result.current.animation).toBe(null);

    rerender({ enabled: true, elementRef, totalDashLength: 8 });
    expect(result.current.animation?.isRunning()).toBe(true);

    rerender({ enabled: false, elementRef, totalDashLength: 8 });
    expect(result.current.animation).toBe(null);
  });
});
