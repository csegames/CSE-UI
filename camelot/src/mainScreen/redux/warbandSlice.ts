/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphQLActiveWarband, GroupMemberState } from '@csegames/library/dist/camelotunchained/graphql/schema';

interface WarbandState {
  id: string | null;
  members: (GroupMemberState | null)[];
}

const DefaultWarbandState: WarbandState = {
  id: null,
  members: []
};

export const warbandSlice = createSlice({
  name: 'warband',
  initialState: DefaultWarbandState,
  reducers: {
    joinWarband: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    updateWarband: (state, action: PayloadAction<Partial<GraphQLActiveWarband>>) => {
      state.id = action.payload.info?.id;
      state.members = action.payload.members ?? [];
    },
    leaveWarband: (state) => {
      state.id = null;
      state.members = [];
    },
    addWarbandMember: (state, action: PayloadAction<GroupMemberState>) => {
      if (state.members.every((member) => member.characterID !== action.payload.characterID)) {
        state.members.push(action.payload);
      }
    },
    updateWarbandMember: (state, action: PayloadAction<GroupMemberState>) => {
      const memberIndex = state.members.findIndex((member) => member.characterID === action.payload.characterID);
      if (memberIndex >= 0) {
        state.members[memberIndex] = action.payload;
      } else {
        state.members.push(action.payload);
      }
    },
    removeWarbandMember: (state, action: PayloadAction<string>) => {
      const memberIndex = state.members.findIndex((member) => member.characterID === action.payload);
      if (memberIndex >= 0) {
        state.members.splice(memberIndex, 1);
      }
    }
  }
});

export const { joinWarband, updateWarband, leaveWarband, addWarbandMember, updateWarbandMember, removeWarbandMember } =
  warbandSlice.actions;
