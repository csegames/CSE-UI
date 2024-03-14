/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * @TODO right now this file only handles dialogue.  In the future it should be updated to handle all announcements.
 */

import { AnnouncementType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum DialogueSoundState {
  PendingPlay,
  Playing,
  FinishedPlay
}

export interface DialogueEntry {
  messageID: number;
  soundID?: number; //not all dialogue (or announcements for that matter) have associated sounds.  Therefore this can be undefined.  --DM
  soundState: DialogueSoundState;
  speakerName: string;
  speakerIcon: string;
  text: string;
  type: AnnouncementType.Dialogue;
}

//type: AnnouncementType, dialogueText: string, speakerName: string, speakerIcon: string, soundID: number

export interface AnnouncementsState {
  dialogueQueue: DialogueEntry[];
}

const defaultAnnouncementsState: AnnouncementsState = {
  dialogueQueue: []
};

export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState: defaultAnnouncementsState,
  reducers: {
    addDialogueEntry: (state: AnnouncementsState, action: PayloadAction<DialogueEntry>) => {
      state.dialogueQueue.push(action.payload);
    },
    removeDialogueEntryWithID: (state: AnnouncementsState, action: PayloadAction<number>) => {
      state.dialogueQueue = state.dialogueQueue.filter((val) => val.messageID !== action.payload);
    },
    clearDialogueQueue: (state: AnnouncementsState) => {
      state.dialogueQueue = [];
    }
  }
});

export const { addDialogueEntry, removeDialogueEntryWithID, clearDialogueQueue } = announcementsSlice.actions;
