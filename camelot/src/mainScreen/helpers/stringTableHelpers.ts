/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';

export const StringIDGeneralYes = 'GeneralYes';
export const StringIDGeneralNo = 'GeneralNo';
export const StringIDGeneralOk = 'GeneralOk';
export const StringIDGeneralConfirm = 'GeneralConfirm';
export const StringIDGeneralCancel = 'GeneralCancel';
export const StringIDGeneralBack = 'GeneralBack';
export const StringIDGeneralLeave = 'GeneralLeave';
export const StringIDGeneralReturn = 'GeneralReturn';
export const StringIDGeneralApply = 'GeneralApply';
export const StringIDGeneralCommit = 'GeneralCommit';
export const StringIDGeneralError = 'GeneralError';
export const StringIDGeneralContinue = 'GeneralContinue';
export const StringIDGeneralNext = 'GeneralNext';
export const StringIDGeneralClose = 'GeneralClose';
export const StringIDGeneralDone = 'GeneralDone';
export const StringIDGeneralDelete = 'GeneralDelete';
export const StringIDGeneralDefault = 'GeneralDefault';
export const StringIDGeneralLoad = 'GeneralLoad';
export const StringIDGeneralSave = 'GeneralSave';
export const StringIDGeneralSaveAs = 'GeneralSaveAs';
export const StringIDGeneralSearch = 'GeneralSearch';
export const StringIDGeneralPlusPre = 'GeneralPlusPre';
export const StringIDGeneralPlusPost = 'GeneralPlusPost';
export const StringIDGeneralMinusPre = 'GeneralMinusPre';
export const StringIDGeneralMinusPost = 'GeneralMinusPost';
export const StringIDGeneralPercent = 'GeneralPercent';
export const StringIDGeneralColon = 'GeneralColon';
export const StringIDGeneralFraction = 'GeneralFraction';
export const StringIDGeneralPlus = 'GeneralPlus';
export const StringIDGeneralHyphen = 'GeneralHyphen';
export const StringIDGeneralBar = 'GeneralBar';
export const StringIDGeneralComma = 'GeneralComma';
export const StringIDGeneralParenthesis = 'GeneralParenthesis';
export const StringIDGeneralUnknownFaction = 'GeneralUnknownFaction';
export const StringIDGeneralUnknownClass = 'GeneralUnknownClass';
export const StringIDGeneralUnknownRace = 'GeneralUnknownRace';
export const StringIDGeneralDistanceInMeters = 'GeneralDistanceInMeters';
export const StringIDGeneralTimeInSeconds = 'GeneralTimeInSeconds';
export const StringIDGeneralAmount = `GeneralAmount`;
export const StringIDGeneralPage = `GeneralPage`;
export const StringIDGeneralCollect = 'GeneralCollect';
export const StringIDGeneralAny = 'GeneralAny';
export const StringIDGeneralFinished = 'GeneralFinished';
export const StringIDGeneralComplete = 'GeneralComplete';
export const StringIDGeneralAccept = 'GeneralAccept';
export const StringIDGeneralReject = 'GeneralReject';
export const StringIDGeneralAttention = 'GeneralAttention';
export const StringIDGeneralUnnamed = 'GeneralUnnamed';
export const StringIDGeneralOnline = 'GeneralOnline';
export const StringIDGeneralOffline = 'GeneralOffline';
export const StringIDGeneralDiscard = 'GeneralDiscard';
export const StringIDGeneralNetworkError = 'GeneralNetworkError';
export const StringIDGeneralComingSoon = 'GeneralComingSoon';
export const StringIDGeneralDaysRemaining = 'GeneralDaysRemaining';
export const StringIDGeneralHoursRemaining = 'GeneralHoursRemaining';
export const StringIDGeneralMinutesRemaining = 'GeneralMinutesRemaining';
export const StringIDGeneralWarning = 'GeneralWarning';
export const StringIDGeneralUnlock = 'GeneralUnlock';
export const StringIDGeneralUnlocked = 'GeneralUnlocked';
export const StringIDGeneralFilters = 'GeneralFilters';
export const StringIDGeneralSubmit = 'GeneralSubmit';
export const StringIDGeneralMax = 'GeneralMax';

const reported = new Set<string>();

export function getStringTableValue(entryID: string, stringTable: Record<string, StringTableEntryDef>): string {
  if (!entryID) {
    if (!reported.has('')) {
      console.error('Called getStringTableValue w/o a entryID');
      reported.add('');
    }
    return '';
  }

  if (!stringTable) {
    if (!reported.has('_')) {
      console.error('Called getStringTableValue w/o a stringTable');
      reported.add('_');
    }
    return '';
  }

  const tableValue = stringTable[entryID];
  if (!tableValue) {
    if (Object.keys(stringTable).length > 0) {
      if (!reported.has(entryID)) {
        console.error(`Failed to find string table entry with id ${entryID}`);
        reported.add(entryID);
      }
    }
    return entryID;
  }

  return tableValue.text;
}

export function getTokenizedStringTableValue(
  entryID: string,
  stringTable: Record<string, StringTableEntryDef>,
  tokens: Record<string, string>
): string {
  let tableValue = getStringTableValue(entryID, stringTable);

  return replaceStringTokens(tableValue, tokens);
}

export function replaceStringTokens<TStringCollection extends { [k: string]: number | string }>(
  input: string,
  tokens: TStringCollection
): string {
  let retVal = input;
  if (tokens) {
    for (const token in tokens) {
      var replacementValue = tokens[token];
      retVal = retVal.split(`{${token}}`).join(`${replacementValue}`);
    }
  }

  // For any remaining tokens, replace them with ???.
  return retVal.replace(/{.*?}/g, '???');
}
