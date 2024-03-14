/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { PlayerStatus } from '../components/overlays/MainMenu/testData';

export const StringIDGeneralYes = 'GeneralYes';
export const StringIDGeneralNo = 'GeneralNo';
export const StringIDGeneralOk = 'GeneralOk';
export const StringIDGeneralChange = 'GeneralChange';
export const StringIDGeneralCancel = 'GeneralCancel';
export const StringIDGeneralBack = 'GeneralBack';
export const StringIDGeneralApply = 'GeneralApply';
export const StringIDGeneralError = 'GeneralError';
export const StringIDGeneralContinue = 'GeneralContinue';
export const StringIDGeneralClose = 'GeneralClose';
export const StringIDGeneralDone = 'GeneralDone';
export const StringIDGeneralUnknownError = 'GeneralUnknownError';
export const StringIDGeneralUnderMaintenace = 'GeneralUnderMaintenance';
export const StringIDGeneralEquip = 'GeneralEquip';
export const StringIDGeneralClaim = 'GeneralClaim';
export const StringIDGeneralPurchase = 'GeneralPurchase';
export const StringIDGeneralUnlockedAt = 'GeneralUnlockedAt';
export const StringIDGeneralHide = 'GeneralHide';
export const StringIDGeneralSelect = 'GeneralSelect';
export const StringIDGeneralQty = 'GeneralQty';
export const StringIDGeneralXPProgress = 'GeneralXPProgress';
export const StringIDGeneralXP = 'GeneralXP';
export const StringIDGeneralBP = 'GeneralBP';
export const StringIDGeneralNew = 'GeneralNew';
export const StringIDGeneralAttacks = 'GeneralAttacks';
export const StringIDGeneralAbilities = 'GeneralAbilities';
export const StringIDGeneralSuccess = 'GeneralSuccess';
export const StringIDGeneralProcessing = 'GeneralProcessing';
const StringIDPlayerStatusOffline = 'PlayerStatusOffline';
const StringIDPlayerStatusOnline = 'PlayerStatusOnline';
const StringIDPlayerStatusAway = 'PlayerStatusAway';

export function getStringTableValue(entryID: string, stringTable: Dictionary<StringTableEntryDef>): string {
  if (!entryID) {
    console.error('Called getStringTableValue w/o a entryID');
    return '';
  }

  if (!stringTable) {
    console.error('Called getStringTableValue w/o a stringTable');
    return '';
  }

  const tableValue = stringTable[entryID];
  if (!tableValue) {
    console.error(`Failed to find string table entry with id ${entryID}`);
    return entryID;
  }

  return tableValue.value;
}

export function getTokenizedStringTableValue(
  entryID: string,
  stringTable: Dictionary<StringTableEntryDef>,
  tokens: Dictionary<string>
): string {
  let tableValue = getStringTableValue(entryID, stringTable);
  if (tokens) {
    for (const token in tokens) {
      tableValue = tableValue.split(`{${token}}`).join(tokens[token]);
    }
  }

  return tableValue;
}

export function getPlayerStatusString(
  playerStatus: PlayerStatus,
  stringTable: Dictionary<StringTableEntryDef>
): string {
  switch (playerStatus) {
    case PlayerStatus.Offline:
      return getStringTableValue(StringIDPlayerStatusOffline, stringTable);
    case PlayerStatus.Online:
      return getStringTableValue(StringIDPlayerStatusOnline, stringTable);
    case PlayerStatus.Away:
      return getStringTableValue(StringIDPlayerStatusAway, stringTable);
  }

  console.error(`Failed to find string entry for player status ${playerStatus}`);
  return playerStatus;
}
