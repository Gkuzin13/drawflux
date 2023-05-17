import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export type ContextMenuType = 'node-menu' | 'drawing-canvas-menu';

export type UiState = {
  contextMenu: {
    type: ContextMenuType;
  };
  modal: {
    opened: boolean;
    title: string;
    message: string;
  };
};

const initialState: UiState = {
  contextMenu: {
    type: 'drawing-canvas-menu',
  },
  modal: {
    opened: false,
    title: '',
    message: '',
  },
};

export const uiSlice = createSlice({
  name: 'contextMenu',
  initialState,
  reducers: {
    setContextMenu: (
      state,
      action: PayloadAction<Omit<UiState['contextMenu'], 'opened'>>,
    ) => {
      const updatedState = {
        ...action.payload,
        opened: true,
      };

      state.contextMenu = updatedState;
    },
    openModal: (
      state,
      action: PayloadAction<Omit<UiState['modal'], 'opened'>>,
    ) => {
      const updatedState = { opened: true, ...action.payload };

      state.modal = updatedState;
    },
    closeModal: (state) => {
      state.modal.opened = false;
    },
  },
});

export const selectContextMenu = (state: RootState) => state.ui.contextMenu;
export const selectModal = (state: RootState) => state.ui.modal;

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
