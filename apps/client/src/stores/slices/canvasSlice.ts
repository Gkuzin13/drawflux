import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import { type StageConfig } from 'shared';
import type { SelectedNodesIds } from '@/constants/app';
import type { Tool } from '@/constants/tool';
import { api } from '@/services/api';
import { type RootState } from '../store';
import { historyActions } from './historySlice';
import { nodesActions } from './nodesSlice';

export type CanvasSliceState = {
  stageConfig: StageConfig;
  toolType: Tool['value'];
  selectedNodesIds: SelectedNodesIds;
};

export const initialState: CanvasSliceState = {
  stageConfig: {
    scale: 1,
    position: { x: 0, y: 0 },
  },
  toolType: 'arrow',
  selectedNodesIds: {},
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
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
    setSelectedNodesIds: (state, action: PayloadAction<SelectedNodesIds>) => {
      state.selectedNodesIds = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        api.endpoints.getPage.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            const { stageConfig } = payload.data.page;

            return { ...state, stageConfig };
          }

          return state;
        },
      )
      .addMatcher(
        isAnyOf(historyActions.redo.match, historyActions.undo.match),
        (state) => {
          state.selectedNodesIds = {};
        },
      )
      .addMatcher(nodesActions.delete.match, (state, { payload }) => {
        for (const nodeId of payload) {
          delete state.selectedNodesIds[nodeId];
        }
      });
  },
});

export const selectCanvas = (state: RootState) => state.canvas;

export const canvasActions = canvasSlice.actions;
export default canvasSlice.reducer;
