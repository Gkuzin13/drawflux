import type { NodeObject } from '@shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/services/api';

export type NodesState = {
  nodes: NodeObject[];
};

const initialState: NodesState = {
  nodes: [],
};

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<NodeObject[]>) => {
      state.nodes = action.payload;
    },
    add: (state, action: PayloadAction<NodeObject[]>) => {
      state.nodes = [...state.nodes, ...action.payload];
    },
    update: (state, action: PayloadAction<NodeObject[]>) => {
      const nodesMap = new Map<string, NodeObject>();

      action.payload.forEach((node) => {
        nodesMap.set(node.nodeProps.id, node);
      });

      return {
        nodes: state.nodes.map((node) => {
          if (nodesMap.has(node.nodeProps.id)) {
            return nodesMap.get(node.nodeProps.id) as NodeObject;
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
  extraReducers(builder) {
    builder.addMatcher(
      api.endpoints.getPage.matchFulfilled,
      (state, { payload }) => {
        if (payload.data?.page) {
          state.nodes = payload.data.page.nodes;
        }
      },
    );
  },
});

export const selectNodes = (state: RootState) => state.nodesHistory;

export const nodesActions = nodesSlice.actions;
export default nodesSlice.reducer;
