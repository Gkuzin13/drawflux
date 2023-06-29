import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { globalStyle } from './global-style';
import { AppProvider } from './providers/app';

globalStyle();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
