/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LobbyView } from './navigationSlice';

export interface MessageData {
  id: string;
}

export enum NotificationsSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface PinnedNoticeMessageData extends MessageData {
  title: string;
  body: string;
  severity: NotificationsSeverity;
  time: string;
}

export interface EventAdvertisementPanelModalData {
  image: string;
  title: string;
  body: string;
}

export interface EventAdvertisementPanelMessageData extends MessageData {
  image: string;
  text: string;
  secondaryText?: string;
  showTime?: boolean;
  link?: string;
  modal?: EventAdvertisementPanelModalData;
  lobbyView?: LobbyView;
  champion?: string;
  time: string;
}

export interface MOTDMessageData extends MessageData {
  image: string;
  title: string;
  body: string;
  time: string;
}
export interface WarningBroadcastMessageData extends MessageData {
  image: string;
  title: string;
  severity: NotificationsSeverity;
  countdown?: {
    current: number;
    endsAt: number;
    max: number;
  };
  modalCountdownSeconds?: number;
}

interface NotificationsState {
  eventAdvertisementPanelMessagesData: EventAdvertisementPanelMessageData[];
  motdMessagesData: MOTDMessageData[];
  pinnedNoticesMessagesData: PinnedNoticeMessageData[];
  warningBroadcastMessageData: WarningBroadcastMessageData | null;
  eventAdvertisementModalMessage: EventAdvertisementPanelMessageData | null;
  motdModalMessage: MOTDMessageData | null;
  warningBroadcastModalMessage: WarningBroadcastMessageData | null;
  seenMOTD: string | null;
}

const initialState: NotificationsState = {
  eventAdvertisementPanelMessagesData: [],
  motdMessagesData: [],
  pinnedNoticesMessagesData: [],
  warningBroadcastMessageData: null,
  eventAdvertisementModalMessage: null,
  motdModalMessage: null,
  warningBroadcastModalMessage: null,
  seenMOTD: null
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addEventAdvertisementPanelMessageData: (
      state: NotificationsState,
      action: PayloadAction<EventAdvertisementPanelMessageData>
    ) => {
      const index = state.eventAdvertisementPanelMessagesData.findIndex((message) => message.id === action.payload.id);
      if (index === -1) {
        state.eventAdvertisementPanelMessagesData.unshift(action.payload);
      } else {
        state.eventAdvertisementPanelMessagesData[index] = action.payload;
      }
    },
    addMOTDMessageData: (state: NotificationsState, action: PayloadAction<MOTDMessageData>) => {
      const index = state.motdMessagesData.findIndex((message) => message.id === action.payload.id);
      if (index === -1) {
        state.motdMessagesData.unshift(action.payload);
      } else {
        state.motdMessagesData[index] = action.payload;
      }
    },
    addPinnedNoticeMessageData: (state: NotificationsState, action: PayloadAction<PinnedNoticeMessageData>) => {
      const index = state.pinnedNoticesMessagesData.findIndex((message) => message.id === action.payload.id);
      if (index === -1) {
        state.pinnedNoticesMessagesData.unshift(action.payload);
      } else {
        state.pinnedNoticesMessagesData[index] = action.payload;
      }
    },
    addWarningBroadcastMessageData: (state: NotificationsState, action: PayloadAction<WarningBroadcastMessageData>) => {
      state.warningBroadcastMessageData = action.payload;
    },
    removeEventAdvertisementPanelMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      state.eventAdvertisementPanelMessagesData = state.eventAdvertisementPanelMessagesData.filter(
        (message) => message.id !== action.payload
      );
    },
    removeMOTDMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      state.motdMessagesData = state.motdMessagesData.filter((message) => message.id !== action.payload);
    },
    removePinnedNoticeMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      state.pinnedNoticesMessagesData = state.pinnedNoticesMessagesData.filter(
        (message) => message.id !== action.payload
      );
    },
    removeWarningBroadcastMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      if (state.warningBroadcastMessageData.id === action.payload) {
        state.warningBroadcastMessageData = null;
      }
    },
    setEventAdvertisementPanelModalMessage: (
      state: NotificationsState,
      action: PayloadAction<EventAdvertisementPanelMessageData>
    ) => {
      state.eventAdvertisementModalMessage = action.payload;
    },
    setMOTDModalMessage: (state: NotificationsState, action: PayloadAction<MOTDMessageData>) => {
      state.motdModalMessage = action.payload;
    },
    setWarningBroadcastModalMessage: (
      state: NotificationsState,
      action: PayloadAction<WarningBroadcastMessageData>
    ) => {
      state.warningBroadcastModalMessage = action.payload;
    },
    updateWarningBroadcastCountdown: (state: NotificationsState, action: PayloadAction<[string, number]>) => {
      const [id, current] = action.payload;
      if (state.warningBroadcastMessageData.id === id && state.warningBroadcastMessageData.countdown) {
        state.warningBroadcastMessageData.countdown.current = current;
      }
    },
    setSeenMOTD: (state: NotificationsState, action: PayloadAction<string>) => {
      state.seenMOTD = action.payload;
    }
  }
});

export const {
  addEventAdvertisementPanelMessageData,
  addMOTDMessageData,
  addPinnedNoticeMessageData,
  addWarningBroadcastMessageData,
  removeEventAdvertisementPanelMessageData,
  removeMOTDMessageData,
  removePinnedNoticeMessageData,
  removeWarningBroadcastMessageData,
  setWarningBroadcastModalMessage,
  updateWarningBroadcastCountdown,
  setEventAdvertisementPanelModalMessage,
  setMOTDModalMessage,
  setSeenMOTD
} = notificationsSlice.actions;
