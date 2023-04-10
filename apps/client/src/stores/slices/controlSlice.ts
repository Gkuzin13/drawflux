import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tool } from '@/constants/tool';
import { RootState } from '../store';
import { ControlState } from '@/constants/app';

export const controlInitialState: ControlState = {
  selectedNodeId: null,
  toolType: 'arrow',
};

export const controlSlice = createSlice({
  name: 'control',
  initialState: controlInitialState,
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
      state = action.payload;
    },
  },
});

export const selectControl = (state: RootState) => state.control;

export const controlActions = controlSlice.actions;
export default controlSlice.reducer;
