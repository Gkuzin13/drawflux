import { renderHook } from '@testing-library/react';
import { Line } from 'konva/lib/shapes/Line';
import useAnimatedDash from './useAnimatedDash';

describe('useAnimatedDash', () => {
  const nodeRef = {
    current: new Line(),
  };

  const initialProps = {
    enabled: false,
    nodeRef,
    totalDashLength: 8,
  };

  it('toggles animation when enabled changes', async () => {
    const { result, rerender } = renderHook((args) => useAnimatedDash(args), {
      initialProps,
    });

    expect(result.current.animation).toBe(null);

    rerender({ enabled: true, nodeRef, totalDashLength: 8 });
    expect(result.current.animation?.isRunning()).toBe(true);

    rerender({ enabled: false, nodeRef, totalDashLength: 8 });
    expect(result.current.animation?.isRunning()).toBe(false);
  });

  it("does't create a new animation instance when totalDashLength changes", async () => {
    const { result, rerender } = renderHook((args) => useAnimatedDash(args), {
      initialProps,
    });

    rerender({ enabled: true, nodeRef, totalDashLength: 8 });
    const initialAnimationId = result.current.animation?.id;

    rerender({ enabled: true, nodeRef, totalDashLength: 12 });
    expect(result.current.animation?.id).toBe(initialAnimationId);

    rerender({ enabled: true, nodeRef, totalDashLength: 18 });
    expect(result.current.animation?.id).toBe(initialAnimationId);
  });
});
