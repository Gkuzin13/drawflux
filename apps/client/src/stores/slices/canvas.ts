import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { Vector2d } from 'konva/lib/types';
import type { NodeObject } from 'shared';
import type { AppState } from '@/constants/app';
import {
  allNodesInView,
  duplicateNodes,
  getAddedNodes,
  mapNodesIds,
  makeNodesCopy,
  reorderNodes,
} from '@/utils/node';
import {
  getCenterPosition,
  getMiddleNode,
  getNodeRect,
} from '@/utils/position';
import { historyActions } from '../reducers/history';
import { type RootState } from '../store';

export type CanvasSliceState = {
  copiedNodes: NodeObject[] | null;
} & AppState['page'];

export type CanvasAcionType =
  (typeof canvasActions)[keyof typeof canvasActions]['type'];

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

function sanitizeNodes(nodes: NodeObject[]) {
  return nodes.filter((node) => {
    if (node.type === 'text' && !node.text?.length) {
      return false;
    }
    return true;
  });
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<AppState['page']>) => {
      state.nodes = action.payload.nodes;
      state.selectedNodesIds = action.payload.selectedNodesIds;
      state.stageConfig = action.payload.stageConfig;
      state.toolType = action.payload.toolType;
    },
    setNodes: (state, action: PayloadAction<NodeObject[]>) => {
      state.nodes = action.payload;
    },
    addNodes: (state, action: PayloadAction<NodeObject[]>) => {
      const sanitizedNodesToAdd = sanitizeNodes(action.payload);

      state.nodes.push(...sanitizedNodesToAdd);
    },
    updateNodes: (state, action: PayloadAction<NodeObject[]>) => {
      const nodesMap = new Map<string, NodeObject>(
        action.payload.map((node) => [node.nodeProps.id, node]),
      );

      const updatedNodes = state.nodes.map((node) => {
        const updatedNode = nodesMap.get(node.nodeProps.id);

        return updatedNode ?? node;
      });

      state.nodes = sanitizeNodes(updatedNodes);
    },
    deleteNodes: (state, action: PayloadAction<string[]>) => {
      const nodesIds = new Set<string>(action.payload);

      state.nodes = state.nodes.filter(
        (node) => !nodesIds.has(node.nodeProps.id),
      );
    },
    duplicateNodes: (state, action: PayloadAction<string[]>) => {
      const nodesIds = new Set<string>(action.payload);

      const nodesToDuplicate = state.nodes.filter((node) =>
        nodesIds.has(node.nodeProps.id),
      );

      state.nodes.push(...duplicateNodes(nodesToDuplicate));
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
    copyNodes: (state, action: PayloadAction<string[]>) => {
      const nodesIds = new Set<string>(action.payload);

      const nodesToCopy = state.nodes.filter((node) =>
        nodesIds.has(node.nodeProps.id),
      );

      state.copiedNodes = makeNodesCopy(nodesToCopy);
    },
    pasteNodes: (state) => {
      if (state.copiedNodes) {
        state.nodes.push(...state.copiedNodes);
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
    focusStage: (state, action: PayloadAction<Vector2d>) => {
      const { scale } = state.stageConfig;
      const position = action.payload;

      state.stageConfig.position = getCenterPosition(
        position,
        scale,
        window.innerWidth,
        window.innerHeight,
      );
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(canvasSlice.actions.setNodes.match, (state, action) => {
        const middleNode = getMiddleNode(action.payload);

        if (middleNode) {
          const { caseReducers, actions } = canvasSlice;

          const focusPoint = getNodeRect(middleNode);
          caseReducers.focusStage(state, actions.focusStage(focusPoint));
        }
      })
      .addMatcher(
        isAnyOf(historyActions.redo.match, historyActions.undo.match),
        (state) => {
          state.selectedNodesIds = {};
        },
      )
      .addMatcher(canvasSlice.actions.pasteNodes.match, (state) => {
        if (state.copiedNodes) {
          const { caseReducers, actions } = canvasSlice;

          const copiedNodesIds = mapNodesIds(state.copiedNodes);

          caseReducers.setSelectedNodesIds(
            state,
            actions.setSelectedNodesIds(copiedNodesIds),
          );

          state.copiedNodes = null;
        }
      })
      .addMatcher(canvasSlice.actions.duplicateNodes.match, (state, action) => {
        const { actions, caseReducers } = canvasSlice;
        const { nodes, stageConfig } = state;

        const duplicatedNodes = getAddedNodes(nodes, action.payload.length);
        const nodesIds = duplicatedNodes.map(({ nodeProps }) => nodeProps.id);

        caseReducers.setSelectedNodesIds(
          state,
          actions.setSelectedNodesIds(nodesIds),
        );

        const stageRect = {
          ...stageConfig.position,
          width: window.innerWidth,
          height: window.innerHeight,
        };

        if (allNodesInView(duplicatedNodes, stageRect, stageConfig.scale)) {
          return;
        }

        const nodeInMiddle = getMiddleNode(duplicatedNodes);

        if (nodeInMiddle) {
          const { x, y } = getNodeRect(nodeInMiddle);
          caseReducers.focusStage(state, actions.focusStage({ x, y }));
        }
      })
      .addMatcher(canvasSlice.actions.deleteNodes.match, (state) => {
        state.selectedNodesIds = {};
      });
  },
});

export const selectCanvas = (state: RootState) => state.canvas.present;
export const selectHistory = (state: RootState) => state.canvas;

export const canvasActions = canvasSlice.actions;
export default canvasSlice.reducer;
