import { createSlice } from '@reduxjs/toolkit';
import type { User } from 'shared';
import type { RootState } from '@/stores/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { prepareMeta } from '../canvas/slice';

export type CollaborationSliceState = {
  thisUser: User | null;
  collaborators: User[];
};

export const initialState: CollaborationSliceState = {
  thisUser: null,
  collaborators: [],
};

export const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    init: (
      state,
      action: PayloadAction<{ collaborators: User[]; thisUser: User }>,
    ) => {
      state.thisUser = action.payload.thisUser;
      state.collaborators = action.payload.collaborators;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.collaborators.push(action.payload);
    },
    updateUser: {
      reducer: (state, action: PayloadAction<User>) => {
        if (state.thisUser?.id === action.payload.id) {
          state.thisUser = action.payload;
          return;
        }

        state.collaborators = state.collaborators.map((user) => {
          return user.id === action.payload.id ? action.payload : user;
        });
      },
      prepare: prepareMeta<User>,
    },
    removeUser: (state, action: PayloadAction<{ id: string }>) => {
      state.collaborators = state.collaborators.filter(
        (u) => u.id !== action.payload.id,
      );
    },
  },
});

export const selectThisUser = (state: RootState) =>
  state.collaboration.thisUser;
export const selectCollaborators = (state: RootState) =>
  state.collaboration.collaborators;

export const collaborationActions = collaborationSlice.actions;
export default collaborationSlice.reducer;
