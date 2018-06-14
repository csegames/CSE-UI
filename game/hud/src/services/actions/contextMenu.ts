/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events } from '@csegames/camelot-unchained';

import { getPlayerEntityID } from './player';

import {
  inviteToWarbandByName,
  hasActiveWarband,
  isEntityIDInWarband,
  getActiveWarbandID,
  quitWarband,
 } from './warband';

// BASIC MANAGEMENT

export const ACTIVATE_CONTEXT_MENU = 'activate-context-menu';
export const HIDE_CONTEXT_MENU = 'hide-context-menu';

export type MenuItem = {
  title: string;
  onSelected: () => void;
};

export function showContextMenu(items: MenuItem[], event: MouseEvent) {
  events.fire(ACTIVATE_CONTEXT_MENU, items, event);
}

export function onShowContextMenu(callback: (items: MenuItem[], event: MouseEvent) => void) {
  return events.on(ACTIVATE_CONTEXT_MENU, callback);
}

export function offShowContextMenu(handle: number) {
  events.off(handle);
}

export function hideContextMenu() {
  events.fire(HIDE_CONTEXT_MENU);
}

export function onHideContextMenu(callback: () => void) {
  return events.on(HIDE_CONTEXT_MENU, callback);
}

export function offHideContextMenu(handle: number) {
  events.off(handle);
}

// SPECIFIC CONTEXT MENUS

export type ContextMenuState = {
  id: string; // entity ID
  name: string; // character name
};

export function showFriendlyTargetContextMenu(state: ContextMenuState, event: MouseEvent) {
  // is friendly target self?
  if (getPlayerEntityID() === state.id) {
    showSelfContextMenu(state, event);
  } else {
    showContextMenu(getFriendlyTargetMenuItems(state), event);
  }
}

export function showSelfContextMenu(state: ContextMenuState, event: MouseEvent) {
  showContextMenu(getSelfMenuItems(state), event);
}

export function showEnemyTargetContextMenu(state: ContextMenuState, event: MouseEvent) {
  showContextMenu(getEnemyTargetMenuItems(state), event);
}

// CONTEXT MENU GENERATION

export function getSelfMenuItems({ id, name }: ContextMenuState) {
  const items: MenuItem[] = [
    {
      title: 'Invite to Trade',
      onSelected: () => alert('invite to trade'),
    },
  ];

  if (hasActiveWarband()) {
    items.push({
      title: 'Quit Warband',
      onSelected: quitWarband,
    });
  }

  return items;
}

export function getFriendlyTargetMenuItems({ id, name }: ContextMenuState) {
  const items: MenuItem[] = [
    {
      title: 'Invite to Trade',
      onSelected: () => alert('invite to trade'),
    },
  ];

  if (hasActiveWarband() && !isEntityIDInWarband(id)) {
    items.push({
      title: 'Invite to Warband',
      onSelected: () => inviteToWarbandByName(name, getActiveWarbandID()),
    });
  }

  if (!hasActiveWarband()) {
    items.push({
      title: 'Invite to Warband',
      onSelected: () => inviteToWarbandByName(name, ''),
    });
  }

  return items;
}

export function getEnemyTargetMenuItems({ id, name }: ContextMenuState) {
  const items: MenuItem[] = [
  ];
  return items;
}
