/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as chat_proto from '@csegames/library/dist/_baseGame/chat/chat_proto';
import { tryParseJSON } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { TimedMessage } from '@csegames/library/dist/_baseGame/chat/CSEChat';
import { CircularArray } from '@csegames/library/dist/_baseGame/types/CircularArray';
import { useChat } from '../components/views/Hud/Chat/state/chat';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { game } from '@csegames/library/dist/_baseGame';

const SENT_HISTORY_LENGTH = 20;

// BEGIN INTERFACES AND STATES

type IRoomInfo = chat_proto.chat.IRoomInfo;
type RoomCategory = chat_proto.chat.RoomInfo.RoomCategory;
const RoomCategory = chat_proto.chat.RoomInfo.RoomCategory;
type RoomDirectory = chat_proto.chat.RoomDirectory;
type RoomJoined = chat_proto.chat.RoomJoined;

export interface TabState {
  id: string;
  name: string;
  activeFilter: string; // active room shortcut for this tab
  filter: {
    local: boolean;
    system: boolean;
    combat: boolean;
    rooms: string[]; // ids of rooms shown in this tab
  };
  allowChat: () => boolean;
}

function allowChat(this: TabState) {
  return this.filter.local || this.filter.rooms.length > 0;
}

export interface ChatPaneState {
  id: string;
  activeTab: string;
  tabs: string[];
  position: {
    // values are in vmin units
    width: number;
    height: number;
    bottom: number;
    left: number;
  };
}

export interface RoomState extends IRoomInfo {
  color: string;
  joined: boolean;
  shortcuts: string[];
  messageCounter: number;
  messages: CircularArray<TimedMessage>;
}

export var currentChatTheme: ChatTheme | undefined;

type VARIABLE<T> = {
  hd: T;
  uhd: T;
};

export type ImageSrc = VARIABLE<string>;

interface ChatTheme {
  chatline: {
    color: {
      timestamp: string;
      author: string;
      content: string;
      cseAuthor: string; // color CSE names differently
      dm: string; // color Direct Messages differently
    };
    fontFamily: string;
  };
  input: {
    color: string;
    fontFamily: string;
  };
  tab: {
    activeOrnament: ImageSrc;
    fontFamily: string;
  };
  pane: {
    style: VARIABLE<{
      background: string;
    }>;
  };
}

export interface ChatOptionsState {
  messageBufferSize: number;
  parsing: {
    colors: boolean;
    emoji: boolean;
    markdown: boolean;
    embed: {
      gif: boolean;
      image: boolean;
      video: boolean;
      links: boolean;
      urlWhitelist: string[];
      _urlWhitelistRegExp: RegExp[];
    };
    highlight: boolean;
    highlightKeywords: string[];
  };
  markup: {
    timestamps: boolean;
    roomNames: boolean;
  };
  showJoins: boolean;
  showParts: boolean;
  roomColors: {
    warband: string;
    order: string;
    campaign: string;
    general: string;
    combat: string;
    system: string;
    custom: Dictionary<string>; // roomid => color
  };
}

export interface ChatState {
  options: ChatOptionsState;
  panes: { [id: string]: ChatPaneState };
  tabs: { [id: string]: TabState };
  shortcuts: { [shortcut: string]: string }; // maps shortcut key to room id. (/w => active warband chat)
  rooms: { [id: string]: RoomState };
  systemMessages: TimedMessage[];
  dmSenderNames: string[];
  theme: ChatTheme;

  sentMessageCounter: number;
  sentMessages: CircularArray<string>;
}

interface ActiveTabUpdate {
  paneID: string;
  tabID: string;
}

// These are some default roomIDs that are reserved by the system for particular types of messages.
// As such, they get assigned special shortcuts.
const DEFAULT_CHAT_ROOM_ID = '0000000000000000000001';
const GLOBAL = [DEFAULT_CHAT_ROOM_ID, '0000000000000000000002', '0000000000000000000003'];
const PLAYER_HELP = ['0000000000000000000010', '0000000000000000000011', '0000000000000000000012'];
const CUBE = ['0000000000000000000014', '0000000000000000000015', '0000000000000000000016'];

// These are some default shortcuts for a few RoomCategories.
const defaultShortcutPrefixes = {
  warband: ['w', 'p'],
  order: ['o', 'g'],
  campaign: ['c'],
  custom: ['k'],
  help: ['h']
};

// We assign default shortcuts based on a room's RoomCategory, but multiple rooms
// may have the same category.  We resolve this by adding a number (index) to the
// shortcuts for all rooms in a category beyond the first.  E.g. the first Party
// room gets `/p`, the second Party room gets `/p1`, then `/p2`, etc.
interface ShortcutIndices {
  general: number;
  warband: number;
  order: number;
  campaign: number;
  custom: number;
  global: number;
  help: number;
  cube: number;
}
let indices: ShortcutIndices;
function resetShortcutIndices() {
  indices = {
    general: 0,
    warband: 0,
    order: 0,
    campaign: 0,
    custom: 0,
    global: 0,
    help: 0,
    cube: 0
  };
}

function generateShortcuts(info: IRoomInfo) {
  // If there is a user-designated override, use that.
  let shortcuts = getCustomShortcuts(info.roomID);
  if (shortcuts) {
    return shortcuts;
  }

  if (GLOBAL.includes(info.roomID)) {
    let i = indices['global']++;
    return i === 0 ? ['g', 'global'] : ['g' + i, 'global' + i];
  }

  if (PLAYER_HELP.includes(info.roomID)) {
    let i = indices['help']++;
    return i === 0 ? ['h', 'help'] : ['h' + i, 'help' + i];
  }

  if (CUBE.includes(info.roomID)) {
    let i = indices['cube']++;
    return i === 0 ? ['c', 'cube'] : ['c' + i, 'cube' + i];
  }

  switch (info.category) {
    case RoomCategory.GENERAL:
      // Just converting numbers to strings.  So these shortcuts are /0, /1, /2, etc.
      return [indices['general']++ + ''];
    case RoomCategory.WARBAND: {
      let i = indices['warband']++;
      return defaultShortcutPrefixes.warband.map((s) => (i === 0 ? s : s + i));
    }
    case RoomCategory.ORDER: {
      let i = indices['order']++;
      return defaultShortcutPrefixes.order.map((s) => (i === 0 ? s : s + i));
    }
    case RoomCategory.CAMPAIGN: {
      let i = indices['campaign']++;
      return defaultShortcutPrefixes.campaign.map((s) => (i === 0 ? s : s + i));
    }
    case RoomCategory.CUSTOM: {
      let i = indices['custom']++;
      return defaultShortcutPrefixes.custom.map((s) => (i === 0 ? s : s + i));
    }
  }
}

function getCustomShortcuts(roomID: string) {
  const stringVal = localStorage.getItem(`CSE_CHAT_Room_Shortcut_${roomID}`);
  if (!stringVal) {
    return null;
  }
  return tryParseJSON<string[]>(stringVal, false);
}

function getRoomColor(info: chat_proto.chat.IRoomInfo, opts: ChatOptionsState) {
  // First check if a custom color has been assigned.
  let color = getCustomColor(info.roomID);
  if (color) {
    return color;
  }

  switch (info.category) {
    case RoomCategory.GENERAL:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.general;
    case RoomCategory.WARBAND:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.warband;
    case RoomCategory.ORDER:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.order;
    case RoomCategory.CAMPAIGN:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.campaign;
    case RoomCategory.CUSTOM:
      return opts.roomColors.custom[info.roomID] || opts.roomColors.general;
  }
}

function getCustomColor(roomID: string) {
  const stringVal = localStorage.getItem(`CSE_CHAT_Room_Color_${roomID}`);
  if (!stringVal) return null;
  return tryParseJSON<string>(stringVal, false);
}

function generateDefaultChatState() {
  const defaultChatState: ChatState = {
    options: {
      messageBufferSize: 100,
      parsing: {
        colors: true,
        emoji: true,
        markdown: true,
        embed: {
          gif: true,
          image: true,
          video: true,
          links: true,
          urlWhitelist: [
            's3.amazonaws.com',
            'camelotunchained.com',
            'citystateentertainment.com',
            'twimg.com',
            'fbcdn.net',
            'imgur.com',
            'trillian.im',
            'imageshack.com',
            'postimage.org',
            'staticflickr.com',
            'tinypic.com',
            'photobucket.com',
            'cdninstagram.com',
            'deviantart.net',
            'imagebam.com',
            'dropboxusercontent.com',
            'youtube.com',
            'vimeo.com',
            'twitch.tv'
          ],
          _urlWhitelistRegExp: [] as RegExp[]
        },
        highlight: true,
        highlightKeywords: ['CSE']
      },
      markup: {
        timestamps: false,
        roomNames: false
      },
      showJoins: false,
      showParts: false,
      roomColors: {
        warband: 'orange',
        order: 'green',
        campaign: 'darkgreen',
        general: 'white',
        combat: 'white',
        system: 'white',
        custom: {}
      }
    },
    panes: {
      default: {
        id: 'default',
        activeTab: 'default',
        tabs: ['default'],
        position: {
          // values are in vmin units
          width: 38,
          height: 23.15,
          bottom: 24.8,
          left: 3
        }
      }
    },
    tabs: {
      default: {
        id: 'default',
        name: 'Default',
        activeFilter: DEFAULT_CHAT_ROOM_ID,
        filter: {
          local: true,
          system: true,
          combat: true,
          rooms: [DEFAULT_CHAT_ROOM_ID]
        },
        allowChat
      }
    },
    theme: {
      chatline: {
        color: {
          timestamp: '#999',
          author: 'cyan',
          content: '#fff',
          cseAuthor: 'yellow',
          dm: 'cyan'
        },
        fontFamily: 'Lato'
      },
      input: {
        color: 'white',
        fontFamily: 'Lato'
      },
      tab: {
        activeOrnament: {
          hd: '',
          uhd: ''
        },
        fontFamily: 'Lato'
      },
      pane: {
        style: {
          hd: {
            background: 'url(images/chat/hd/modal-bg.jpg)'
          },
          uhd: {
            background: 'url(images/chat/uhd/modal-bg.jpg)'
          }
        }
      }
    },
    shortcuts: {},
    rooms: {},
    systemMessages: [],
    dmSenderNames: [],

    sentMessageCounter: 0,
    sentMessages: new CircularArray<string>(SENT_HISTORY_LENGTH)
  };

  // Rather than maintaining both lists in this file, we just calculate the regex version on launch.
  const regexWhitelist = defaultChatState.options.parsing.embed.urlWhitelist.map((s) => new RegExp(`/${s}$/`));
  defaultChatState.options.parsing.embed._urlWhitelistRegExp = regexWhitelist;

  return defaultChatState;
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState: generateDefaultChatState(),
  reducers: {
    updateActiveTab: (state: ChatState, action: PayloadAction<ActiveTabUpdate>) => {
      const { paneID, tabID } = action.payload;
      const oldActiveTab = state.panes[paneID].activeTab;
      if (oldActiveTab !== tabID) {
        state.panes[paneID].activeTab = tabID;
      }
    },
    updateChatDirectory: (state: ChatState, action: PayloadAction<RoomDirectory>) => {
      // We receive a new chat directory only when CSEChat.connect() is run.
      // That happens when you change servers (by starting a new match), or
      // when your connection goes down and we revive it.

      // In order to support group chat persisting across multiple matches, we keep all old
      // rooms, even if they are not in the new dictionary.

      // Create or update the rooms themselves.
      action.payload.rooms.forEach((r) => {
        const oldRoom: RoomState = state.rooms[r.roomID] || {
          color: getRoomColor(r, state.options),
          joined: false,
          shortcuts: [],
          messageCounter: 0,
          messages: new CircularArray<TimedMessage>(state.options.messageBufferSize)
        };

        state.rooms[r.roomID] = {
          ...oldRoom,
          ...r
        };
      });

      // Generate shortcuts for all rooms.  Have to remake these from scratch to ensure
      // that old rooms and new rooms don't have index collisions.
      const newShortcuts: Dictionary<string> = {};
      resetShortcutIndices();
      Object.values(state.rooms).forEach((r) => {
        const newRoomShortcuts = generateShortcuts(r);
        state.rooms[r.roomID].shortcuts = newRoomShortcuts;
        newRoomShortcuts.forEach((s) => (newShortcuts[s] = r.roomID));
      });
      state.shortcuts = newShortcuts;

      // Wait until the next frame to join the new rooms so that Redux has enough time
      // to finish internally updating ChatState for this Dictionary first.
      setTimeout(() => {
        const chat = useChat(game);
        action.payload.rooms.forEach((r) => chat.joinRoom(r.roomID));
      }, 1);
    },
    updateJoinedRooms: (state: ChatState, action: PayloadAction<RoomJoined>) => {
      const { roomID } = action.payload;
      let joinChanged: boolean = false;
      if (state.rooms[roomID]) {
        if (!state.rooms[roomID].joined) {
          joinChanged = true;
        }
      } else {
        console.warn(`Joined Chat Room: ${roomID} that was not found in the Directory.`);
      }

      // For FSR, all rooms go into the 'default' tab.
      let filterChanged: boolean = false;
      if (state.tabs.default) {
        if (state.tabs.default.filter.rooms.indexOf(roomID) === -1) {
          filterChanged = true;
        }
      } else {
        console.warn('Unable to find ChatTab "default"');
      }

      if (joinChanged || filterChanged) {
        if (joinChanged) {
          state.rooms[roomID].joined = true;
        }

        if (filterChanged) {
          state.tabs.default.filter.rooms.push(roomID);
          state.tabs.default.activeFilter = state.tabs.default.filter.rooms[0];
        }
      }
    },
    updateChatReceived: (state: ChatState, action: PayloadAction<TimedMessage>) => {
      const message = action.payload;
      // Take for granted that any message received is a new message, so no need to diff.
      if (message.type === chat_proto.chat.ChatMessage.MessageTypes.Room) {
        if (state.rooms[message.targetID]) {
          // messageCounter is essentially our "dirty" flag, since adding things to `messages` isn't detected by Redux.
          state.rooms[message.targetID].messageCounter += 1;
          state.rooms[message.targetID].messages.push(message);
        } else {
          console.warn(`Received message for Room ${message.targetID}, but that room does not exist.`, message);
        }
      } else if (message.type === chat_proto.chat.ChatMessage.MessageTypes.Direct) {
        // FSR only has one "default" room, so all Direct Messages go into there.
        // messageCounter is essentially our "dirty" flag, since adding things to `messages` isn't detected by Redux.
        state.rooms[DEFAULT_CHAT_ROOM_ID].messageCounter += 1;
        state.rooms[DEFAULT_CHAT_ROOM_ID].messages.push(message);
      }
    },
    addDMSenderName: (state: ChatState, action: PayloadAction<string>) => {
      const senderName = action.payload;
      // Keep track of recent DM senders so we can /r at them.
      if (state.dmSenderNames[0] !== senderName) {
        state.dmSenderNames = [
          // Most recent DM sender goes at the front.
          senderName,
          // Each sender should only be in the list once, so we remove this sender if they were already in the list.
          ...state.dmSenderNames.filter((name) => {
            return name !== senderName;
          })
        ];
      }
    },
    updateSystemMessageReceived: (state: ChatState, action: PayloadAction<string>) => {
      const tMessage: TimedMessage = {
        type: chat_proto.chat.ChatMessage.MessageTypes.Announcement,
        content: action.payload,
        senderFlag: chat_proto.chat.ChatMessage.SenderFlag.CSE,
        when: new Date()
      };

      // Take for granted that any message received is a new message, so no need to diff.

      // This is essentially a manually-handled CircularArray.  Done this way because it is
      // cheaper and faster for Redux state updates.
      state.systemMessages.push(tMessage);
      const startIndex = state.systemMessages.length < state.options.messageBufferSize ? 0 : 1;
      state.systemMessages = state.systemMessages.slice(startIndex);
    },
    logChatMessageSent: (state: ChatState, action: PayloadAction<string>) => {
      // sentMessageCounter is essentially our "dirty" flag, since adding things to `sentMessages` isn't detected by Redux.
      state.sentMessageCounter += 1;
      state.sentMessages.push(action.payload);
    },
    clearChatHistory: (state: ChatState) => {
      state.sentMessageCounter = 0;
      state.sentMessages = new CircularArray<string>(SENT_HISTORY_LENGTH);
      state.systemMessages = [];
      if (state.rooms[DEFAULT_CHAT_ROOM_ID]) {
        state.rooms[DEFAULT_CHAT_ROOM_ID].messageCounter = 0;
        state.rooms[DEFAULT_CHAT_ROOM_ID].messages = new CircularArray<TimedMessage>(state.options.messageBufferSize);
      }
      state.dmSenderNames = [];
    }
  }
});

export const {
  updateActiveTab,
  updateChatDirectory,
  updateJoinedRooms,
  updateChatReceived,
  updateSystemMessageReceived,
  logChatMessageSent,
  addDMSenderName,
  clearChatHistory
} = chatSlice.actions;
