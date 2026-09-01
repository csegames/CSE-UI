/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// see UIPartySnapshot.h

export interface PartySnapshot {
  groupID: string;
  members: PartyMember[];
}

export interface PartyMember {
  characterID: string;
  entityID: string;
  classID: number;
  gender: number;
  race: number;
  isLeader: boolean;
  isOnline: boolean;
  name: string;
}
