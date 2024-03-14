/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CombatEvent } from '@csegames/library/dist/_baseGame/types/CombatEvent';
import { chatCombatRoomID, chatGlobalRoomID, chatSystemRoomID } from '../dataSources/chatService';
import { Stanza } from 'node-xmpp-client';

export interface ChatOptions {
  shouldEmbedImages: boolean;
  shouldEmbedVideos: boolean;
  shouldShowColors: boolean;
  shouldShowEmoticons: boolean;
  shouldShowJoinsAndParts: boolean;
  shouldShowMarkdown: boolean;
  shouldShowTimestamps: boolean;
}

export interface ChatRoomData {
  id: string;
  messages: ChatMessageData[];
}

export interface ChatMessageData {
  announcementText?: string;
  combatEvent?: CombatEvent;
  consoleText?: string;
  stanza?: Stanza;
  isSeen: boolean;
}

export interface ChatRoomSendData {
  contents: string;
  roomID: string;
}

interface ChatState {
  options: ChatOptions;
  rooms: ChatRoomData[];
  roomSends: ChatRoomSendData[];
}

const DefaultChatState: ChatState = {
  options: {
    shouldEmbedImages: true,
    shouldEmbedVideos: true,
    shouldShowColors: true,
    shouldShowEmoticons: true,
    shouldShowJoinsAndParts: true,
    shouldShowMarkdown: true,
    shouldShowTimestamps: false
  },
  rooms: [],
  roomSends: []
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState: DefaultChatState,
  reducers: {
    toggleEmbedImagesOption: (state) => {
      state.options.shouldEmbedImages = !state.options.shouldEmbedImages;
    },
    toggleEmbedVideosOption: (state) => {
      state.options.shouldEmbedVideos = !state.options.shouldEmbedVideos;
    },
    toggleShowColorsOption: (state) => {
      state.options.shouldShowColors = !state.options.shouldShowColors;
    },
    toggleShowEmoticonsOption: (state) => {
      state.options.shouldShowEmoticons = !state.options.shouldShowEmoticons;
    },
    toggleShowJoinsAndPartsOption: (state) => {
      state.options.shouldShowJoinsAndParts = !state.options.shouldShowJoinsAndParts;
    },
    toggleShowMarkdownOption: (state) => {
      state.options.shouldShowMarkdown = !state.options.shouldShowMarkdown;
    },
    toggleShowTimestampsOption: (state) => {
      state.options.shouldShowTimestamps = !state.options.shouldShowTimestamps;
    },
    joinRoom: (state, action: PayloadAction<string>) => {
      const roomID = action.payload;
      state.rooms.push({
        id: roomID,
        messages: []
      });
    },
    readRoom: (state, action: PayloadAction<string>) => {
      const roomID = action.payload;
      state.rooms = state.rooms.map((room) =>
        room.id === roomID
          ? {
              ...room,
              messages: room.messages.map((message) => ({ ...message, isSeen: true }))
            }
          : room
      );
    },
    sendToRoom: (state, action: PayloadAction<ChatRoomSendData>) => {
      state.roomSends.push(action.payload);
    },
    clearRoomSends: (state) => {
      state.roomSends = [];
    },
    receiveCombatEvent: (state, action: PayloadAction<CombatEvent>) => {
      const combatEvent = action.payload;
      const rooms = [...state.rooms];
      if (!rooms.some((room) => room.id === chatCombatRoomID)) {
        rooms.push({
          id: chatCombatRoomID,
          messages: []
        });
      }
      state.rooms = rooms.map((room) => {
        if (room.id === chatCombatRoomID) {
          const messages = [...room.messages];
          messages.push({ combatEvent, isSeen: false });
          return {
            ...room,
            messages
          };
        }
        return room;
      });
    },
    receiveConsoleText: (state, action: PayloadAction<string>) => {
      const consoleText = action.payload;
      const rooms = [...state.rooms];
      if (!rooms.some((room) => room.id === chatSystemRoomID)) {
        rooms.push({
          id: chatSystemRoomID,
          messages: []
        });
      }
      state.rooms = rooms.map((room) => {
        if (room.id === chatSystemRoomID) {
          return {
            ...room,
            messages: [...room.messages, { consoleText, isSeen: false }]
          };
        }
        return room;
      });
    },
    receiveAnnouncementText: (state, action: PayloadAction<string>) => {
      const announcementText = action.payload;
      const rooms = [...state.rooms];
      if (!rooms.some((room) => room.id === chatSystemRoomID)) {
        rooms.push({
          id: chatSystemRoomID,
          messages: []
        });
      }
      state.rooms = rooms.map((room) => {
        if (room.id === chatSystemRoomID) {
          return {
            ...room,
            messages: [...room.messages, { announcementText, isSeen: false }]
          };
        }
        return room;
      });
    },
    receiveStanza: (state, action: PayloadAction<Stanza>) => {
      const stanza = action.payload;
      state.rooms = state.rooms.map((room) => {
        if (room.id === chatGlobalRoomID) {
          return {
            ...room,
            messages: [...room.messages, { stanza, isSeen: false }]
          };
        }
        return room;
      });
    }
  }
});

export const {
  toggleEmbedImagesOption,
  toggleEmbedVideosOption,
  toggleShowColorsOption,
  toggleShowEmoticonsOption,
  toggleShowJoinsAndPartsOption,
  toggleShowMarkdownOption,
  toggleShowTimestampsOption,
  joinRoom,
  readRoom,
  sendToRoom,
  clearRoomSends,
  receiveCombatEvent,
  receiveConsoleText,
  receiveAnnouncementText,
  receiveStanza
} = chatSlice.actions;
