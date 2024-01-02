import { useState, useCallback } from 'react';
import { Provider as ToastProvider } from '@radix-ui/react-toast';
import Toast from '@/components/Elements/Toast/Toast';
import { createContext } from './createContext';

export type Notification = {
  title: string;
  description?: string;
  type: 'error' | 'info' | 'success' | 'warning';
};

type NotificationsMap = Map<string, Notification>;

type NotificationContextValue = {
  addNotification: (notification: Notification) => void,
  removeNotification: (id: string) => void
};

export const [NotificationsContext, useNotifications] =
  createContext<NotificationContextValue>('Notifications');

export const NotificationsProvider = ({ children }: React.PropsWithChildren) => {
  const [notifications, setNotifications] = useState<NotificationsMap>(
    new Map(),
  );

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.set(String(Date.now()), notification);
      return newMap;
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  return (
    <NotificationsContext.Provider value={{ addNotification, removeNotification}}>
      <ToastProvider>
        {children}
        {Array.from(notifications).map(([id, notification]) => {
          return (
            <Toast
              key={id}
              title={notification.title}
              description={notification.description}
              onOpenChange={(open) => !open && removeNotification(id)}
              data-testid="toast"
            />
          );
        })}
      </ToastProvider>
    </NotificationsContext.Provider>
  );
};
