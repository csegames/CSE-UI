/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MailSnapshot,
  MailMessage
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/MailSnapshot';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../helpers/stringTableHelpers';

const StringIDMailNameKing = "MailNameKing";
const StringIDMailNameUnknown = "MailNameUnknown";

export interface MailState extends MailSnapshot {
}

export function resolveSenderName(
  message: MailMessage,
  stringTable: Record<string, StringTableEntryDef>
): string {
  if (message.sentFromKing) {
    return getStringTableValue(StringIDMailNameKing, stringTable);
  }
  if ((message.senderName?.length ?? 0) > 0) {
    return message.senderName!;
  }
  return getStringTableValue(StringIDMailNameUnknown, stringTable);
}

export const mailStateMockData: MailState = {
  messages: [
    {
      id: 1,
      sequenceNumber: 0,
      senderName: 'Kenneth Maul',
      sentFromKing: false,
      sentAt: Date.parse('2025-09-02'),
      wasRead: true,
      wasCollected: true,
      templateID: 1,
      attachmentIDs: [2621639, 23935788],
      money: 11.36,
      resolvedStringTokens: { Foo: "Bar" },
      participationEvents: []
    },
    {
      id: 2,
      sequenceNumber: 0,
      senderName: 'Drakul',
      sentFromKing: false,
      sentAt: Date.parse('2025-09-01'),
      wasRead: true,
      wasCollected: false,
      templateID: 1,
      attachmentIDs: [],
      money: 0,
      resolvedStringTokens: { Foo: "Bar" },
      participationEvents: []
    },
    {
      id: 3,
      sequenceNumber: 0,
      senderName: null,
      sentFromKing: true,
      sentAt: Date.parse('2025-08-31'),
      wasRead: false,
      wasCollected: false,
      templateID: 1,
      attachmentIDs: [],
      money: 1000,
      resolvedStringTokens: { Foo: "Bar" },
      participationEvents: []
    }
  ]
};

const DefaultMailState: MailState = {
  messages: []
};

export const mailSlice = createSlice({
  name: 'mail',
  initialState: DefaultMailState,
  reducers: {
    updateMailSnapshot: (state: MailState, action: PayloadAction<MailSnapshot>) => {
      state.messages = action.payload.messages;
    }
    // updateMailSearchValue: (state, action: PayloadAction<string>) => {
    //   state.searchValue = action.payload;
    // }
  }
});

export const {
  updateMailSnapshot
} = mailSlice.actions;
