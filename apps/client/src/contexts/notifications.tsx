import { Provider as ToastProvider } from '@radix-ui/react-toast';
import {
  createContext,
  useContext,
  type PropsWithChildren,
  useState,
  useCallback,
} from 'react';
import Toast from '@/components/Elements/Toast/Toast';

type Notification = {
  title: string;
  description?: string;
  type: 'error' | 'info' | 'success' | 'warning';
};

type NotificationContextValue = {
  addNotification: (args: Notification) => void;
  removeNotification: (id: string) => void;
};

export const NotificationsContext = createContext<NotificationContextValue>({
  addNotification: () => null,
  removeNotification: () => null,
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
        addNotification: handleAddNotification,
        removeNotification: handleRemoveNotification,
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
