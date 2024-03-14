/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import { toRuntime } from '../dataSources/localStorageDataSource';

// Current version of encoding to check in case future versions require special handling.
export var currentFormatVersion: number = 1;

export interface MutedPlayerData {
  base64AccountIDs: string[];
  formatVersion: number;
}

export interface AccountIDsToMutePayload {
  accountIDs: string[];
  toBeMuted: boolean;
}

export interface LocalStorageState {
  blockedList: Dictionary<number>;
  update: AccountIDsToMutePayload;
}

function buildDefaultLocalStorageState() {
  const DefaultLocalStorageState: LocalStorageState = {
    blockedList: {},
    update: { accountIDs: null, toBeMuted: null }
  };

  return DefaultLocalStorageState;
}

export const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: buildDefaultLocalStorageState(),
  reducers: {
    updateBlockedList: (state: LocalStorageState, action: PayloadAction<MutedPlayerData>) => {
      const blockedList: Dictionary<number> = {};
      action.payload.base64AccountIDs.forEach((base64AccountID) => {
        const encodedAccountID = toRuntime(base64AccountID);
        if (!encodedAccountID) {
          console.error('failed to encode base64AccountID:', base64AccountID);
          return;
        }
        blockedList[encodedAccountID] = action.payload.formatVersion;
      });
      state.blockedList = blockedList;
      state.update = { accountIDs: null, toBeMuted: null };
    },
    updateAccountIDsToMute: (state: LocalStorageState, action: PayloadAction<AccountIDsToMutePayload>) => {
      state.update = {
        accountIDs: action.payload.accountIDs,
        toBeMuted: action.payload.toBeMuted
      };
    },
    clearAccountIDsToUpdate: (state: LocalStorageState) => {
      state.update = { accountIDs: null, toBeMuted: null };
    }
  }
});

export const { updateBlockedList, updateAccountIDsToMute, clearAccountIDsToUpdate } = localStorageSlice.actions;
