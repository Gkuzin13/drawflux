import { Provider as StoreProvider } from 'react-redux';
import { ModalProvider } from '@/contexts/modal';
import { NotificationsProvider } from '@/contexts/notifications';
import { WebSocketProvider } from '@/contexts/websocket';
import { store } from '@/stores/store';
import { ThemeProvider } from '@/contexts/theme';
import useParam from '@/hooks/useParam/useParam';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';

type Props = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: Props) => {
  const roomId = useParam(PAGE_URL_SEARCH_PARAM_KEY);

  return (
    <StoreProvider store={store}>
      <WebSocketProvider roomId={roomId}>
        <ThemeProvider>
          <ModalProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </ModalProvider>
        </ThemeProvider>
      </WebSocketProvider>
    </StoreProvider>
  );
};
