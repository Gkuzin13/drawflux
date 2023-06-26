import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
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
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </ModalProvider>
    </StoreProvider>
  </React.StrictMode>,
);
