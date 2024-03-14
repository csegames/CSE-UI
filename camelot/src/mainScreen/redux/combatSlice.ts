/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CombatEvent } from '@csegames/library/dist/_baseGame/types/CombatEvent';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CombatEventsState {
  events: CombatEvent[];
}

const DefaultCombatEventsState: CombatEventsState = {
  events: []
};

export const combatSlice = createSlice({
  name: 'combat',
  initialState: DefaultCombatEventsState,
  reducers: {
    updateEvents: (state, action: PayloadAction<CombatEvent[]>) => {
      state.events = action.payload;
    }
  }
});

export const { updateEvents } = combatSlice.actions;
