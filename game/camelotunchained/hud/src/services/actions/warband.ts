/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultConfig } from '@csegames/library/lib/camelotunchained/webAPI/config';
import { GroupsAPI } from '@csegames/library/lib/camelotunchained/webAPI/definitions';

import { sendSystemMessage } from './system';
import { GroupMemberState } from 'gql/interfaces';

export interface WarbandState {
  id: string;
  membersMap: { [characterID: string]: GroupMemberState };
  membersEntityIDMap: { [entityID: string]: GroupMemberState };
}

// API CALLS

async function inviteToWarband(characterID: string, characterName: string, warbandID: string) {
  try {
    const result = await GroupsAPI.InviteV1(
      defaultConfig,
      warbandID,
      characterID,
      characterName,
      GroupTypes.Warband,
    );

    if (result.ok) {
      sendSystemMessage(`Warband invite sent successfully!`);
      return result;
    }

    sendSystemMessage(`Failed to send Warband invite.`);
    console.error('Failed to send Warband invite.\n' + JSON.stringify(result.data));

  } catch (error) {
    // failed!!
    console.error('Failed to send Warband invite.\n' + error);
  }
}

export function inviteToWarbandByID(characterID: string, warbandID: string) {
  return inviteToWarband(characterID, '', warbandID);
}

export function inviteToWarbandByName(characterName: string, warbandID: string) {
  return inviteToWarband('', characterName, warbandID);
}

async function kickFromWarband(targetEntityID: string, targetCharacterID: string,
  targetName: string, warbandID: string, refetch?: () => void) {
  try {
    const result = await GroupsAPI.KickV1(
      defaultConfig,
      warbandID,
      targetEntityID,
      targetCharacterID,
      targetName,
    );

    if (result.ok) {
      sendSystemMessage(`Kicked!`);
      if (refetch) {
        refetch();
      }
      return;
    }

    sendSystemMessage(`Failed to kick.`);
    console.error('Failed to kick.\n' + JSON.stringify(result.data));

  } catch (error) {
    // failed!!
    console.error('Failed to kick.\n' + error);
  }
}

export function kickFromWarbandByName(targetName: string, warbandID: string) {
  return kickFromWarband('', '', targetName, warbandID);
}

export function kickFromWarbandByCharacterID(characterID: string, warbandID: string) {
  return kickFromWarband('', characterID, '', warbandID);
}

export function kickFromWarbandByEntityID(entityID: string, warbandID: string, refetch: () => void) {
  return kickFromWarband(entityID, '', '', warbandID, refetch);
}

export async function quitWarband(warbandId: string, refetch: () => void) {
  try {
    const result = await GroupsAPI.QuitV1(defaultConfig, warbandId);

    if (result.ok) {
      sendSystemMessage(`Warband quit!`);
      if (refetch) {
        refetch();
      }
      return;
    }

    sendSystemMessage(`Failed to quit Warband.`);
    console.error('Failed to quit Warband.\n' + JSON.stringify(result.data));

  } catch (error) {
    // failed!!
    console.error('Failed to quit Warband.\n' + error);
  }
}


// !!!! DEPRECATED !!!!
// Last thing that uses this is the BattlegroupWatchList. Everything else should be using the WarbandContext now.
// WARBAND STATE MANAGEMENT

function getStateObject(): WarbandState {
  if (!window['active-warband']) {
    window['active-warband'] = {
      id: null,
      membersMap: {},
      membersEntityIDMap: {},
    };
  }
  return window['active-warband'];
}

export function hasActiveWarband() {
  return !!getStateObject().id;
}

export function getActiveWarbandID() {
  return getStateObject().id;
}

export function getWarbandMemberByCharacterID(characterID: string) {
  console.log(getStateObject());
  return getStateObject().membersMap[characterID];
}

export function getWarbandMemberByEntityID(entityID: string) {
  return getStateObject().membersEntityIDMap[entityID];
}

export function setActiveWarbandID(id: string) {
  const stateObjectID = getStateObject().id;
  if (stateObjectID) {
    game.trigger('chat-leave-room', stateObjectID);
  }

  if (typeof id === 'string') {
    game.trigger('chat-show-room', id, 'Warband');
  }
  getStateObject().id = id;
  getStateObject().membersMap = {};
  getStateObject().membersEntityIDMap = {};
}

export function onWarbandMemberUpdate(member: GroupMemberState) {
  
}

export function onWarbandMemberRemoved(characterID: string) {
  const m = getStateObject().membersMap[characterID];
  if (m) {
    delete getStateObject().membersMap[characterID];
    delete getStateObject().membersEntityIDMap[m.entityID];
  }
}

export function isCharacterIDInWarband(characterID: string) {
  console.log('isCharacterIDInWarband');
  return !!getStateObject().membersMap[characterID];
}

export function isEntityIDInWarband(entityID: string) {
  console.log(getStateObject());
  console.log(getStateObject().membersEntityIDMap);
  return !!getStateObject().membersEntityIDMap[entityID];
}
