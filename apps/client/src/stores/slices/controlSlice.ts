import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tool } from '@/constants/tool';
import { RootState } from '../store';

export type ControlState = {
  selectedNodeId: string | null;
  toolType: Tool['value'];
};

export const controlInitialState: ControlState = {
  selectedNodeId: null,
  toolType: 'arrow',
};

export const controlSlice = createSlice({
  name: 'control',
  initialState: controlInitialState,
  reducers: {
    setSelectedNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeId = action.payload;
    },
    unsetSelectedNode: (state) => {
      state.selectedNodeId = null;
    },
    setToolType: (state, action: PayloadAction<Tool['value']>) => {
      state.toolType = action.payload;
    },
  },
});

export const selectControl = (state: RootState) => state.control;

export const controlActions = controlSlice.actions;
export default controlSlice.reducer;
