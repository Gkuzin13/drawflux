import { Provider as ToastProvider } from '@radix-ui/react-toast';
import {
  createContext,
  useContext,
  type PropsWithChildren,
  useState,
  useCallback,
} from 'react';
import Toast from '@/components/Elements/Toast/Toast';

export type Notification = {
  title: string;
  description?: string;
  type: 'error' | 'info' | 'success' | 'warning';
};

type NotificationContextValue = {
  add: (args: Notification) => void;
  remove: (id: string) => void;
  list: Map<string, Notification>;
};

export const NotificationsContext = createContext<
  NotificationContextValue | undefined
>(undefined);

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState(
    new Map<string, Notification>(),
  );

  const handleNotificationAdd = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.set(String(Date.now()), notification);
      return newMap;
    });
  }, []);

  const handleNotificationRemove = useCallback((id: string) => {
    setNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        add: handleNotificationAdd,
        remove: handleNotificationRemove,
        list: notifications,
      }}
    >
      <ToastProvider>
        {children}
        {Array.from(notifications).map(([id, notification]) => {
          return (
            <Toast
              key={id}
              title={notification.title}
              description={notification.description}
              onOpenChange={(open) => !open && handleNotificationRemove(id)}
              data-testid="toast"
            />
          );
        })}
      </ToastProvider>
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);

  if (ctx === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider',
    );
  }

  return ctx;
};
