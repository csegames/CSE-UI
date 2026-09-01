/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Notification } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ServerMessagePurpose {
  Broadcast = 'broadcast',
  Maintenance = 'maintenance',
  Outage = 'outage'
}

export const ServerMessagePurposePriority: Record<ServerMessagePurpose, number> = {
  [ServerMessagePurpose.Maintenance]: 0,
  [ServerMessagePurpose.Broadcast]: 1,
  [ServerMessagePurpose.Outage]: 2
};

const AllBasicServerMessagePurposes = [
  ServerMessagePurpose.Broadcast,
  ServerMessagePurpose.Maintenance,
  ServerMessagePurpose.Outage
];
export type AnyBasicServerMessagePurpose =
  | typeof ServerMessagePurpose.Broadcast
  | typeof ServerMessagePurpose.Maintenance
  | typeof ServerMessagePurpose.Outage;

export interface BasicServerMessage extends Notification {
  content: string;
  displayTime: string;
  mimeType: 'text/plain';
  purpose: AnyBasicServerMessagePurpose;
  sequenceID: string;
}

export function isBasicServerMessage(message: Notification): message is BasicServerMessage {
  // Has all the basic fields.
  if (!('content' in message) || message.content === null) return false;
  if (!('displayTime' in message) || message.displayTime === null) return false;
  if (!('mimeType' in message) || message.mimeType !== 'text/plain') return false;
  if (
    !('purpose' in message) ||
    message.purpose === null ||
    !AllBasicServerMessagePurposes.includes(message.purpose as ServerMessagePurpose)
  )
    return false;
  if (!('sequenceID' in message) || message.sequenceID === null) return false;

  return true;
}

interface NotificationsState {
  serverMessages: BasicServerMessage[];
  isMessageListOpen: boolean;
  hasUnseenMessages: boolean;
}

const initialState: NotificationsState = {
  serverMessages: [],
  isMessageListOpen: false,
  hasUnseenMessages: false
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addServerMessage: (state: NotificationsState, action: PayloadAction<BasicServerMessage>) => {
      const index = state.serverMessages.findIndex((message) => message.sequenceID === action.payload.sequenceID);
      if (index === -1) {
        state.serverMessages.unshift(action.payload);
        // If this message is a new Outage-level message, force the server list to open and mark all messages as seen.
        if (action.payload.purpose === ServerMessagePurpose.Outage) {
          state.isMessageListOpen = true;
          state.hasUnseenMessages = false;
        }
      } else {
        state.serverMessages[index] = action.payload;
      }
    },
    removeServerMessage: (state: NotificationsState, action: PayloadAction<string>) => {
      state.serverMessages = state.serverMessages.filter((message) => message.sequenceID !== action.payload);
    },
    setShowServerMessageList: (state: NotificationsState, action: PayloadAction<boolean>) => {
      if (action.payload !== state.isMessageListOpen) {
        state.isMessageListOpen = action.payload;

        // When you open the list, messages are seen.
        if (action.payload) {
          state.hasUnseenMessages = false;
        }
      }
    }
  }
});

export const { addServerMessage, removeServerMessage, setShowServerMessageList } = notificationsSlice.actions;
