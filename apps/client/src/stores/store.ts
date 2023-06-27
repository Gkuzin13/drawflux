import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './listenerMiddleware';
import historyReducer from './reducers/history';
import canvas from './slices/canvas';
import share from './slices/share';

const canvasReducer = historyReducer(canvas);

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    share,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
