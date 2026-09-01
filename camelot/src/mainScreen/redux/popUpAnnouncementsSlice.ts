/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PopUpAnnouncement {
  id: string;
  isHidden: boolean;
  text: string;
  color: string;
}

interface AState {
  popUpAnnouncements: PopUpAnnouncement[];
}

const DefaultAState: AState = {
  popUpAnnouncements: []
};

export const popUpAnnouncementsSlice = createSlice({
  name: 'popUpAnnouncements',
  initialState: DefaultAState,
  reducers: {
    addPopUpAnnouncement: (state, action: PayloadAction<[string, string]>) => {
      const [text, color] = action.payload;
      state.popUpAnnouncements.push({
        id: genID(),
        isHidden: false,
        text,
        color
      });
    },
    hidePopUpAnnouncement: (state, action: PayloadAction<string>) => {
      const popUpAnnouncement = state.popUpAnnouncements.find(
        (popUpAnnouncement) => popUpAnnouncement.id === action.payload
      );
      if (popUpAnnouncement) {
        popUpAnnouncement.isHidden = true;
      }
    },
    hidePopUpAnnouncements: (state) => {
      for (const popUpAnnouncement of state.popUpAnnouncements) {
        popUpAnnouncement.isHidden = true;
      }
    },
    removePopUpAnnouncement: (state, action: PayloadAction<string>) => {
      const popUpAnnouncementIndex = state.popUpAnnouncements.findIndex(
        (popUpAnnouncement) => popUpAnnouncement.id === action.payload
      );
      state.popUpAnnouncements.splice(popUpAnnouncementIndex, 1);
    }
  }
});

export const { addPopUpAnnouncement, hidePopUpAnnouncement, hidePopUpAnnouncements, removePopUpAnnouncement } =
  popUpAnnouncementsSlice.actions;
