import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { Vector2d } from 'konva/lib/types';
import type { NodeObject, StageConfig } from 'shared';
import type { SelectedNodesIds } from '@/constants/app';
import type { Tool } from '@/constants/tool';
import { allNodesInView, duplicateNodes, reorderNodes } from '@/utils/node';
import {
  getCenterPosition,
  getMiddleNode,
  getNodeRect,
} from '@/utils/position';
import { historyActions } from '../reducers/history';
import { type RootState } from '../store';

export type CanvasSliceState = {
  nodes: NodeObject[];
  stageConfig: StageConfig;
  toolType: Tool['value'];
  selectedNodesIds: SelectedNodesIds;
};

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
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    set: (_, action: PayloadAction<CanvasSliceState>) => {
      return action.payload;
    },
    setNodes: (state, action: PayloadAction<NodeObject[]>) => {
      state.nodes = action.payload;
    },
    addNodes: (state, action: PayloadAction<NodeObject[]>) => {
      state.nodes = [...state.nodes, ...action.payload];
    },
    updateNodes: (state, action: PayloadAction<NodeObject[]>) => {
      const nodesMap = new Map<string, NodeObject>(
        action.payload.map((node) => [node.nodeProps.id, node]),
      );

      state.nodes = state.nodes.map((node) => {
        if (nodesMap.has(node.nodeProps.id)) {
          return nodesMap.get(node.nodeProps.id) as NodeObject;
        }
        return node;
      });
    },
    deleteNodes: (state, action: PayloadAction<string[]>) => {
      const ids = new Set<string>(action.payload);

      state.nodes = state.nodes.filter((node) => !ids.has(node.nodeProps.id));
    },
    duplicateNodes: (state, action: PayloadAction<string[]>) => {
      const ids = new Set<string>(action.payload);

      const duplicatedNodes = duplicateNodes(
        state.nodes.filter((node) => ids.has(node.nodeProps.id)),
      );

      state.nodes.push(...duplicatedNodes);
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
      const newSelectedNodes: SelectedNodesIds = {};

      for (const nodeId of action.payload) {
        newSelectedNodes[nodeId] = true;
      }

      state.selectedNodesIds = newSelectedNodes;
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
      .addMatcher(canvasSlice.actions.duplicateNodes.match, (state, action) => {
        const { actions, caseReducers } = canvasSlice;
        const { nodes, stageConfig } = state;

        const lastPushedNodeIndex = -action.payload.length;
        const duplicatedNodes = nodes.slice(lastPushedNodeIndex);
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
