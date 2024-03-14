/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export interface StringTableState {
  stringTable: Dictionary<StringTableEntryDef>;
}

function generateDefaultStringTableState() {
  const defaultStringTableState: StringTableState = {
    stringTable: {}
  };
  return defaultStringTableState;
}

export const stringTableSlice = createSlice({
  name: 'stringTable',
  initialState: generateDefaultStringTableState(),
  reducers: {
    updateStringTable: (state: StringTableState, action: PayloadAction<Dictionary<StringTableEntryDef>>) => {
      state.stringTable = action.payload;
    }
  }
});

export const { updateStringTable } = stringTableSlice.actions;
