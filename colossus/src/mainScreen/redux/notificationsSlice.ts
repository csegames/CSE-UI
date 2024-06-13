/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LobbyView } from './navigationSlice';

export enum NotificationsMessageSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface MessageData {
  id: string;
}

export interface NotificationsMessageData extends MessageData {
  title: string;
  body: string;
  severity: NotificationsMessageSeverity;
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

export interface MOTDModalData {
  image: string;
  title: string;
  body: string;
}

export interface MOTDMessageData extends MessageData {
  modal: MOTDModalData;
  time: string;
}

interface NotificationsState {
  eventAdvertisementPanelMessagesData: EventAdvertisementPanelMessageData[];
  motdMessagesData: MOTDMessageData[];
  notificationsMessagesData: NotificationsMessageData[];
  eventAdvertisementModalMessage: EventAdvertisementPanelMessageData | null;
  motdModalMessage: MOTDMessageData | null;
  seenMOTD: string | null;
}

const initialState: NotificationsState = {
  eventAdvertisementPanelMessagesData: [],
  motdMessagesData: [],
  notificationsMessagesData: [],
  eventAdvertisementModalMessage: null,
  motdModalMessage: null,
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
    addNotificationsMessageData: (state: NotificationsState, action: PayloadAction<NotificationsMessageData>) => {
      const index = state.notificationsMessagesData.findIndex((message) => message.id === action.payload.id);
      if (index === -1) {
        state.notificationsMessagesData.unshift(action.payload);
      } else {
        state.notificationsMessagesData[index] = action.payload;
      }
    },
    removeEventAdvertisementPanelMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      state.eventAdvertisementPanelMessagesData = state.eventAdvertisementPanelMessagesData.filter(
        (message) => message.id !== action.payload
      );
    },
    removeMOTDMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      state.motdMessagesData = state.motdMessagesData.filter((message) => message.id !== action.payload);
    },
    removeNotificationsMessageData: (state: NotificationsState, action: PayloadAction<string>) => {
      state.notificationsMessagesData = state.notificationsMessagesData.filter(
        (message) => message.id !== action.payload
      );
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
    setSeenMOTD: (state: NotificationsState, action: PayloadAction<string>) => {
      state.seenMOTD = action.payload;
    }
  }
});

export const {
  addEventAdvertisementPanelMessageData,
  addMOTDMessageData,
  addNotificationsMessageData,
  removeEventAdvertisementPanelMessageData,
  removeMOTDMessageData,
  removeNotificationsMessageData,
  setEventAdvertisementPanelModalMessage,
  setMOTDModalMessage,
  setSeenMOTD
} = notificationsSlice.actions;
