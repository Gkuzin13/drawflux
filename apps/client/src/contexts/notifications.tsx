import { Provider as ToastProvider } from '@radix-ui/react-toast';
import {
  createContext,
  useContext,
  type PropsWithChildren,
  useState,
  useCallback,
} from 'react';
import Toast from '@/components/Toast/Toast';

type Notification = {
  title: string;
  description?: string;
  type: 'error' | 'info' | 'success' | 'warning';
};

type NotificationContextValue = {
  add: (args: Notification) => void;
  remove: (id: string) => void;
};

export const NotificationsContext = createContext<NotificationContextValue>({
  add: () => null,
  remove: () => null,
});

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState(
    new Map<string, Notification>(),
  );

  const handleAddNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.set(String(Date.now()), notification);
      return newMap;
    });
  }, []);

  const handleRemoveNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        add: handleAddNotification,
        remove: handleRemoveNotification,
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
              onOpenChange={(open) => !open && handleRemoveNotification(id)}
              forceMount
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