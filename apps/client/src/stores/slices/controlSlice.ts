import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ControlState } from '@/constants/app';
import { type Tool } from '@/constants/tool';
import { type RootState } from '../store';

const initialState: ControlState = {
  selectedNodeId: null,
  toolType: 'arrow',
};

export const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    setSelectedNode: (
      state,
      action: PayloadAction<ControlState['selectedNodeId']>,
    ) => {
      state.selectedNodeId = action.payload;
    },
    setToolType: (state, action: PayloadAction<Tool['value']>) => {
      state.toolType = action.payload;
    },
    set: (state, action: PayloadAction<ControlState>) => {
      return (state = action.payload);
    },
  },
});

export const selectControl = (state: RootState) => state.control;

export const controlActions = controlSlice.actions;
export default controlSlice.reducer;
