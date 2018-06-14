/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from '@csegames/camelot-unchained';
import { defaultConfig } from '@csegames/camelot-unchained/lib/webAPI/config';
import { GroupsAPI, GroupMemberState } from '@csegames/camelot-unchained/lib/webAPI/definitions';

import { sendSystemMessage } from './system';

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
      client.loginToken,
      client.shardID,
      client.characterID,
      warbandID,
      characterID,
      characterName,
    );

    if (result.ok) {
      sendSystemMessage(`Warband invite sent successfully!`);
      return;
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


export async function quitWarband() {
  try {
    const result = await GroupsAPI.QuitV1(
      defaultConfig,
      client.loginToken,
      client.shardID,
      client.characterID,
      getStateObject().id,
    );

    if (result.ok) {
      sendSystemMessage(`Warband quit!`);
      return;
    }

    sendSystemMessage(`Failed to quit Warband.`);
    console.error('Failed to quit Warband.\n' + JSON.stringify(result.data));

  } catch (error) {
    // failed!!
    console.error('Failed to quit Warband.\n' + error);
  }
}


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

export function setActiveWarbandID(id: string) {
  getStateObject().id = id;
  getStateObject().membersMap = {};
  getStateObject().membersEntityIDMap = {};
}

export function onWarbandMemberUpdate(member: GroupMemberState) {
  getStateObject().membersMap[member.id] = member;
  if (member.entityID) {
    getStateObject().membersEntityIDMap[member.entityID] = member;
  }
}

export function onWarbandMemberRemoved(characterID: string) {
  const m = getStateObject().membersMap[characterID];
  if (m) {
    delete getStateObject().membersMap[characterID];
    delete getStateObject().membersEntityIDMap[m.entityID];
  }
}

export function isCharacterIDInWarband(characterID: string) {
  return !!getStateObject().membersMap[characterID];
}

export function isEntityIDInWarband(entityID: string) {
  return !!getStateObject().membersEntityIDMap[entityID];
}
