import { NodeType, NodeProps } from '@/client/shared/element';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { ACTION_TYPES } from './actions';
import { RootState } from './store';

export type NodesState = {
  nodes: NodeType[];
};

const { ADD_NODE, UPDATE_NODE, DELETE_NODE, DELETE_ALL_NODES } = ACTION_TYPES;

const initialState: NodesState = {
  nodes: [],
};

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createAction<NodeType>(ADD_NODE), (state, action) => {
        state.nodes.push(action.payload);
      })
      .addCase(createAction<NodeType>(UPDATE_NODE), (state, action) => {
        const nodeIndex = state.nodes.findIndex((node) => {
          return node.nodeProps.id === action.payload.nodeProps.id;
        });

        if (nodeIndex >= 0) {
          state.nodes[nodeIndex] = action.payload;
        }
      })
      .addCase(
        createAction<Pick<NodeProps, 'id'>>(DELETE_NODE),
        (state, action) => {
          state.nodes = state.nodes.filter(
            (node) => node.nodeProps.id !== action.payload.id,
          );
        },
      )
      .addCase(createAction<undefined>(DELETE_ALL_NODES), (state) => {
        state.nodes = [];
      });
  },
  reducers: {},
});

export const selectNodes = (state: RootState) => state;

export default nodesSlice.reducer;
