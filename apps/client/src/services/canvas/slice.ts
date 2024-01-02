import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { makeNodesCopy, reorderNodes, isValidNode } from '@/utils/node';
import { getCanvasCenteredPositionRelativeToNodes } from '@/utils/position';
import { historyActions } from '../../stores/reducers/history';
import type { NodeObject } from 'shared';
import type { AppState } from '@/constants/app';
import type { RootState } from '../../stores/store';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CanvasSliceState = {
  copiedNodes: NodeObject[] | null;
} & AppState['page'];

export type CanvasAction = (typeof canvasActions)[keyof typeof canvasActions];
export type CanvasActionType = CanvasAction['type'];

export const initialState: CanvasSliceState = {
  nodes: [],
  stageConfig: {
    scale: 1,
    position: { x: 0, y: 0 },
  },
  toolType: 'select',
  selectedNodesIds: {},
  copiedNodes: null,
};

export type ActionMeta = {
  receivedFromWS?: boolean;
  broadcast?: boolean;
};

export const prepareMeta = <T = undefined>(
  payload: T = undefined as T,
  meta?: ActionMeta,
) => {
  return { payload, meta };
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<AppState['page']>) => {
      const { nodes, selectedNodesIds, stageConfig, toolType } = action.payload;

      state.nodes = nodes;
      state.selectedNodesIds = selectedNodesIds;
      state.stageConfig = stageConfig;
      state.toolType = toolType;
    },
    setNodes: {
      reducer: (state, action: PayloadAction<NodeObject[]>) => {
        state.nodes = action.payload;
      },
      prepare: prepareMeta<NodeObject[]>,
    },
    addNodes: {
      reducer: (state, action: PayloadAction<NodeObject[]>) => {
        const nodesToAdd = action.payload;

        if (nodesToAdd.every(isValidNode)) {
          state.nodes.push(...nodesToAdd);
        }
      },
      prepare: prepareMeta<NodeObject[]>,
    },
    updateNodes: {
      reducer: (state, action: PayloadAction<NodeObject[]>) => {
        const updatedNodesMap = new Map(
          action.payload.map((node) => [node.nodeProps.id, node]),
        );

        const updatedNodes = state.nodes.map((node) => {
          const updatedNode = updatedNodesMap.get(node.nodeProps.id);

          return updatedNode ?? node;
        });

        state.nodes = updatedNodes.filter(isValidNode);
      },
      prepare: prepareMeta<NodeObject[]>,
    },
    deleteNodes: {
      reducer: (state, action: PayloadAction<string[]>) => {
        const nodesIds = new Set<string>(action.payload);

        state.nodes = state.nodes.filter(
          (node) => !nodesIds.has(node.nodeProps.id),
        );
      },
      prepare: prepareMeta<string[]>,
    },
    moveNodesToStart: {
      reducer: (state, action: PayloadAction<string[]>) => {
        state.nodes = reorderNodes(action.payload, state.nodes).toStart();
      },
      prepare: prepareMeta<string[]>,
    },
    moveNodesForward: {
      reducer: (state, action: PayloadAction<string[]>) => {
        state.nodes = reorderNodes(action.payload, state.nodes).forward();
      },
      prepare: prepareMeta<string[]>,
    },
    moveNodesBackward: {
      reducer: (state, action: PayloadAction<string[]>) => {
        state.nodes = reorderNodes(action.payload, state.nodes).backward();
      },
      prepare: prepareMeta<string[]>,
    },
    moveNodesToEnd: {
      reducer: (state, action: PayloadAction<string[]>) => {
        state.nodes = reorderNodes(action.payload, state.nodes).toEnd();
      },
      prepare: prepareMeta<string[]>,
    },
    copyNodes: (state) => {
      const { nodes, selectedNodesIds } = state;

      const selectedNodes = nodes.filter(
        (node) => node.nodeProps.id in selectedNodesIds,
      );

      state.copiedNodes = makeNodesCopy(selectedNodes);
    },
    pasteNodes: {
      reducer: (state) => {
        const { copiedNodes } = state;

        if (!copiedNodes) {
          return;
        }

        state.nodes.push(...copiedNodes);
        state.selectedNodesIds = Object.fromEntries(
          copiedNodes.map(({ nodeProps }) => [nodeProps.id, true]),
        );
        state.copiedNodes = null;
      },
      prepare: prepareMeta,
    },
    setToolType: (
      state,
      action: PayloadAction<CanvasSliceState['toolType']>,
    ) => {
      state.toolType = action.payload;
    },
    setStageConfig: (
      state,
      action: PayloadAction<Partial<CanvasSliceState['stageConfig']>>,
    ) => {
      state.stageConfig = { ...state.stageConfig, ...action.payload };
    },
    setSelectedNodesIds: (state, action: PayloadAction<string[]>) => {
      if (!action.payload.length) {
        state.selectedNodesIds = {};
        return;
      }

      state.selectedNodesIds = Object.fromEntries(
        action.payload.map((nodeId) => [nodeId, true]),
      );
    },
    selectAllNodes: (state) => {
      state.selectedNodesIds = Object.fromEntries(
        state.nodes.map((node) => [node.nodeProps.id, true]),
      );
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(canvasSlice.actions.setNodes.match, (state) => {
        const { nodes, stageConfig } = state;

        const centeredPosition = getCanvasCenteredPositionRelativeToNodes(
          nodes,
          { scale: stageConfig.scale },
        );

        state.stageConfig.position = centeredPosition;
      })
      .addMatcher(
        isAnyOf(historyActions.redo.match, historyActions.undo.match),
        (state) => {
          state.selectedNodesIds = {};
        },
      )
      .addMatcher(canvasSlice.actions.deleteNodes.match, (state) => {
        state.selectedNodesIds = {};
      });
  },
});

export const selectNodes = (state: RootState) => state.canvas.present.nodes;
export const selectConfig = (state: RootState) =>
  state.canvas.present.stageConfig;
export const selectToolType = (state: RootState) =>
  state.canvas.present.toolType;
export const selectSelectedNodesIds = (state: RootState) =>
  state.canvas.present.selectedNodesIds;
export const selectCopiedNodes = (state: RootState) =>
  state.canvas.present.copiedNodes;
export const selectHistory = (state: RootState) => state.canvas;

export const canvasActions = canvasSlice.actions;
export default canvasSlice.reducer;
