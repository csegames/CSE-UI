import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './navigationSlice';
import { ChannelStatus } from '../api/patcher/channelStatus';

export enum ServerType {
  CUGAME,
  CHANNEL,
  COLOSSUS,
  UNKNOWN,
  HIDDEN
}

export interface Launchable {
  type: ServerType;
  product: Product;
  channelStatus: ChannelStatus;
  channelID: number;
  shardID: number | undefined;
  apiHost: string | undefined;
  name: string;
  selectionKey: string;
  isOnline: boolean;
  isAvailable: boolean;
  canInstall: boolean;
  canAccess: boolean;
  accessRequirement: string;
  lastUpdated: Date | null;
}

export type LaunchableState = Record<string, Launchable>;

const DefaultState: LaunchableState = {};

export const launchableSlice = createSlice({
  name: 'download',
  initialState: DefaultState,
  reducers: {
    removeLaunchable: (state: LaunchableState, action: PayloadAction<string>) => {},
    updateLaunchable: (state: LaunchableState, action: PayloadAction<Launchable>) => {
      state[action.payload.selectionKey] = action.payload;
    }
  }
});

export const { removeLaunchable, updateLaunchable } = launchableSlice.actions;
