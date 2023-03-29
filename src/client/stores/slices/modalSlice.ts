import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type ModalState = {
  open: boolean;
  title: string;
  message: string;
};

const initialState: ModalState = {
  open: false,
  title: '',
  message: '',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<Omit<ModalState, 'open'>>) => {
      return { open: true, ...action.payload };
    },
    close: () => {
      return initialState;
    },
  },
});

export const selectModal = (state: RootState) => state.modal;

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
