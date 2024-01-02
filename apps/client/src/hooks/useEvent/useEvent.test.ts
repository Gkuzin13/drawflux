import { fireEvent, renderHook } from '@testing-library/react';
import useEvent from './useEvent';

describe('useEvent', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('calls the event listener when the event is triggered', async () => {
    const element = document.createElement('button');
    const handler = vi.fn();

    renderHook(() => useEvent('click', handler, element));

    fireEvent.click(element);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should bind/unbind the event listener to the window object if no element is provided', async () => {
    const spyAddEventListener = vi.spyOn(window, 'addEventListener');
    const spyRemoveEventListener = vi.spyOn(window, 'removeEventListener');

    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook(() => useEvent('click', handler));

    expect(spyAddEventListener).toHaveBeenCalledTimes(1);
    expect(spyAddEventListener).toHaveBeenCalledWith('click', handler, options);

    unmount();

    expect(spyRemoveEventListener).toHaveBeenCalledTimes(1);
    expect(spyRemoveEventListener).toHaveBeenCalledWith(
      'click',
      handler,
      options,
    );
  });

  it('should bind/unbind the event listener if element is provided', async () => {
    const element = document.createElement('button');
    const spyAddEventListener = vi.spyOn(element, 'addEventListener');
    const spyRemoveEventListener = vi.spyOn(element, 'removeEventListener');

    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook(() =>
      useEvent('click', handler, element, options),
    );

    expect(spyAddEventListener).toHaveBeenCalledTimes(1);
    expect(spyAddEventListener).toHaveBeenCalledWith('click', handler, options);

    unmount();

    expect(spyRemoveEventListener).toHaveBeenCalledTimes(1);
    expect(spyRemoveEventListener).toHaveBeenCalledWith(
      'click',
      handler,
      options,
    );
  });

  it('should not bind the event listener if handler is undefined', async () => {
    const element = document.createElement('button');
    const spyAddEventListener = vi.spyOn(element, 'addEventListener');
    const spyRemoveEventListener = vi.spyOn(element, 'removeEventListener');

    const handler = undefined;

    const { unmount } = renderHook(() => useEvent('click', handler, element));

    expect(spyAddEventListener).toHaveBeenCalledTimes(0);

    unmount();

    expect(spyRemoveEventListener).toHaveBeenCalledTimes(0);
  });

  it('should pass options to the event listener', async () => {
    const element = document.createElement('button');
    const spyAddEventListener = vi.spyOn(element, 'addEventListener');
    const spyRemoveEventListener = vi.spyOn(element, 'removeEventListener');

    const handler = vi.fn();
    const options = {
      capture: true,
      passive: true,
      once: true,
    };

    const { unmount } = renderHook(() =>
      useEvent('click', handler, element, { eventOptions: options }),
    );

    expect(spyAddEventListener).toHaveBeenCalledWith('click', handler, options);

    unmount();

    expect(spyRemoveEventListener).toHaveBeenCalledWith(
      'click',
      handler,
      options,
    );
  });
});
