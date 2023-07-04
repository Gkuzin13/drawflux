import { throttleFn } from '@/utils/throttle';

// needs work
describe.skip('throttleFn', () => {
  it('should throttle the callback with the specified delay', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const throttledCallback = throttleFn(callback, 100);

    throttledCallback();
    vi.advanceTimersByTime(50);
    throttledCallback();
    vi.advanceTimersByTime(50);
    throttledCallback();

    expect(callback).toBeCalledTimes(1);

    vi.useRealTimers();
  });
});
