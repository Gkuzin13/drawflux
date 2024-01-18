import { configureStore } from '@reduxjs/toolkit';
import { render, screen, type RenderOptions } from '@testing-library/react';
import { Provider as StoreProvider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import canvasReducer, {
  initialState as initialCanvasState,
} from '@/services/canvas/slice';
import historyReducer, {
  type CanvasHistoryState,
} from '@/stores/reducers/history';
import collabReducer, {
  initialState as initialCollabState,
} from '@/services/collaboration/slice';
import libraryReducer, {
  initialState as initialLibraryState,
} from '@/services/library/slice';
import { WebSocketProvider } from '@/contexts/websocket';
import { ThemeProvider } from '@/contexts/theme';
import { NotificationsProvider } from '@/contexts/notifications';
import { ModalProvider } from '@/contexts/modal';
import type { PropsWithChildren } from 'react';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { RootState } from '@/stores/store';
import type { Options as UserEventOptions } from '@testing-library/user-event/dist/types/options';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof setupStore>;
}

export const defaultPreloadedState = {
  canvas: {
    past: [],
    present: initialCanvasState,
    future: [],
  } as CanvasHistoryState,
  collaboration: initialCollabState,
  library: initialLibraryState,
};

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      canvas: historyReducer(canvasReducer),
      collaboration: collabReducer,
      library: libraryReducer,
    },
    preloadedState,
  });
};

export const setupTestStore = (
  preloadedState: PreloadedState<RootState> = defaultPreloadedState,
) => {
  const store = setupStore(preloadedState);
  store.dispatch = vi.fn(store.dispatch) as typeof store.dispatch;

  return store;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = defaultPreloadedState,
    store = setupTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
  userEventOptions: UserEventOptions = {},
) {
  function Wrapper({
    children,
  }: PropsWithChildren<{ children: React.ReactNode }>) {
    return (
      <StoreProvider store={store}>
        <WebSocketProvider>
          <ThemeProvider>
            <ModalProvider>
              <NotificationsProvider>{children}</NotificationsProvider>
            </ModalProvider>
          </ThemeProvider>
        </WebSocketProvider>
      </StoreProvider>
    );
  }

  return {
    store,
    user: userEvent.setup(userEventOptions),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export async function findCanvas() {
  const container = (await screen.findByRole('presentation'))
    .parentElement as HTMLDivElement;
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;

  return { container, canvas };
}

export function changeJSDOMURL(url: URL | string) {
  history.replaceState(history.state, '', url);
}
