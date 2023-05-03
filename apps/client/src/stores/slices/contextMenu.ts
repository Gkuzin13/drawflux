import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Vector2d } from 'konva/lib/types';
import { type RootState } from '../store';

export type ContextMenuType = 'node-menu' | 'drawing-canvas-menu';

type ContextMenuState = {
  type: ContextMenuType;
  position: Vector2d;
  opened: boolean;
};

const initialState: ContextMenuState = {
  type: 'drawing-canvas-menu',
  position: { x: 0, y: 0 },
  opened: false,
};

export const contextMenuSlice = createSlice({
  name: 'contextMenu',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<Omit<ContextMenuState, 'opened'>>) => {
      const { position, type } = action.payload;

      state.position = position;
      state.type = type;
      state.opened = true;
    },
    close: (state) => {
      state.opened = false;
    },
  },
});

export const selectContextMenu = (state: RootState) => state.contextMenu;

export const contextMenuActions = contextMenuSlice.actions;
export default contextMenuSlice.reducer;
