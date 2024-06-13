/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Store } from '@csegames/library/dist/_baseGame/utils/local-storage';

class LobbyLocalStore {
  private store = new Store('FSRLobby');

  public getHasClickedInvite(): boolean {
    return this.store.get(keyLobbyHasClickedInvite) ?? false;
  }

  public setHasClickedInvite(): void {
    this.store.set(keyLobbyHasClickedInvite, true);
  }

  public getSeenMOTDs(): string[] {
    return this.store.get(keyLobbySeenMOTDs) || [];
  }

  public setSeenMOTD(motd: string): void {
    // Add the new MOTD to the array
    const seenMOTDs = [motd, ...this.getSeenMOTDs()];
    // Cap the amount you can store
    const cap = 10;
    if (seenMOTDs.length > cap) {
      seenMOTDs.length = cap;
    }
    // Update
    this.store.set(keyLobbySeenMOTDs, seenMOTDs);
  }
}

export const lobbyLocalStore = new LobbyLocalStore();

// All valid keys for use with this local store should be defined here.

const keyLobbyHasClickedInvite = 'HasClickedInvite';
const keyLobbySeenMOTDs = 'SeenMOTDs';
