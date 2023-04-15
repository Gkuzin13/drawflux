import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type StageConfig } from 'shared';
import { api } from '@/services/api';
import { type RootState } from '../store';

export type StageConfigState = StageConfig;

export const initialState: StageConfigState = {
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
  },
  extraReducers(builder) {
    builder.addMatcher(
      api.endpoints.getPage.matchFulfilled,
      (state, { payload }) => {
        if (payload.data) {
          state = payload.data.page.stageConfig;
        }
      },
    );
  },
});

export const selectStageConfig = (state: RootState) => state.stageConfig;

export const stageConfigActions = stageConfigSlice.actions;
export default stageConfigSlice.reducer;
