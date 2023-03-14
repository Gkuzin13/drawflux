import { hasStageScaleReachedLimit } from '@/client/components/Stage/helpers/zoom';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vector2d } from 'konva/lib/types';
import { RootState } from '../store';

export type StageConfigState = {
  scale: number;
  position: Vector2d;
};

const initialState: StageConfigState = {
  scale: 1,
  position: { x: 0, y: 0 },
};

export const stageConfigSlice = createSlice({
  name: 'stage-config',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<StageConfigState>>) => {
      return { ...state, ...action.payload };
    },
    scaleIncrease: (state) => {
      const updatedScale = state.scale + 0.1;
      if (hasStageScaleReachedLimit(updatedScale)) {
        return state;
      }

      return { ...state, scale: updatedScale };
    },
    scaleDecrease: (state) => {
      const updatedScale = state.scale - 0.1;
      if (hasStageScaleReachedLimit(updatedScale)) {
        return state;
      }

      return { ...state, scale: updatedScale };
    },
    scaleReset: (state) => {
      return { ...state, scale: initialState.scale };
    },
  },
});

export const selectStageConfig = (state: RootState) => state.stageConfig;

export const stageConfigActions = stageConfigSlice.actions;
export default stageConfigSlice.reducer;
