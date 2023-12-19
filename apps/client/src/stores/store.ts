import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './middlewares/listenerMiddleware';
import historyReducer from './reducers/history';
import canvas from './slices/canvas';
import collaboration from './slices/collaboration';
import library from './slices/library';

export const store = configureStore({
  reducer: {
    canvas: historyReducer(canvas),
    collaboration,
    library
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
