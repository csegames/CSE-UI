/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ZonesState {
  zones: Dictionary<ZoneInfo>;
}

function buildDefaultZonesState() {
  const DefaultZonesState: ZonesState = {
    zones: {}
  };

  return DefaultZonesState;
}

export const zonesSlice = createSlice({
  name: 'zones',
  initialState: buildDefaultZonesState(),
  reducers: {
    updateZones: (state: ZonesState, action: PayloadAction<Dictionary<ZoneInfo>>) => {
      state.zones = action.payload ?? {};
    }
  }
});

export const { updateZones } = zonesSlice.actions;
