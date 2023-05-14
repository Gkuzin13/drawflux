import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { listenerMiddleware } from './listenerMiddleware';
import historyReducer from './reducers/history';
import canvas from './slices/canvas';
import ui from './slices/ui';

const canvasReducer = historyReducer(canvas);

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    ui,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
