import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider as StoreProvider } from 'react-redux';
import canvasReducer, {
  initialState as initialCanvasState,
} from '@/stores/slices/canvas';
import historyReducer from '@/stores/reducers/history';
import collabReducer, {
  initialState as initialCollabState,
} from '@/stores/slices/collaboration';
import type { PropsWithChildren } from 'react';
import { WebSocketProvider } from '@/contexts/websocket';
import type { RootState } from '@/stores/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof setupStore>;
}

export const defaultPreloadedState = {
  canvas: { past: [], present: initialCanvasState, future: [] },
  collaboration: initialCollabState,
};

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      canvas: historyReducer(canvasReducer),
      collaboration: collabReducer,
    },
    preloadedState,
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = defaultPreloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({
    children,
  }: PropsWithChildren<{ children: React.ReactNode }>) {
    return (
      <StoreProvider store={store}>
        <WebSocketProvider>{children}</WebSocketProvider>
      </StoreProvider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
