import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import type { AppDispatch, RootState } from './store';
import type { Store } from '@reduxjs/toolkit';

export const useAppStore: () => Store<RootState> = useStore;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
