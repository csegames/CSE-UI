/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';

import { OptionsState } from './optionsState';
import { CSEChat } from '@csegames/camelot-unchained/lib/chat/CSEChat';

export interface Room extends RoomInfo {
  joined: boolean;
  shortcut: string[];
  messageCounter: number;
}

export interface RoomsState {
  shortcuts: Dictionary<string>; // maps shortcut key to room id. (/w => active warband chat)
  rooms: Dictionary<Room>;

  getColor: (info: RoomInfo, opts: OptionsState) => string;
  getCustomColor: (id: string) => string;
  getCustomShortcuts: (id: string) => string[];
  getRoomIDFromShortcut: (shortcut: string) => string;
  getMessages: (roomID: string, startIndex: number, endIndex: number) => ChatMessage[];
}

function initialState(opts: OptionsState): RoomsState {
  const shortcuts = {};

  // active warband shortcut
  opts.shortcutPrefixes.warband.forEach(s => shortcuts[s] = 'active-warband');
  opts.shortcutPrefixes.order.forEach(s => shortcuts[s] = 'order');

  return {
    shortcuts,
    rooms: {},
    getColor,
    getCustomColor,
    getCustomShortcuts,
    getRoomIDFromShortcut,
    getMessages,
  };
}

const sharedState = {
  initialized: false,
  state: null as RoomsState,
  setters: [] as React.Dispatch<any>[],
  messages: {} as Dictionary<CircularArray<ChatMessage>>,
};

export function useRoomsState(opts: OptionsState, chat: CSEChat): [RoomsState, React.Dispatch<RoomsState>] {
  if (!sharedState.state) {
    sharedState.state = initialState(opts);
  }
  const [state, set] = React.useState(sharedState.state);

  React.useEffect(() => () => {
      sharedState.setters = sharedState.setters.filter(setter => setter !== set);
  },[]);

  React.useEffect(() => {
    if (sharedState.initialized) return;

    const handles = [] as EventHandle[];
    handles.push(chat.onChatMessage(msg => {
      if (!sharedState.messages[msg.targetID]) {
        sharedState.messages[msg.targetID] = new CircularArray<ChatMessage>(opts.messageBufferSize);
      }
      sharedState.messages[msg.targetID].push(msg);

      setState({
        ...sharedState.state,
        rooms: {
          ...sharedState.state.rooms,
          [msg.targetID]: {
            ...sharedState.state.rooms[msg.targetID],
            messageCounter: sharedState.state.rooms[msg.targetID].messageCounter + 1,
          }
        }
      })
    }));

    handles.push(chat.onDirectory(dir => {
      setState(directoryReceived(sharedState.state, dir, opts));
    }));

    return () => {
      handles.forEach(h => h.clear());
      sharedState.initialized = false;
    };
  }, []);

  if (!sharedState.setters.includes(set)) {
    sharedState.setters.push(set);
  }

  function setState(state: RoomsState) {
    sharedState.state = state;
    sharedState.setters.forEach(setter => setter(sharedState.state));
  }

  return [state, setState];
}


// Helper methods for initializing & updating state

export const GLOBAL = ['0000000000000000000001', '0000000000000000000002', '0000000000000000000003'];
export const PLAYER_HELP = ['0000000000000000000010', '0000000000000000000011', '0000000000000000000012'];
export const CUBE = ['0000000000000000000014', '0000000000000000000015', '0000000000000000000016'];

function getShortcut(info: RoomInfo, opts: OptionsState, indices: Dictionary<number>) {

  // first check if a custom shortcut has been assigned, if so we just use that
  let shortcut = getCustomShortcuts(info.roomID);
  if (shortcut) {
    return shortcut;
  }

  const category = getRoomCategory(info);
  switch (category) {
    case RoomInfo_RoomCategory.GENERAL:
      return [++indices['general'] + ''];
    case RoomInfo_RoomCategory.WARBAND: {
        let i = ++indices['warband'];
        return opts.shortcutPrefixes.warband.map(s => s + i);
      }
    case RoomInfo_RoomCategory.ORDER:{
        let i = ++indices['order'];
        return opts.shortcutPrefixes.order.map(s => s + i);
      }
    case RoomInfo_RoomCategory.CAMPAIGN:{
        let i = ++indices['campaign'];
        return opts.shortcutPrefixes.campaign.map(s => s + i);
      }
    case RoomInfo_RoomCategory.CUSTOM:{
        let i = ++indices['custom'];
        return opts.shortcutPrefixes.custom.map(s => s + i);
      }
    }
}

function getCustomShortcuts(id: string) {
  const stringVal = localStorage.getItem(`CSE_CHAT_Room_Shortcut_${id}`);
  if (!stringVal) return null;
  return tryParseJSON<string[]>(stringVal, false);
}

function getColor(info: RoomInfo, opts: OptionsState) {

  // first check if a custom shortcut has been assigned, if so we just use that
  let shortcut = getCustomColor(info.roomID);
  if (shortcut) {
    return shortcut;
  }

  const category = getRoomCategory(info);
  switch (category) {
    case RoomInfo_RoomCategory.GENERAL:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.general;
    case RoomInfo_RoomCategory.WARBAND:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.warband;
    case RoomInfo_RoomCategory.ORDER:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.order;
    case RoomInfo_RoomCategory.CAMPAIGN:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.campaign;
    case RoomInfo_RoomCategory.CUSTOM:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.general;
    }
}

function getCustomColor(id: string) {
  const stringVal = localStorage.getItem(`CSE_CHAT_Room_Color_${id}`);
  if (!stringVal) return null;
  return tryParseJSON<string>(stringVal, false);
}

function getRoomCategory(info: RoomInfo) {
  if (hasCategory(info.category, RoomInfo_RoomCategory.GENERAL)) {
    return RoomInfo_RoomCategory.GENERAL;
  } else if (hasCategory(info.category, RoomInfo_RoomCategory.WARBAND)) {
    return RoomInfo_RoomCategory.WARBAND;
  } else if (hasCategory(info.category, RoomInfo_RoomCategory.ORDER)) {
    return RoomInfo_RoomCategory.ORDER;
  } else if (hasCategory(info.category, RoomInfo_RoomCategory.CAMPAIGN)) {
    return RoomInfo_RoomCategory.CAMPAIGN;
  } else {
    return RoomInfo_RoomCategory.CUSTOM;
  }
}

function hasCategory(toCheck: RoomInfo_RoomCategory, hasCategory: RoomInfo_RoomCategory) {
  return (toCheck & hasCategory) != 0;
}

function getRoomIDFromShortcut(this: RoomsState, shortcut: string) {
  return this.shortcuts[shortcut.replace('/', '').trim()];
}

function getMessages(roomID: string, startIndex: number, endIndex: number): ChatMessage[] {
  const messages = sharedState.messages[roomID];
  if (!messages || startIndex > messages.length) return [];
  const result = [] as ChatMessage[];
  const current = startIndex;
  while (current <= endIndex || current < messages.length) {
    result.push(messages.get(current));
  }
  return result;
}

function directoryReceived(state: RoomsState, directory: RoomsDirectory, opts: OptionsState): RoomsState {
  // we got a new directory, so update our whole state
  const oldRooms = state.rooms;
  const rooms: Dictionary<Room> = {};
  const shortcuts = clone(state.shortcuts);
  const indices = {
    general: 0,
    warband: 0,
    order: 0,
    campaign: 0,
    custom: 0,
  };
  directory.rooms.forEach((r) => {
    const oldRoom = oldRooms[r.roomID] || {
      joined: false,
      messageCounter: 0,
    };
    const shortcut = getShortcut(r, opts, indices);
    rooms[r.roomID] = {
      ...r,
      joined: oldRoom.joined,
      shortcut,
      messageCounter: oldRoom.messageCounter,
    };
    shortcut.forEach(s => shortcuts[s] = r.roomID);
  });

  return {
    ...state,
    rooms,
    shortcuts,
  };
}
