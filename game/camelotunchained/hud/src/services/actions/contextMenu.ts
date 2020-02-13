/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getPlayerEntityID } from './player';

import {
  inviteToWarbandByName,
  hasActiveWarband,
  isEntityIDInWarband,
  getActiveWarbandID,
  quitWarband,
  kickFromWarbandByEntityID,
  getWarbandMemberByCharacterID,
} from './warband';
import { inviteToTrade } from './trade';
import {
  hasActiveBattlegroup,
  isEntityIDInBattlegroup,
  inviteToBattlegroupByName,
  getActiveBattlegroupID,
  getBattlegroupMemberByCharacterID,
  kickFromBattlegroupByEntityID,
  quitBattlegroup,
} from './battlegroups';

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
  event: React.MouseEvent,
) {
  // is friendly target self?
  const id = (state as GroupMemberState).entityID;
  if (getPlayerEntityID() === id) {
    showSelfContextMenu(state, event);
  } else {
    showContextMenu(getFriendlyTargetMenuItems(state), event);
  }
}

export function showSelfContextMenu(
  state: Entity,
  event: React.MouseEvent,
) {
  showContextMenu(getSelfMenuItems(state), event);
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
) {
  const items: MenuItem[] = [
  ];

  if (hasActiveWarband()) {
    items.push({
      title: 'Quit Warband',
      onSelected: quitWarband,
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
) {
  if ((state as PlayerStateModel).type !== 'player') {
    return [];
  }

  // PLAYER actions
  const id = (state as any).entityID;
  const items: MenuItem[] = [
    { title: 'Invite to Trade', onSelected: () => inviteToTrade(id) },
  ];

  const myWarbandInfo = getWarbandMemberByCharacterID(camelotunchained.game.selfPlayerState.characterID);
  const myBattlegroupInfo = getBattlegroupMemberByCharacterID(camelotunchained.game.selfPlayerState.characterID);
  if (hasActiveWarband() && !isEntityIDInWarband(id) && myWarbandInfo && myWarbandInfo.canInvite) {
    items.push({
      title: 'Invite to Warband',
      onSelected: () => inviteToWarbandByName(state.name, getActiveWarbandID()),
    });
  }

  if (hasActiveWarband() && isEntityIDInWarband(id) && myWarbandInfo && myWarbandInfo.canKick) {
    items.push({
      title: 'Kick from Warband',
      onSelected: () => kickFromWarbandByEntityID(id, getActiveWarbandID()),
    });

  }

  if (!hasActiveWarband()) {
    items.push({
      title: 'Invite to Warband',
      onSelected: () => inviteToWarbandByName(state.name, ''),
    });
  }

  if (!hasActiveBattlegroup() || (!isEntityIDInBattlegroup(id) && myBattlegroupInfo && myBattlegroupInfo.canInvite)) {
    items.push({
      title: 'Invite to Battlegroup',
      onSelected: () => inviteToBattlegroupByName(state.name, getActiveBattlegroupID()),
    });
  }

  if (hasActiveBattlegroup() && isEntityIDInBattlegroup(id) && myBattlegroupInfo && myBattlegroupInfo.canKick) {
    items.push({
      title: 'Kick from Battlegroup',
      onSelected: () => kickFromBattlegroupByEntityID(id, getActiveBattlegroupID()),
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
