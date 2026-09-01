import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChannelInfo } from '../api/patcher/channelInfo';

export type ChannelState = Record<number, ChannelInfo>;

const DefaultState: ChannelState = {};

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: DefaultState,
  reducers: {
    updateChannel: (state: ChannelState, action: PayloadAction<ChannelInfo>) => {
      state[action.payload.id] = action.payload;
    }
  }
});

export const { updateChannel } = channelsSlice.actions;
