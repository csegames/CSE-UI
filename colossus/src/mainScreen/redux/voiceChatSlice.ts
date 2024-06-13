/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';
import { PlayerEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const VoiceChatIconStyle = 'VoiceChatIcon';

export function getSpeakingIcon(volume: number): string {
  if (volume < 0.25) {
    return 'fs-icon-misc-speaker1';
  } else if (volume < 0.5) {
    return 'fs-icon-misc-speaker2';
  } else if (volume < 0.75) {
    return 'fs-icon-misc-speaker3';
  } else {
    return 'fs-icon-misc-speaker4';
  }
}

export function getVoiceChatStyle(
  settings: VoiceChatMemberSettings,
  isNotHidden?: boolean
): [string, React.CSSProperties] {
  let icon = '';
  let color = 'black';
  let opacity = 1;

  switch (settings.status) {
    case VoiceChatMemberStatus.Disabled:
      icon = 'fs-icon-misc-speaker-mute';
      color = '#767676';
      break;

    case VoiceChatMemberStatus.Enabled:
      icon = 'fs-icon-misc-speaker1';
      color = 'white';
      break;

    case VoiceChatMemberStatus.Speaking:
      icon = getSpeakingIcon(settings.volume);
      color = '#00FF75';
      break;

    case VoiceChatMemberStatus.Muted:
      icon = 'fs-icon-misc-speaker-mute';
      color = '#FF514F';
      break;

    default:
      console.warn('Unexpected voice chat member status ' + settings.status);
      break;
  }
  if (!isNotHidden) {
    opacity = 0;
  }
  return [
    `${VoiceChatIconStyle} ${icon}`,
    {
      color: `${color}`,
      opacity: opacity
    }
  ];
}

// At this time, these names will match the entity name of the in game player
// but we want to leave the door open to having voice chat participants that do not have
// entities associated with this.  This means that this name might not match up with an entity long term.
// or maybe we'll come up with a different thing to identify these players
export interface VoiceChatReport {
  reason: string;
  message: string;
  email: string;
}

interface VoiceChatReportUpdate {
  accountID: string;
  report: VoiceChatReport;
}

export interface VoiceChatState {
  members: Dictionary<VoiceChatMemberSettings>;
  playerToReport: PlayerEntityStateModel;
  reports: Dictionary<VoiceChatReport>;
  mutedAll: boolean;
}

interface VoiceChatMemberUpdate {
  accountID: string;
  settings: VoiceChatMemberSettings;
}

const defaultVoiceChatState: VoiceChatState = {
  members: {},
  playerToReport: null,
  reports: {},
  mutedAll: false
};

export const voiceChatSlice = createSlice({
  name: 'voiceChat',
  initialState: defaultVoiceChatState,
  reducers: {
    updateVoiceChatMember: (state: VoiceChatState, action: PayloadAction<VoiceChatMemberUpdate>) => {
      state.members[action.payload.accountID] = action.payload.settings;
    },
    removeVoiceChatMember: (state: VoiceChatState, action: PayloadAction<string>) => {
      delete state.members[action.payload];
    },
    clearVoiceChatMembers: (state: VoiceChatState) => {
      // Only need a return because we are replacing the existing state.
      state.members = {};
    },
    updatePlayerToReport: (state: VoiceChatState, action: PayloadAction<PlayerEntityStateModel>) => {
      state.playerToReport = action.payload;
    },
    clearPlayerToReport: (state: VoiceChatState) => {
      state.playerToReport = null;
    },
    updateReport(state: VoiceChatState, action: PayloadAction<VoiceChatReportUpdate>) {
      state.reports[action.payload.accountID] = action.payload.report;
    },
    updateMutedAll: (state: VoiceChatState, action: PayloadAction<boolean>) => {
      state.mutedAll = action.payload;
    }
  }
});

export const {
  updateVoiceChatMember,
  removeVoiceChatMember,
  clearVoiceChatMembers,
  updatePlayerToReport,
  clearPlayerToReport,
  updateReport,
  updateMutedAll
} = voiceChatSlice.actions;
