import { Node } from '@/shared/constants/base';
import { create, StateCreator, StoreApi } from 'zustand';

export type NodesSlice = {
  nodes: Node[];
  dispatch: (args: ReducerArgs) => any;
};

export type StageStore = NodesSlice;

export type ActionTypes = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export type ReducerArgs = {
  type: ActionTypes;
  payload?: Node;
};

export const ACTION_TYPES = Object.freeze({
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  DELETE_ALL: 'delete-all',
});

export const reducer = (
  state: NodesSlice,
  { type, payload }: ReducerArgs,
): NodesSlice => {
  switch (type) {
    case ACTION_TYPES.ADD:
      if (!payload) return state;

      return { ...state, nodes: [...state.nodes, payload] };
    case ACTION_TYPES.UPDATE:
      if (!payload?.nodeProps) return state;

      const nodeIdx = state.nodes.findIndex(
        (node) => node.nodeProps.id === payload?.nodeProps.id,
      );

      if (nodeIdx === -1) return state;

      let nodesCopy = [...state.nodes];

      nodesCopy[nodeIdx] = payload;

      return { ...state, nodes: nodesCopy };
    case ACTION_TYPES.DELETE:
      const updatedNodes = state.nodes.filter(
        (drawable) => drawable.nodeProps.id !== payload?.nodeProps.id,
      );

      return { ...state, nodes: updatedNodes };
    case ACTION_TYPES.DELETE_ALL:
      return { ...state, nodes: [] };
  }
};

export const createNodesSlice: StateCreator<NodesSlice> = (set) => ({
  nodes: [],
  dispatch: (args: ReducerArgs) =>
    set((state: NodesSlice) => reducer(state, args)),
});

export const useStageStore = create<StageStore>()((...a) => ({
  ...createNodesSlice(...a),
}));
