/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { storeLocalStore } from '../localStorage/storeLocalStorage';
import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { currentFormatVersion, updateBlockedList } from '../redux/localStorageSlice';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { decodeID128, encodeID128 } from '@csegames/library/dist/_baseGame/utils/accountUtils';

export function toRuntime(stored: string): string {
  return encodeID128(new Uint8Array(Buffer.from(stored, 'base64')));
}

export function toStorage(runtime: string): string {
  return Buffer.from(decodeID128(runtime)).toString('base64');
}

export class LocalStorageSource extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    const decodedBlockedList = storeLocalStore.getTextChatBlocks();
    this.dispatch(updateBlockedList(decodedBlockedList));
    return;
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    if (
      this.reduxState.localStorage?.update?.accountIDs?.length === null ||
      this.reduxState.localStorage?.update?.toBeMuted === null
    ) {
      return;
    }

    // Get our currently locally stored list. Get our new mutes/un-mutes and add those to a searchable set.
    let listToMute: string[] = storeLocalStore.getTextChatBlocks().base64AccountIDs;
    const newIDs: Set<string> = new Set<string>();
    this.reduxState.localStorage.update.accountIDs.forEach((accountID) => {
      const base64accountID = toStorage(accountID);
      newIDs.add(base64accountID);
    });
    // if we want to add them to the list, check if our current list already has them and remove them from the
    // set to be added, then append those left to the end of the existing list.
    if (this.reduxState.localStorage.update.toBeMuted) {
      listToMute.forEach((base64accountID) => {
        if (newIDs.has(base64accountID)) {
          newIDs.delete(base64accountID);
        }
      });
      newIDs.forEach((base64accountID) => {
        listToMute.push(base64accountID);
      });
    }
    // if we want to remove them from the list, create a clean list and loop through the current list
    // and skip adding them to the new one if they are in our removals list
    // then set our cleaned least to the old list to be stored locally.
    else {
      let cleanBlockedList: string[] = [];
      listToMute.forEach((base64accountID) => {
        if (newIDs.has(base64accountID)) {
          return;
        }
        cleanBlockedList.push(base64accountID);
      });
      listToMute = cleanBlockedList;
    }
    // send down our new list to the local store, and then get the new version and update redux
    // also clear out the list of IDs that were pending updates
    storeLocalStore.setTextChatBlocks({ base64AccountIDs: listToMute, formatVersion: currentFormatVersion });
    dispatch(updateBlockedList(storeLocalStore.getTextChatBlocks()));
  }
}
