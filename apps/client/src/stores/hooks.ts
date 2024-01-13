import { createSelectorCreator, lruMemoize } from 'reselect';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
  shallowEqual,
} from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { type Store } from '@reduxjs/toolkit';

export const useAppStore: () => Store<RootState> = useStore;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const createSelectorWithShallowEqual = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: shallowEqual,
});

export const createParametricSelectorHook = <
  Result,
  Params extends readonly unknown[],
>(
  selector: (state: RootState, ...params: Params) => Result,
) => {
  return (...args: Params) => {
    return useSelector((state: RootState) => selector(state, ...args));
  };
};
