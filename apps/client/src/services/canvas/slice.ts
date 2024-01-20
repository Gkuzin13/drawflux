import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { reorderNodes, isValidNode, duplicateNodesToRight } from '@/utils/node';
import { getCanvasCenteredPositionRelativeToNodes } from '@/utils/position';
import { historyActions } from '../../stores/reducers/history';
import {
  createParametricSelectorHook,
  createAppSelector,
} from '@/stores/hooks';
import type { NodeObject, NodeStyle } from 'shared';
import type { AppState } from '@/constants/app';
import type { RootState } from '../../stores/store';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CanvasSliceState = {
  copiedNodes: NodeObject[];
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
  selectedNodeIds: {},
  copiedNodes: [],
  currentNodeStyle: {
    color: 'black',
    size: 'medium',
    animated: false,
    line: 'solid',
    opacity: 1,
  },
};

export type ActionMeta = {
  receivedFromWS?: boolean;
  broadcast?: boolean;
  duplicate?: boolean;
  selectNodes?: boolean;
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
    set: (state, action: PayloadAction<Partial<AppState['page']>>) => {
      return { ...state, ...action.payload };
    },
    setNodes: {
      reducer: (state, action: PayloadAction<NodeObject[]>) => {
        state.nodes = action.payload;
      },
      prepare: prepareMeta<NodeObject[]>,
    },
    addNodes: {
      reducer: (
        state,
        action: PayloadAction<NodeObject[], string, ActionMeta | undefined>,
      ) => {
        const nodesToAdd = action.payload;

        if (nodesToAdd.every(isValidNode)) {
          state.nodes.push(...nodesToAdd);
        }
      },
      prepare(payload: NodeObject[], meta?: ActionMeta) {
        if (meta?.duplicate) {
          return prepareMeta(duplicateNodesToRight(payload), meta);
        }

        return prepareMeta(payload, meta);
      },
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
      const { nodes, selectedNodeIds } = state;

      state.copiedNodes = nodes.filter(
        (node) => node.nodeProps.id in selectedNodeIds,
      );
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
    setSelectedNodeIds: (state, action: PayloadAction<string[]>) => {
      if (!action.payload.length) {
        state.selectedNodeIds = {};
        return;
      }

      state.selectedNodeIds = Object.fromEntries(
        action.payload.map((nodeId) => [nodeId, true]),
      );
    },
    selectAllNodes: (state) => {
      state.selectedNodeIds = Object.fromEntries(
        state.nodes.map((node) => [node.nodeProps.id, true]),
      );
    },
    unselectAllNodes: (state) => {
      state.selectedNodeIds = {};
    },
    setCurrentNodeStyle: (state, action: PayloadAction<Partial<NodeStyle>>) => {
      state.currentNodeStyle = { ...state.currentNodeStyle, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(canvasActions.setNodes.match, (state) => {
        const { nodes, stageConfig } = state;

        const centeredPosition = getCanvasCenteredPositionRelativeToNodes(
          nodes,
          { scale: stageConfig.scale },
        );

        state.stageConfig.position = centeredPosition;
      })
      .addMatcher(canvasActions.addNodes.match, (state, action) => {
        if (action.meta?.selectNodes) {
          state.selectedNodeIds = Object.fromEntries(
            action.payload.map((node) => [node.nodeProps.id, true]),
          );
        }
      })
      .addMatcher(
        isAnyOf(historyActions.redo.match, historyActions.undo.match),
        (state) => {
          state.selectedNodeIds = {};
        },
      )
      .addMatcher(canvasActions.deleteNodes.match, (state) => {
        state.selectedNodeIds = {};
      });
  },
});

export const selectNodes = (state: RootState) => state.canvas.present.nodes;

export const selectConfig = (state: RootState) =>
  state.canvas.present.stageConfig;

export const selectToolType = (state: RootState) =>
  state.canvas.present.toolType;

export const selectSelectedNodeIds = (state: RootState) =>
  state.canvas.present.selectedNodeIds;

const selectNodesById = createAppSelector(
  [selectNodes, (_nodes, nodeIds: string[]) => nodeIds],
  (nodes, nodeIds) => {
    const selectedNodeIds = Object.fromEntries(nodeIds.map((id) => [id, true]));
    return nodes.filter((node) => node.nodeProps.id in selectedNodeIds);
  },
);

export const useSelectNodesById = createParametricSelectorHook(selectNodesById);

export const selectCurrentNodeStyle = (state: RootState) =>
  state.canvas.present.currentNodeStyle;

export const selectCopiedNodes = (state: RootState) =>
  state.canvas.present.copiedNodes;

export const selectPastHistory = (state: RootState) => state.canvas.past;

export const selectFutureHistory = (state: RootState) => state.canvas.future;

export const canvasActions = canvasSlice.actions;
export default canvasSlice.reducer;
