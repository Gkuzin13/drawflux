import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CollabUser } from 'shared';
import { type RootState } from '../store';

export type ShareState = {
  userId: string | null;
  users: CollabUser[];
  isConnected: boolean;
};

export const initialState: ShareState = {
  userId: null,
  isConnected: false,
  users: [],
};

export const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<ShareState>) => {
      return action.payload;
    },
    addUser: (state, action: PayloadAction<CollabUser>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<Partial<CollabUser>>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);

      if (index === -1) {
        return;
      }

      state.users[index] = { ...state.users[index], ...action.payload };
    },
    removeUser: (state, action: PayloadAction<{ id: string }>) => {
      state.users = state.users.filter((u) => u.id !== action.payload.id);
    },
  },
});

export const selectShare = (state: RootState) => state.share;

export const shareActions = shareSlice.actions;
export default shareSlice.reducer;
