import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import type { NodeObject } from 'shared';
import type { RootState } from '@/stores/store';
import type { Library, LibraryItem } from '@/constants/app';

export type LibrarySliceState = Library;

export const initialState: LibrarySliceState = {
  items: [],
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    set: (_, action: PayloadAction<LibrarySliceState>) => {
      return action.payload;
    },
    addItem: (state, action: PayloadAction<NodeObject[]>) => {
      const newLibraryItem: LibraryItem = {
        elements: action.payload,
        created: Date.now(),
        id: uuid(),
      };

      state.items.push(newLibraryItem);
    },
    removeItems: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(
        (item) => !action.payload.includes(item.id),
      );
    },
  },
});

export const selectLibrary = (state: RootState) => state.library;

export const libraryActions = librarySlice.actions;
export default librarySlice.reducer;
