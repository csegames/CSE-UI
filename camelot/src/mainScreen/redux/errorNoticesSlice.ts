/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ErrorNotice {
  id: string;
  isHidden: boolean;
  text: string;
}

interface AState {
  errorNotices: ErrorNotice[];
}

const DefaultAState: AState = {
  errorNotices: []
};

export const errorNoticesSlice = createSlice({
  name: 'errorNotices',
  initialState: DefaultAState,
  reducers: {
    addErrorNotice: (state, action: PayloadAction<string>) => {
      state.errorNotices.push({
        id: genID(),
        isHidden: false,
        text: action.payload
      });
    },
    hideErrorNotice: (state, action: PayloadAction<string>) => {
      const errorNotice = state.errorNotices.find((errorNotice) => errorNotice.id === action.payload);
      errorNotice.isHidden = true;
    },
    removeErrorNotice: (state, action: PayloadAction<string>) => {
      const errorNoticeIndex = state.errorNotices.findIndex((errorNotice) => errorNotice.id === action.payload);
      state.errorNotices.splice(errorNoticeIndex, 1);
    }
  }
});

export const { addErrorNotice, hideErrorNotice, removeErrorNotice } = errorNoticesSlice.actions;
