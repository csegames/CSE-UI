import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Installable } from '../api/graphql/schema';

type InstallableState = Record<number, Installable>;

const DefaultState: InstallableState = {};

export const installablesSlice = createSlice({
  name: 'installables',
  initialState: DefaultState,
  reducers: {
    removeInstallable: (state: InstallableState, action: PayloadAction<number>) => {
      delete state[action.payload];
    },
    updateInstallable: (state: InstallableState, action: PayloadAction<Installable>) => {
      if (action.payload.channelID) state[action.payload.channelID] = action.payload;
    }
  }
});

export const { removeInstallable, updateInstallable } = installablesSlice.actions;
