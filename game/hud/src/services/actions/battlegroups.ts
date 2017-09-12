/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultConfig } from '@csegames/camelot-unchained/lib/webAPI/config';
import { GroupsAPI } from '@csegames/camelot-unchained/lib/webAPI/definitions';
import { sendSystemMessage } from './system';
import { GroupMemberState } from 'gql/interfaces';

export interface BattlegroupState {
  id: string;
  membersMap: { [characterID: string]: GroupMemberState };
  membersEntityIDMap: { [entityID: string]: GroupMemberState };
}

// API CALLS

export async function createBattlegroup() {
  try {
    const res = await GroupsAPI.CreateBattlegroupV1(defaultConfig, game.shardID, game.selfPlayerState.characterID);
    if (res.ok) {
      sendSystemMessage('Battlegroup created successfully');
      return res;
    }

    sendSystemMessage('Failed to create Battlegroup.');
    console.error('Failed to create Battlegroup\n' + JSON.stringify(res.data));
  } catch (error) {
    console.error('Failed to create Battlegroup\n' + error);
  }
}

export async function disbandBattlegroup(groupID: string) {
  try {
    const res = await GroupsAPI.DisbandV1(defaultConfig, game.shardID, game.selfPlayerState.characterID, groupID);
    if (res.ok) {
      sendSystemMessage('Battlegroup disbanded successfully');
      return res;
    }

    sendSystemMessage('Failed to disband Battlegroup\n');
    console.error('Failed to disband Battlegroup\n' + JSON.stringify(res.data));
  } catch (error) {
    console.error('Failed to disband Battlegroup\n' + error);
  }
}

async function inviteToBattlegroup(characterID: string, characterName: string, battlegroupID: string) {
  try {
    const result = await GroupsAPI.InviteV1(
      defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      battlegroupID,
      characterID,
      characterName,
    );

    if (result.ok) {
      sendSystemMessage(`Battlegroup invite sent successfully!`);
      return result;
    }

    sendSystemMessage(`Failed to send Battlegroup invite.`);
    console.error('Failed to send Battlegroup invite.\n' + JSON.stringify(result.data));

  } catch (error) {
    // failed!!
    console.error('Failed to send Battlegroup invite.\n' + error);
  }
}

export function inviteToBattlegroupByID(characterID: string, battlegroupID: string) {
  return inviteToBattlegroup(characterID, '', battlegroupID);
}

export function inviteToBattlegroupByName(characterName: string, battlegroupID: string) {
  return inviteToBattlegroup('', characterName, battlegroupID);
}

async function kickFromBattlegroup(targetEntityID: string, targetCharacterID: string,
  targetName: string, battlegroupID: string) {
  try {
    const result = await GroupsAPI.KickV1(
      defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      battlegroupID,
      targetEntityID,
      targetCharacterID,
      targetName,
    );

    if (result.ok) {
      sendSystemMessage(`Kicked!`);
      return;
    }

    sendSystemMessage(`Failed to kick.`);
    console.error('Failed to kick.\n' + JSON.stringify(result.data));

  } catch (error) {
    // failed!!
    console.error('Failed to kick.\n' + error);
  }
}

export function kickFromBattlegroupByName(targetName: string, battlegroupID: string) {
  return kickFromBattlegroup('', '', targetName, battlegroupID);
}

export function kickFromBattlegroupByCharacterID(characterID: string, battlegroupID: string) {
  return kickFromBattlegroup('', characterID, '', battlegroupID);
}

export function kickFromBattlegroupByEntityID(entityID: string, battlegroupID: string) {
  return kickFromBattlegroup(entityID, '', '', battlegroupID);
}

// BATTLEGROUP STATE MANAGEMENT
function getStateObject(): BattlegroupState {
  if (!window['active-battlegroup']) {
    window['active-battlegroup'] = {
      id: null,
      membersMap: {},
      membersEntityIDMap: {},
    };
  }
  return window['active-battlegroup'];
}

export function hasActiveBattlegroup() {
  return !!getStateObject().id;
}

export function getActiveBattlegroupID() {
  return getStateObject().id;
}

export function getBattlegroupMemberByCharacterID(characterID: string) {
  return getStateObject().membersMap[characterID];
}

export function getBattlegroupMemberByEntityID(entityID: string) {
  return getStateObject().membersEntityIDMap[entityID];
}

export function setActiveBattlegroupID(id: string) {
  const stateObjectID = getStateObject().id;
  if (stateObjectID) {
    game.trigger('chat-leave-room', stateObjectID);
  }

  if (typeof id === 'string') {
    game.trigger('chat-show-room', id, 'Battlegroup');
  }
  getStateObject().id = id;
  getStateObject().membersMap = {};
  getStateObject().membersEntityIDMap = {};
}

export function onBattlegroupMemberUpdate(member: GroupMemberState) {
  getStateObject().membersMap[member.characterID] = member;
  if (member.entityID) {
    getStateObject().membersEntityIDMap[member.entityID] = member;
  }
}

export function onBattlegroupMemberRemoved(characterID: string) {
  const m = getStateObject().membersMap[characterID];
  if (m) {
    delete getStateObject().membersMap[characterID];
    delete getStateObject().membersEntityIDMap[m.entityID];
  }
}

export function isCharacterIDInBattlegroup(characterID: string) {
  return !!getStateObject().membersMap[characterID];
}

export function isEntityIDInBattlegroup(entityID: string) {
  return !!getStateObject().membersEntityIDMap[entityID];
}
