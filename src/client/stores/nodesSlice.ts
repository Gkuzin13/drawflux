import { NodeType, NodeProps } from '@/client/shared/element';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type NodesState = {
  nodes: NodeType[];
};

const initialState: NodesState = {
  nodes: [],
};

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<NodeType>) => {
      state.nodes.push(action.payload);
    },
    update: (state, action: PayloadAction<NodeType>) => {
      const nodeIndex = state.nodes.findIndex((node) => {
        return node.nodeProps.id === action.payload.nodeProps.id;
      });

      if (nodeIndex >= 0) {
        state.nodes[nodeIndex] = action.payload;
      }
    },
    delete: (state, action: PayloadAction<Pick<NodeProps, 'id'>>) => {
      const nodeIndex = state.nodes.findIndex((node) => {
        return node.nodeProps.id === action.payload.id;
      });

      if (nodeIndex >= 0) {
        state.nodes.splice(nodeIndex, 1);
      }
    },
    deleteAll: (state) => {
      state.nodes = [];
    },
  },
});

export const selectNodes = (state: RootState) => state;

export const nodesActions = nodesSlice.actions;
export default nodesSlice.reducer;
