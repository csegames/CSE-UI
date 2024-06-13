/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { chat } from '@csegames/library/dist/_baseGame/chat/chat_proto';
import { tryParseJSON } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { TimedMessage } from '@csegames/library/dist/_baseGame/chat/CSEChat';
import { CircularArray } from '@csegames/library/dist/_baseGame/types/CircularArray';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const SENT_HISTORY_LENGTH = 20;

// BEGIN INTERFACES AND STATES

type IRoomInfo = chat.IRoomInfo;
type RoomCategory = chat.RoomInfo.RoomCategory;
const RoomCategory = chat.RoomInfo.RoomCategory;

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

export interface MessageParsingRequest {
  fromFilter: string;
  content: string;
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
      cseAuthor: string; // color UCE names differently
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
  incomingText: MessageParsingRequest[];
  options: ChatOptionsState;
  panes: { [id: string]: ChatPaneState };
  tabs: { [id: string]: TabState };
  rooms: { [id: string]: RoomState };
  systemMessages: TimedMessage[];
  dmSenderNames: string[];
  theme: ChatTheme;
  receivedMessageCounter: number;
  sentMessageCounter: number;
  sentMessages: CircularArray<string>;
}

interface ActiveTabUpdate {
  paneID: string;
  tabID: string;
}

export const DEFAULT_CHAT_ROOM_ID = '0000000000000000000001';

export interface ChatParseRequest {
  sentFromRoomID: string;
  content: string;
}

function getRoomColor(info: chat.IRoomInfo, opts: ChatOptionsState) {
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

function generateDefaultOptions(): ChatOptionsState {
  return {
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
      highlightKeywords: ['UCE']
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
  };
}

function generateDefaultPanes(): { [id: string]: ChatPaneState } {
  return {
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
  };
}

function generateDefaultTabs(): { [id: string]: TabState } {
  return {
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
  };
}

function generateDefaultTheme(): ChatTheme {
  return {
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
  };
}

function generateDefaultChatState() {
  const defaultChatState: ChatState = {
    incomingText: [],
    options: generateDefaultOptions(),
    panes: generateDefaultPanes(),
    tabs: generateDefaultTabs(),
    theme: generateDefaultTheme(),
    rooms: {},
    systemMessages: [],
    dmSenderNames: [],
    receivedMessageCounter: 0,
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
    updateActiveTab: (state, action: PayloadAction<ActiveTabUpdate>) => {
      const { paneID, tabID } = action.payload;
      const oldActiveTab = state.panes[paneID].activeTab;
      if (oldActiveTab !== tabID) {
        state.panes[paneID].activeTab = tabID;
      }
    },
    updateChatRooms: (state, action: PayloadAction<Dictionary<RoomState>>) => {
      for (const id in action.payload) {
        const room = action.payload[id];
        room.color = getRoomColor(room, state.options);
      }
      state.rooms = action.payload;
    },
    updateJoinedRooms: (state, action: PayloadAction<chat.RoomJoined>) => {
      const room = state.rooms[action.payload.roomID];
      if (!room) {
        console.warn(`Joined Chat Room: ${action.payload.roomID} that was not found in the Directory.`);
        return;
      }
      room.joined = true;
    },
    updateChatReceived: (state, action: PayloadAction<TimedMessage>) => {
      const message = action.payload;
      var roomID = message.targetID;
      switch (message.type) {
        case chat.ChatMessage.MessageTypes.Error:
        case chat.ChatMessage.MessageTypes.Direct:
          return;
        case chat.ChatMessage.MessageTypes.Room:
          break;
        case chat.ChatMessage.MessageTypes.Announcement:
          // FSR only has one "default" room, so all Direct Messages go into there.
          roomID = DEFAULT_CHAT_ROOM_ID;
          break;
      }
      // messageCounters are essentially our "dirty" flag, since adding things to `messages` isn't detected by Redux.
      if (state.rooms[roomID]) {
        state.rooms[roomID].messageCounter += 1;
        state.rooms[roomID].messages.push(message);
        state.receivedMessageCounter += 1;
      }
    },
    addDMSenderName: (state, action: PayloadAction<string>) => {
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
    updateSystemMessageReceived: (state, action: PayloadAction<string>) => {
      const tMessage: TimedMessage = {
        type: chat.ChatMessage.MessageTypes.Announcement,
        content: action.payload,
        senderFlag: chat.ChatMessage.SenderFlag.CSE,
        when: new Date()
      };

      // This is essentially a manually-handled CircularArray.  Done this way because it is
      // cheaper and faster for Redux state updates.
      state.systemMessages.push(tMessage);
      const startIndex = state.systemMessages.length < state.options.messageBufferSize ? 0 : 1;
      state.systemMessages = state.systemMessages.slice(startIndex);
      state.receivedMessageCounter += 1;
    },
    parseChatRequest: (state, action: PayloadAction<MessageParsingRequest>) => {
      state.incomingText.push(action.payload);
    },
    clearChatRequests: (state) => {
      state.incomingText = [];
    },
    logChatMessageSent: (state, action: PayloadAction<string>) => {
      // sentMessageCounter is essentially our "dirty" flag, since adding things to `sentMessages` isn't detected by Redux.
      state.sentMessageCounter += 1;
      state.sentMessages.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.receivedMessageCounter = 0;
      state.sentMessageCounter = 0;
      state.sentMessages = new CircularArray<string>(SENT_HISTORY_LENGTH);
      state.systemMessages = [];
      state.tabs.default.activeFilter = null;
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
  updateChatRooms,
  updateJoinedRooms,
  updateChatReceived,
  updateSystemMessageReceived,
  logChatMessageSent,
  parseChatRequest,
  clearChatRequests,
  addDMSenderName,
  clearChatHistory
} = chatSlice.actions;
