import { act, renderHook, screen } from '@testing-library/react';
import { NotificationsProvider, useNotifications } from '../notifications';
import type { Notification } from '../notifications';

describe('notifications context', () => {
  it('adds notifications', async () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationsProvider,
    });

    const notifications: Notification[] = [
      { title: 'test', description: 'test', type: 'info' },
      { title: 'test2', type: 'warning' },
    ];

    await act(async () => {
      result.current.addNotification(notifications[0]);
    });

    await act(async () => {
      result.current.addNotification(notifications[1]);
    });

    expect(screen.getAllByTestId(/toast/)).toHaveLength(2);
  });

  it.skip('removes notifications', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationsProvider,
    });

    const notifications: Notification[] = [
      { title: 'test', description: 'test', type: 'info' },
      { title: 'test2', type: 'warning' },
    ];

    await act(async () => {
      result.current.addNotification(notifications[0]);
      result.current.addNotification(notifications[1]);
    });

    expect(screen.getAllByTestId(/toast/)).toHaveLength(2);

    await vi.advanceTimersByTimeAsync(5000);

    expect(screen.getAllByTestId(/toast/)).toHaveLength(1);
  });
});
