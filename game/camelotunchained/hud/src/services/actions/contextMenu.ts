/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getPlayerEntityID } from './player';

import {
  inviteToWarbandByName,
  quitWarband,
  kickFromWarbandByEntityID,
} from './warband';
import { inviteToTrade } from './trade';
import {
  hasActiveBattlegroup,
  isEntityIDInBattlegroup,
  // inviteToBattlegroupByName,
  getActiveBattlegroupID,
  getBattlegroupMemberByCharacterID,
  kickFromBattlegroupByEntityID,
  quitBattlegroup,
} from './battlegroups';
import { WarbandContextState } from 'components/context/WarbandContext';

// BASIC MANAGEMENT

export const ACTIVATE_CONTEXT_MENU = 'activate-context-menu';
export const ACTIVATE_CONTEXT_MENU_CONTENT = 'active-context-menu-content';
export const HIDE_CONTEXT_MENU = 'hide-context-menu';

export type MenuItem = {
  title: string;
  onSelected: () => void;
};

export function showContextMenu(items: MenuItem[], event: React.MouseEvent, hasCustomOverlay?: boolean) {
  if (items.length) game.trigger(ACTIVATE_CONTEXT_MENU, items, event, hasCustomOverlay);
}

export function onShowContextMenu(callback: (items: MenuItem[], e: React.MouseEvent, hasCustomOverlay?: boolean) => void) {
  return game.on(ACTIVATE_CONTEXT_MENU, callback);
}

export function offShowContextMenu(handle: number) {
  game.off(handle);
}

// Show context menu content
export function showContextMenuContent(content: JSX.Element, event: React.MouseEvent, hasCustomOverlay?: boolean) {
  if (content) game.trigger(ACTIVATE_CONTEXT_MENU_CONTENT, content, event, hasCustomOverlay);
}

export function onShowContextMenuContent(callback: (content: JSX.Element,
                                                    e: React.MouseEvent,
                                                    hasCustomOverlay: boolean) => void) {
  return game.on(ACTIVATE_CONTEXT_MENU_CONTENT, callback);
}

export function offShowContextMenuContent(handle: number) {
  game.off(handle);
}

export function hideContextMenu() {
  game.trigger(HIDE_CONTEXT_MENU);
}

export function onHideContextMenu(callback: () => void) {
  return game.on(HIDE_CONTEXT_MENU, callback);
}

export function offHideContextMenu(handle: number) {
  game.off(handle);
}

// SPECIFIC CONTEXT MENUS

export function showFriendlyTargetContextMenu(
  state: Entity,
  warbandContext: WarbandContextState,
  event: React.MouseEvent,
) {
  // is friendly target self?
  const id = (state as GroupMemberState).entityID;
  if (getPlayerEntityID() === id) {
    showSelfContextMenu(state, warbandContext, event);
  } else {
    showContextMenu(getFriendlyTargetMenuItems(state, warbandContext), event);
  }
}

export function showSelfContextMenu(
  state: Entity,
  warbandContext: WarbandContextState,
  event: React.MouseEvent,
) {
  showContextMenu(getSelfMenuItems(state, warbandContext), event);
}

export function showEnemyTargetContextMenu(
  state: Entity,
  event: React.MouseEvent,
) {
  showContextMenu(getEnemyTargetMenuItems(state), event);
}

// CONTEXT MENU GENERATION

export function getSelfMenuItems(
  state: Entity,
  warbandContext: WarbandContextState,
) {
  const items: MenuItem[] = [
  ];

  const hasActiveWarband = warbandContext.activeWarbandID;
  if (hasActiveWarband) {
    items.push({
      title: 'Quit Warband',
      onSelected: () => quitWarband(warbandContext.activeWarbandID, warbandContext.refetch),
    });
  }

  if (hasActiveBattlegroup()) {
    items.push({
      title: 'Quit Battlegroup',
      onSelected: quitBattlegroup,
    });
  }

  return items;
}

export function getFriendlyTargetMenuItems(
  state: Entity,
  warbandContext: WarbandContextState,
) {
  if ((state as PlayerStateModel).type !== 'player') {
    return [];
  }

  // PLAYER actions
  const entityId = (state as PlayerStateModel).entityID;
  const items: MenuItem[] = [
    { title: 'Invite to Trade', onSelected: () => inviteToTrade(entityId) },
  ];

  const myWarbandInfo = warbandContext.memberCharacterIdToMemberState[camelotunchained.game.selfPlayerState.characterID];
  const targetCharacterId = warbandContext.memberEntityIdToCharacterId[entityId];
  const targetWarbandInfo = targetCharacterId ? warbandContext.memberCharacterIdToMemberState[targetCharacterId] : null;

  const myBattlegroupInfo = getBattlegroupMemberByCharacterID(camelotunchained.game.selfPlayerState.characterID);
  if (warbandContext.activeWarbandID && !targetWarbandInfo && myWarbandInfo && myWarbandInfo.canInvite) {
    items.push({
      title: 'Invite to Warband',
      onSelected: () => inviteToWarbandByName(state.name, warbandContext.activeWarbandID),
    });
  }

  if (warbandContext.activeWarbandID && targetWarbandInfo && myWarbandInfo && myWarbandInfo.canKick) {
    items.push({
      title: 'Kick from Warband',
      onSelected: () => kickFromWarbandByEntityID(entityId, warbandContext.activeWarbandID, warbandContext.refetch),
    });

  }

  if (!warbandContext.activeWarbandID) {
    items.push({
      title: 'Invite to Warband',
      onSelected: () => inviteToWarbandByName(state.name, ''),
    });
  }

  if (!hasActiveBattlegroup() || (!isEntityIDInBattlegroup(entityId) && myBattlegroupInfo && myBattlegroupInfo.canInvite)) {
    // Disabled for now

    // items.push({
    //   title: 'Invite to Battlegroup',
    //   onSelected: () => inviteToBattlegroupByName(state.name, getActiveBattlegroupID()),
    // });
  }

  if (hasActiveBattlegroup() && isEntityIDInBattlegroup(entityId) && myBattlegroupInfo && myBattlegroupInfo.canKick) {
    items.push({
      title: 'Kick from Battlegroup',
      onSelected: () => kickFromBattlegroupByEntityID(entityId, getActiveBattlegroupID()),
    });
  }

  return items;
}

export function getEnemyTargetMenuItems(
  state: Entity,
) {
  const items: MenuItem[] = [
  ];
  return items;
}
