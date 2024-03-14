/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { IInteractiveAlert } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface InteractiveAlert {
  data: IInteractiveAlert;
  id: string;
  isHidden: boolean;
}

interface AState {
  interactiveAlerts: InteractiveAlert[];
}

const DefaultAState: AState = {
  interactiveAlerts: []
};

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState: DefaultAState,
  reducers: {
    addInteractiveAlert: (state, action: PayloadAction<IInteractiveAlert>) => {
      state.interactiveAlerts.push({
        data: action.payload,
        id: genID(),
        isHidden: false
      });
    },
    hideInteractiveAlert: (state, action: PayloadAction<string>) => {
      const interactiveAlert = state.interactiveAlerts.find(
        (interactiveAlert) => interactiveAlert.id === action.payload
      );
      interactiveAlert.isHidden = true;
    },
    removeInteractiveAlert: (state, action: PayloadAction<string>) => {
      const interactiveAlertIndex = state.interactiveAlerts.findIndex(
        (interactiveAlert) => interactiveAlert.id === action.payload
      );
      state.interactiveAlerts.splice(interactiveAlertIndex, 1);
    }
  }
});

export const { addInteractiveAlert, hideInteractiveAlert, removeInteractiveAlert } = alertsSlice.actions;
