import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import { store } from './stores/store';
import { globalStyle } from './styles/global';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/p/:id',
    element: <Root />,
  },
]);

globalStyle();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>,
);
