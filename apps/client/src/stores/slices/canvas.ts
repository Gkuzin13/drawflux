import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { makeNodesCopy, reorderNodes, isValidNode } from '@/utils/node';
import { getCanvasCenteredPositionRelativeToNodes } from '@/utils/position';
import { historyActions } from '../reducers/history';
import type { NodeObject } from 'shared';
import type { AppState } from '@/constants/app';
import type { RootState } from '../store';
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
    setNodes: (state, action: PayloadAction<NodeObject[]>) => {
      state.nodes = action.payload;
    },
    addNodes: (state, action: PayloadAction<NodeObject[]>) => {
      const nodesToAdd = action.payload;

      if (nodesToAdd.every(isValidNode)) {
        state.nodes.push(...nodesToAdd);
      }
    },
    updateNodes: (state, action: PayloadAction<NodeObject[]>) => {
      const updatedNodesMap = new Map(
        action.payload.map((node) => [node.nodeProps.id, node]),
      );

      const updatedNodes = state.nodes.map((node) => {
        const updatedNode = updatedNodesMap.get(node.nodeProps.id);

        return updatedNode ?? node;
      });

      state.nodes = updatedNodes.filter(isValidNode);
    },
    deleteNodes: (state, action: PayloadAction<string[]>) => {
      const nodesIds = new Set<string>(action.payload);

      state.nodes = state.nodes.filter(
        (node) => !nodesIds.has(node.nodeProps.id),
      );
    },
    moveNodesToStart: (state, action: PayloadAction<string[]>) => {
      state.nodes = reorderNodes(action.payload, state.nodes).toStart();
    },
    moveNodesForward: (state, action: PayloadAction<string[]>) => {
      state.nodes = reorderNodes(action.payload, state.nodes).forward();
    },
    moveNodesBackward: (state, action: PayloadAction<string[]>) => {
      state.nodes = reorderNodes(action.payload, state.nodes).backward();
    },
    moveNodesToEnd: (state, action: PayloadAction<string[]>) => {
      state.nodes = reorderNodes(action.payload, state.nodes).toEnd();
    },
    copyNodes: (state) => {
      const { nodes, selectedNodesIds } = state;

      state.copiedNodes = nodes.filter(
        ({ nodeProps }) => nodeProps.id in selectedNodesIds,
      );
    },
    pasteNodes: (state) => {
      if (state.copiedNodes) {
        const duplicatedNodes = makeNodesCopy(state.copiedNodes);

        state.nodes.push(...duplicatedNodes);

        state.selectedNodesIds = Object.fromEntries(
          duplicatedNodes.map(({ nodeProps }) => [nodeProps.id, true]),
        );

        state.copiedNodes = null;
      }
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
