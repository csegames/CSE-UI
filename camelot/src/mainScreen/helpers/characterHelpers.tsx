/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ContextMenuItem, CONTEXT_MENU_SEPARATOR } from '../redux/contextMenuSlice';
import { PartyState } from '../redux/partySlice';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAttention,
  StringIDGeneralCancel,
  StringIDGeneralConfirm,
  StringIDGeneralContinue
} from './stringTableHelpers';
import {
  callCreateInvitation,
  callKick,
  callLeave,
  callSetRank,
  callUpgradePartyToWarband
} from './rest/warbandsRestCalls';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { hideModal, ModalModel, ModalParams, showModal } from '../redux/modalsSlice';
import { PartyInviteDialog } from '../components/party/PartyInviteDialog';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { GroupPermission } from '@csegames/library/dist/_baseGame/types/GroupPermission';
import { callCreateGuildInvitation, callGuildKick, callLeaveGuild } from './rest/guildsRestCalls';
import { showConditionalWidget } from '../redux/hudSlice';
import { WIDGET_ID_GUILD } from '../components/guild/Guild';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import {
  AnyEntityStateModel,
  PlayerEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/camelotunchained/game/types/CharacterKind';

// String IDs
const StringIDUnitFrameContextUpgradeParty = 'UnitFrameContextUpgradeParty';
const StringIDUnitFrameContextLeaveParty = 'UnitFrameContextLeaveParty';
const StringIDUnitFrameContextLeaveWarband = 'UnitFrameContextLeaveWarband';
const StringIDUnitFrameContextInviteParty = 'UnitFrameContextInviteParty';
const StringIDUnitFrameContextKickParty = 'UnitFrameContextKickParty';
const StringIDUnitFrameContextPromoteParty = 'UnitFrameContextPromoteParty';
const StringIDUnitFrameContextInviteWarband = 'UnitFrameContextInviteWarband';
const StringIDUnitFrameContextKickWarband = 'UnitFrameContextKickWarband';
const StringIDUnitFrameContextPromoteWarbandLeader = 'UnitFrameContextPromoteWarbandLeader';
const StringIDUnitFrameContextPromoteWarbandDeputy = 'UnitFrameContextPromoteWarbandDeputy';
const StringIDUnitFrameContextDemoteWarbandDeputy = 'UnitFrameContextDemoteWarbandDeputy';
const StringIDUnitFrameContextInvitePlayersByName = 'UnitFrameContextInvitePlayersByName';
const StringIDUnitFrameContextInviteGuild = 'UnitFrameContextInviteGuild';
const StringIDUnitFrameContextKickGuild = 'UnitFrameContextKickGuild';
const StringIDUnitFrameContextLeaveGuild = 'UnitFrameContextLeaveGuild';
const StringIDUnitFrameContextOpenTrade = 'UnitFrameContextOpenTrade';
const StringIDGuildsNameNeeded = 'GuildsNameNeeded';
const StringIDGuildsConfirmLeave = 'GuildsConfirmLeave';
const StringIDGuildsConfirmKick = 'GuildsConfirmKick';

export function getUnitFrameContextMenuItems(
  party: PartyState,
  warband: WarbandSnapshot,
  stringTable: Record<string, StringTableEntryDef>,
  selfAccountID: string,
  selfCharacterID: string,
  selfFaction: Faction,
  selfGuildID: string,
  selfGuild: GuildSnapshot,
  // Much though I'd like to just pass in EntityStateModels, we have to cover some cases where
  // we need to display a context menu for entities that aren't in our local data.  By passing
  // in just the data that we DO have access to, we can still appropriately pick what to show.
  // The most common cases are when the target is offline or in a different zone.
  targetEntityID: EntityID,
  targetAccountID: string,
  targetCharacterID: string,
  targetGroupID: string,
  targetFaction: Faction,
  // If undefined, that means we don't know if the target is in a guild or not and cannot safely assume in either direction.
  targetGuildID?: string
): ContextMenuItem[] {
  // NPCs and enemies currently have no context-menu actions.
  if (!targetCharacterID || targetFaction !== selfFaction) {
    return [];
  }

  if (selfCharacterID === targetCharacterID) {
    return getSelfUnitFrameContextMenuItems(party, warband, selfGuild, stringTable, selfCharacterID);
  } else {
    return getOtherUnitFrameContextMenuItems(
      party,
      warband,
      stringTable,
      selfAccountID,
      selfCharacterID,
      selfGuildID,
      selfGuild,
      targetEntityID,
      targetAccountID,
      targetCharacterID,
      targetGroupID,
      targetGuildID
    );
  }
}

function getSelfUnitFrameContextMenuItems(
  party: PartyState,
  warband: WarbandSnapshot,
  selfGuild: GuildSnapshot,
  stringTable: Record<string, StringTableEntryDef>,
  selfCharacterID: string
): ContextMenuItem[] {
  const menuItems: ContextMenuItem[] = [];

  const isLeader = getIsCharacterLeader(selfCharacterID, party, warband);
  const isDeputy = getIsCharacterDeputy(selfCharacterID, party, warband);
  const isInParty = party.groupID?.length > 0;
  const isInWarband = warband.groupID?.length > 0;
  const isInGuild = selfGuild.groupID?.length > 0;

  if (isLeader && !isInWarband) {
    const item: ContextMenuItem = {
      title: getStringTableValue(StringIDUnitFrameContextUpgradeParty, stringTable),
      onClick: (dispatch) => dispatch(callUpgradePartyToWarband())
    };
    menuItems.push(item);
  }

  if (!isInParty || isLeader || isDeputy) {
    const item: ContextMenuItem = {
      title: getStringTableValue(StringIDUnitFrameContextInvitePlayersByName, stringTable),
      onClick: (dispatch) => {
        const model: ModalModel = {
          title: getStringTableValue(
            isInWarband ? StringIDUnitFrameContextInviteWarband : StringIDUnitFrameContextInviteParty,
            stringTable
          ),
          message: '',
          body: <PartyInviteDialog />,
          buttons: []
        };

        const params: ModalParams = {
          id: `WarbandSendInvites`,
          content: model,
          escapable: true
        };

        dispatch(showModal(params));
      }
    };
    menuItems.push(item);
  }

  if (isInParty) {
    const item: ContextMenuItem = {
      title: getStringTableValue(StringIDUnitFrameContextLeaveParty, stringTable),
      onClick: (dispatch) => dispatch(callLeave())
    };
    menuItems.push(item);
  } else if (isInWarband) {
    const item: ContextMenuItem = {
      title: getStringTableValue(StringIDUnitFrameContextLeaveWarband, stringTable),
      onClick: (dispatch) => dispatch(callLeave())
    };
    menuItems.push(item);
  }

  if (isInGuild) {
    if (menuItems.length > 0) {
      menuItems.push(CONTEXT_MENU_SEPARATOR);
    }
    const item: ContextMenuItem = {
      title: getStringTableValue(StringIDUnitFrameContextLeaveGuild, stringTable),
      onClick: (dispatch) => {
        const model: ModalModel = {
          title: getStringTableValue(StringIDGeneralAttention, stringTable),
          message: getTokenizedStringTableValue(StringIDGuildsConfirmLeave, stringTable, { GUILD: selfGuild.name }),
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, stringTable),
              onClick: () => {
                dispatch(hideModal());
              }
            },
            {
              text: getStringTableValue(StringIDGeneralConfirm, stringTable),
              onClick: () => {
                dispatch(hideModal());
                dispatch(callLeaveGuild());
              }
            }
          ]
        };

        const params: ModalParams = {
          id: `ConfirmLeaveGuild`,
          content: model,
          escapable: true
        };
        dispatch(showModal(params));
      }
    };
    menuItems.push(item);
  }

  return menuItems;
}

function getOtherUnitFrameContextMenuItems(
  party: PartyState,
  warband: WarbandSnapshot,
  stringTable: Record<string, StringTableEntryDef>,
  selfAccountID: string,
  selfCharacterID: string,
  selfGuildID: string,
  selfGuild: GuildSnapshot,
  targetEntityID: string,
  targetAccountID: string,
  targetCharacterID: string,
  targetGroupID: string,
  // If undefined, that means we don't know if the target is in a guild or not and cannot safely assume in either direction.
  targetGuildID?: string
): ContextMenuItem[] {
  const menuItems: ContextMenuItem[] = [];
  const guildItems: ContextMenuItem[] = [];

  const selfInParty = party.groupID?.length > 0;
  const targetInPartyOrWarband = targetGroupID?.length > 0;
  const inSameParty = selfInParty && party.groupID === targetGroupID;
  const selfInWarband = warband.groupID?.length > 0;
  const selfInGuild = selfGuildID.length > 0 && selfGuild.groupID === selfGuildID;
  const inSameWarband = selfInWarband && warband.groupID === targetGroupID;
  const selfIsLeader = getIsCharacterLeader(selfCharacterID, party, warband);
  const selfIsDeputy = getIsCharacterDeputy(selfCharacterID, party, warband);
  const targetIsLeader = getIsCharacterLeader(targetCharacterID, party, warband);
  const targetIsDeputy = getIsCharacterDeputy(targetCharacterID, party, warband);
  const targetIsInGuild = (targetGuildID?.length ?? 0) > 0;
  const inSameGuild = targetIsInGuild && targetGuildID === selfGuildID;

  const canInvite = !selfInParty || party.canInvite || selfIsLeader || selfIsDeputy;
  const canKick = party.canKick || selfIsLeader || selfIsDeputy;
  const canPromote = party.canPromote || selfIsLeader;
  const canDemote = selfIsLeader && selfInWarband;

  // There is also a distance check on the server, but we don't have access to that data so we can't check it here.
  const canTradeInvite = targetEntityID?.length > 0;

  if (canTradeInvite) {
    menuItems.push({
      title: getStringTableValue(StringIDUnitFrameContextOpenTrade, stringTable),
      onClick: (dispatch) => {
        clientAPI.sendTradeInvite(targetEntityID);
      }
    });
  }

  const canGKick =
    targetGuildID !== undefined && // If we don't have a targetGuildID, then we don't KNOW if they are in a guild, so prevent all guild actions.
    selfAccountID !== targetAccountID && // Can't kick yourself!
    inSameGuild &&
    getDoesAccountHaveGuildPermission(selfAccountID, selfGuild, GroupPermission.Kick) &&
    !getIsAccountGuildMaster(targetAccountID, selfGuild); // No one can kick the Guild Master.
  const canGInvite =
    targetGuildID !== undefined && // If we don't have a targetGuildID, then we don't KNOW if they are in a guild, so prevent all guild actions.
    selfAccountID !== targetAccountID && // Can't invite yourself!
    !targetIsInGuild &&
    (!selfInGuild || getDoesAccountHaveGuildPermission(selfAccountID, selfGuild, GroupPermission.Invite));

  // Target is not in a party, so they are a valid target for invitation.
  if (!targetInPartyOrWarband && canInvite && targetCharacterID) {
    if (!selfInWarband) {
      menuItems.push({
        title: getStringTableValue(StringIDUnitFrameContextInviteParty, stringTable),
        onClick: (dispatch) => dispatch(callCreateInvitation(targetCharacterID))
      });
    } else {
      menuItems.push({
        title: getStringTableValue(StringIDUnitFrameContextInviteWarband, stringTable),
        onClick: (dispatch) => dispatch(callCreateInvitation(targetCharacterID))
      });
    }
  }

  // A player cannot kick themself, and no one can kick the leader.
  if (canKick && !targetIsLeader) {
    if (inSameParty) {
      // In a party, only the leader has kick permissions, and they can kick everyone except themself.
      menuItems.push({
        title: getStringTableValue(StringIDUnitFrameContextKickParty, stringTable),
        onClick: (dispatch) => dispatch(callKick(targetCharacterID))
      });
    } else if (inSameWarband) {
      // In a warband, the leader can kick anyone but themself, and deputies can kick anyone but the leader.
      menuItems.push({
        title: getStringTableValue(StringIDUnitFrameContextKickWarband, stringTable),
        onClick: (dispatch) => dispatch(callKick(targetCharacterID))
      });
    }
  }

  if (canPromote) {
    if (inSameParty) {
      menuItems.push({
        title: getStringTableValue(StringIDUnitFrameContextPromoteParty, stringTable),
        onClick: (dispatch) => dispatch(callSetRank({ targetID: targetCharacterID, targetRank: 'Leader' }))
      });
    } else if (inSameWarband) {
      menuItems.push({
        title: getStringTableValue(StringIDUnitFrameContextPromoteWarbandLeader, stringTable),
        onClick: (dispatch) => dispatch(callSetRank({ targetID: targetCharacterID, targetRank: 'Leader' }))
      });

      if (!targetIsDeputy) {
        menuItems.push({
          title: getStringTableValue(StringIDUnitFrameContextPromoteWarbandDeputy, stringTable),
          onClick: (dispatch) => dispatch(callSetRank({ targetID: targetCharacterID, targetRank: 'Deputy' }))
        });
      }
    }
  }

  if (canDemote && targetIsDeputy) {
    menuItems.push({
      title: getStringTableValue(StringIDUnitFrameContextDemoteWarbandDeputy, stringTable),
      onClick: (dispatch) => dispatch(callSetRank({ targetID: targetCharacterID, targetRank: 'Member' }))
    });
  }

  if (canGInvite) {
    guildItems.push({
      title: getStringTableValue(StringIDUnitFrameContextInviteGuild, stringTable),
      onClick: (dispatch) => {
        if (selfInGuild && selfGuild.name.length <= 0) {
          const content: ModalModel = {
            title: getStringTableValue(StringIDGeneralAttention, stringTable),
            message: getStringTableValue(StringIDGuildsNameNeeded, stringTable),
            buttons: [
              { text: getStringTableValue(StringIDGeneralCancel, stringTable), onClick: () => dispatch(hideModal()) },
              {
                text: getStringTableValue(StringIDGeneralContinue, stringTable),
                onClick: () => {
                  dispatch(hideModal());
                  // Make sure the Guild UI is shown.  It will force a guild rename.
                  dispatch(showConditionalWidget(WIDGET_ID_GUILD));
                }
              }
            ]
          };
          dispatch(showModal({ id: `GuildNameNeeded`, content, maxWidth: '35vmin' }));
        } else {
          dispatch(callCreateGuildInvitation(targetAccountID));
        }
      },
      disabled: (targetAccountID?.length ?? 0) <= 0
    });
  }
  if (canGKick) {
    guildItems.push({
      title: getStringTableValue(StringIDUnitFrameContextKickGuild, stringTable),
      onClick: (dispatch) => {
        const model: ModalModel = {
          title: getStringTableValue(StringIDGeneralAttention, stringTable),
          message: getTokenizedStringTableValue(StringIDGuildsConfirmKick, stringTable, { NAME: selfGuild.name }),
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, stringTable),
              onClick: () => {
                dispatch(hideModal());
              }
            },
            {
              text: getStringTableValue(StringIDGeneralConfirm, stringTable),
              onClick: () => {
                dispatch(hideModal());
                dispatch(callGuildKick(targetAccountID));
              }
            }
          ]
        };

        const params: ModalParams = {
          id: `ConfirmGuildKick`,
          content: model,
          escapable: true,
          maxWidth: '40vmin'
        };
        dispatch(showModal(params));
      },
      disabled: (targetAccountID?.length ?? 0) <= 0
    });
  }

  if (guildItems.length > 0) {
    if (menuItems.length > 0) {
      menuItems.push(CONTEXT_MENU_SEPARATOR);
    }
    menuItems.push(...guildItems);
  }

  return menuItems;
}

export function getIsCharacterLeader(characterID: string, party: PartyState, warband: WarbandSnapshot): boolean {
  // Party leader?
  if (party.groupID?.length > 0) {
    const partyMember = party.members.find((pm) => pm.characterID === characterID);
    if (partyMember?.isLeader) {
      return true;
    }
  }

  // Warband leader?
  if (warband.groupID?.length > 0) {
    const isWarbandLeader = warband.subgroups.some((subgroup) => {
      return subgroup.members.some((member) => {
        return member.isLeader && member.characterID === characterID;
      });
    });
    if (isWarbandLeader) {
      return true;
    }
  }

  return false;
}

export function getIsCharacterDeputy(characterID: string, party: PartyState, warband: WarbandSnapshot): boolean {
  if (warband.groupID?.length > 0) {
    const isWarbandDeputy = warband.subgroups.some((subgroup) => {
      return subgroup.members.some((member) => {
        return member.isDeputy && member.characterID === characterID;
      });
    });
    if (isWarbandDeputy) {
      return true;
    }
  }

  return false;
}

export function getDoesAccountHaveGuildPermission(
  accountID: string,
  guild: GuildSnapshot,
  perm: GroupPermission
): boolean {
  const member = guild.members.find((m) => m.accountID === accountID);
  const rank = guild.ranks[member?.rank ?? -1];
  return (rank?.permissions & perm) === perm;
}

export function getIsAccountGuildMaster(accountID: string, guild: GuildSnapshot): boolean {
  const gm = guild.members.find((member) => member.rank === guild.ranks.length - 1);
  return !!gm && gm.accountID === accountID;
}

export function getIsEntityNPC(entity: AnyEntityStateModel | undefined): boolean {
  return entity != null && (entity as PlayerEntityStateModel).characterKind !== CharacterKind.User;
}
