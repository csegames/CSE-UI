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
    addPopUpAnnouncement: (state, action: PayloadAction<string>) => {
      state.popUpAnnouncements.push({
        id: genID(),
        isHidden: false,
        text: action.payload
      });
    },
    hidePopUpAnnouncement: (state, action: PayloadAction<string>) => {
      const popUpAnnouncement = state.popUpAnnouncements.find(
        (popUpAnnouncement) => popUpAnnouncement.id === action.payload
      );
      popUpAnnouncement.isHidden = true;
    },
    removePopUpAnnouncement: (state, action: PayloadAction<string>) => {
      const popUpAnnouncementIndex = state.popUpAnnouncements.findIndex(
        (popUpAnnouncement) => popUpAnnouncement.id === action.payload
      );
      state.popUpAnnouncements.splice(popUpAnnouncementIndex, 1);
    }
  }
});

export const { addPopUpAnnouncement, hidePopUpAnnouncement, removePopUpAnnouncement } = popUpAnnouncementsSlice.actions;
