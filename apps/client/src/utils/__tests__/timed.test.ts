import { throttleFn, createSingleClickHandler } from '@/utils/timed';

// needs work
describe('throttleFn', () => {
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

describe('createSingleClickHandler', () => {
  it('should call callback when when fn is called once', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const handler = createSingleClickHandler(callback, 200);

    handler();

    vi.advanceTimersByTime(200);

    expect(callback).toBeCalledTimes(1);

    vi.useRealTimers();
  });

  it('should not call callback when when fn is called twice', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const handler = createSingleClickHandler(callback, 200);

    handler();

    vi.advanceTimersByTime(100);

    handler();

    expect(callback).toBeCalledTimes(0);

    vi.useRealTimers();
  });
});
