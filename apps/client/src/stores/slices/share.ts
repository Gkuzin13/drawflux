import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'shared';
import { type RootState } from '../store';

export type ShareState = {
  userId: string | null;
  users: User[];
};

export const initialState: ShareState = {
  userId: null,
  users: [],
};

export const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{ users: User[]; userId: string }>) => {
      state.userId = action.payload.userId;
      state.users = action.payload.users;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (
      state,
      action: PayloadAction<Partial<User> & { id: string }>,
    ) => {
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
