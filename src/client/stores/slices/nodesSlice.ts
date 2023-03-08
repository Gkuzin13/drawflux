import { NodeType } from '@/client/shared/constants/element';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

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
    add: (state, action: PayloadAction<NodeType[]>) => {
      state.nodes = [...state.nodes, ...action.payload];
    },
    update: (state, action: PayloadAction<NodeType[]>) => {
      const nodesMap = new Map<string, NodeType>();

      action.payload.forEach((node) => {
        nodesMap.set(node.nodeProps.id, node);
      });

      return {
        nodes: state.nodes.map((node) => {
          if (nodesMap.has(node.nodeProps.id)) {
            return nodesMap.get(node.nodeProps.id) as NodeType;
          }

          return node;
        }),
      };
    },
    delete: (state, action: PayloadAction<string[]>) => {
      const ids = new Set<string>(action.payload);

      return {
        nodes: state.nodes.filter((node) => !ids.has(node.nodeProps.id)),
      };
    },
    deleteAll: (state) => {
      state.nodes = [];
    },
  },
});

export const selectNodes = (state: RootState) => state.undoableNodes;

export const nodesActions = nodesSlice.actions;
export default nodesSlice.reducer;
