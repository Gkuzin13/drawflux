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
      result.current.add(notifications[0]);
    });

    await act(async () => {
      result.current.add(notifications[1]);
    });

    const [notification1, notification2] = [...result.current.list.values()];

    expect(result.current.list.size).toBe(2);
    expect(notification1).toEqual(notifications[0]);
    expect(notification2).toEqual(notifications[1]);

    expect(screen.getAllByTestId(/toast/)).toHaveLength(2);
  });

  it.skip('removes notifications', async () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationsProvider,
    });

    const notifications: Notification[] = [
      { title: 'test', description: 'test', type: 'info' },
      { title: 'test2', type: 'warning' },
    ];

    await act(async () => {
      result.current.add(notifications[0]);
      result.current.add(notifications[1]);
    });

    const listEntries = [...result.current.list.entries()];

    await act(async () => {
      result.current.remove(listEntries[1][0]);
    });

    expect(result.current.list.size).toBe(1);
    expect(listEntries[1][1]).toEqual(notifications[1]);

    await act(async () => {
      result.current.remove(listEntries[0][0]);
    });

    expect(result.current.list.size).toBe(0);
    expect(listEntries[0][1]).toEqual(notifications[0]);

    expect(screen.getAllByTestId(/toast/)).toHaveLength(0);
  });
});
