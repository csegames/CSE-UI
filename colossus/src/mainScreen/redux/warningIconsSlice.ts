/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WarningIconsModel } from '@csegames/library/dist/_baseGame/types/WarningIcons';

function buildDefaultWarningIcons() {
  const DefaultWarningIconsState: WarningIconsModel = {
    icons: []
  };
  return DefaultWarningIconsState;
}

export const warningIconsSlice = createSlice({
  name: 'warningIcons',
  initialState: buildDefaultWarningIcons(),
  reducers: {
    updateWarningIcons: (state: WarningIconsModel, action: PayloadAction<WarningIconsModel>) => {
      return action.payload;
    }
  }
});

export const { updateWarningIcons } = warningIconsSlice.actions;
