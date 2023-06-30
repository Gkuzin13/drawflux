import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './middlewares/listenerMiddleware';
import historyReducer from './reducers/history';
import canvas from './slices/canvas';
import collaboration from './slices/collaboration';

const canvasReducer = historyReducer(canvas);

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    collaboration,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
