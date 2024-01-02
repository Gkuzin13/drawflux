import { isAnyOf } from '@reduxjs/toolkit';
import { libraryActions } from './slice';
import { storage } from '@/utils/storage';
import { LOCAL_STORAGE_LIBRARY_KEY } from '@/constants/app';
import type { Library } from '@/constants/app';
import type { AppStartListening } from '@/stores/middlewares/listenerMiddleware';

export const addLibraryListener = (startListening: AppStartListening) => {
  startListening({
    matcher: isAnyOf(
      libraryActions.addItem.match,
      libraryActions.removeItems.match,
    ),
    effect: (_, listenerApi) => {
      const libraryState = listenerApi.getState().library;
      
      storage.set<Library>(LOCAL_STORAGE_LIBRARY_KEY, libraryState);
    },
  });
};
