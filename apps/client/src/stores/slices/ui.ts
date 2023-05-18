import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export type UiState = {
  dialog: {
    open: boolean;
    title: string;
    description: string;
  };
};

const initialState: UiState = {
  dialog: {
    open: false,
    title: '',
    description: '',
  },
};

export const uiSlice = createSlice({
  name: 'contextMenu',
  initialState,
  reducers: {
    openDialog: (
      state,
      action: PayloadAction<Omit<UiState['dialog'], 'open'>>,
    ) => {
      const updatedState = { open: true, ...action.payload };

      state.dialog = updatedState;
    },
    closeDialog: (state) => {
      state.dialog = initialState.dialog;
    },
  },
});

export const selectDialog = (state: RootState) => state.ui.dialog;

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
