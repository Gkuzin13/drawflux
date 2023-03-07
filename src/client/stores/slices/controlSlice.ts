import { NodeType } from '@/client/shared/element';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tool } from '../../shared/tool';
import { RootState } from '../store';

export type ControlState = {
  selectedNodeId: string | null;
  nodesInStaging: NodeType[];
  toolType: Tool['value'];
};

const initialState: ControlState = {
  selectedNodeId: null,
  nodesInStaging: [],
  toolType: 'arrow',
};

export const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    setSelectedNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeId = action.payload;
    },
    unsetSelectedNode: (state) => {
      state.selectedNodeId = null;
    },
    setNodesInStaging: (state, action: PayloadAction<NodeType[]>) => {
      state.nodesInStaging = action.payload;
    },
    setToolType: (state, action: PayloadAction<Tool['value']>) => {
      state.toolType = action.payload;
    },
  },
});

export const selectControl = (state: RootState) => state.control;

export const controlActions = controlSlice.actions;
export default controlSlice.reducer;
