import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './middlewares/listenerMiddleware';
import historyReducer from './reducers/history';
import canvas from '../services/canvas/slice';
import collaboration from '../services/collaboration/slice';
import library from '@/services/library/slice';

export const store = configureStore({
  reducer: {
    canvas: historyReducer(canvas),
    collaboration,
    library,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
