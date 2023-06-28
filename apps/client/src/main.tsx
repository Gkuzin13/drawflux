import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { NotificationsProvider } from '@/contexts/notifications';
import { WebSocketProvider } from '@/contexts/websocket';
import App from './App';
import { ModalProvider } from './contexts/modal';
import { store } from './stores/store';
import { globalStyle } from './styles/global';

globalStyle();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <ModalProvider>
        <NotificationsProvider>
          <WebSocketProvider>
            <App />
          </WebSocketProvider>
        </NotificationsProvider>
      </ModalProvider>
    </StoreProvider>
  </React.StrictMode>,
);
