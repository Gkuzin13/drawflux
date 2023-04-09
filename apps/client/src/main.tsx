import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { globalStyle } from './styles/global';
import { store } from './stores/store';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import SharedPage from './routes/SharedPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/p/:id',
    element: <SharedPage />,
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
