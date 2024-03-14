/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as React from 'react';
import { ErrorData, convertRequestResult, isErrorData } from '../helpers/errorConversionHelpers';

// BEGIN INTERFACES AND STATES

// defined from server state
export enum LifecyclePhase {
  Lobby,
  ChampionSelect,
  Playing,
  GameStats
}

// chosen by user navigation
export enum LobbyView {
  Play,
  Champions,
  BattlePass,
  Store,
  CareerStats,
  Leaderboards,
  SelectWeapon,
  SelectSkin,
  SelectEmote,
  SelectAppearance
}

// chosen by user navigation when in the lobby, display lobby view underneath
export enum Overlay {
  ChampionDetails,
  ClaimBattlePassModal,
  Credits,
  Debug,
  EmoteMenu,
  EndedBattlePassModal,
  FreeBattlePassModal,
  MainMenu,
  NewBattlePassModal,
  PurchaseProcessing,
  ReportPlayer,
  RewardCollection,
  RuneMods,
  SetDisplayName,
  Settings,
  SpendQuestXPPotions
}

export interface VideoParams {
  src: string;
  styles?: string;
  forceStop?: boolean;
}

export function isVideoParams(data: any): data is VideoParams {
  return typeof data === 'object' && typeof data?.src === 'string';
}

export type OverlayFieldType = Overlay | ErrorData | VideoParams;

function hideNonErrorOverlays(state: NavigationState) {
  // don't clear error on transition, allow user to close it manually after reading
  if (!isErrorData(state.overlay)) {
    state.overlay = null;
  }
}

interface NavigationState {
  lifecyclePhase: LifecyclePhase;
  phaseOverride: LifecyclePhase | null;
  lobbyView: LobbyView;
  overlay: OverlayFieldType;
  rightPanelContent: React.ReactNode; // TODO : hold data to populate the panel instead of the actual content
}

const defaultNavigationState: NavigationState = {
  lifecyclePhase: LifecyclePhase.Lobby,
  phaseOverride: null,
  lobbyView: LobbyView.Play,
  overlay: null,
  rightPanelContent: null
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: defaultNavigationState,
  reducers: {
    setLifecycleOverride: (state: NavigationState, action: PayloadAction<LifecyclePhase>) => {
      if (state.lifecyclePhase == action.payload) return;
      state.phaseOverride = action.payload;
      state.lifecyclePhase = action.payload;
      state.lobbyView = LobbyView.Play;
      hideNonErrorOverlays(state);
    },
    updateLifecycle: (state: NavigationState, action: PayloadAction<LifecyclePhase>) => {
      if (state.phaseOverride === action.payload) {
        state.phaseOverride = null;
        return;
      }
      if (state.lifecyclePhase === action.payload) return;
      state.lifecyclePhase = action.payload;
      state.lobbyView = LobbyView.Play;
      hideNonErrorOverlays(state);
    },
    hideOverlay: (state: NavigationState, action: PayloadAction<Overlay>) => {
      if (action.payload === state.overlay) {
        state.overlay = null;
      }
    },
    hideAllOverlays: (state: NavigationState) => {
      state.overlay = null;
    },
    hideRightPanel: (state: NavigationState) => {
      state.rightPanelContent = null;
    },
    navigateTo: (state: NavigationState, action: PayloadAction<LobbyView>) => {
      if (state.lifecyclePhase !== LifecyclePhase.Lobby || state.lobbyView == action.payload) {
        return;
      }
      state.lobbyView = action.payload;
      hideNonErrorOverlays(state);
      state.rightPanelContent = null;
    },
    showError: (state: NavigationState, action: PayloadAction<ErrorData | RequestResult>) => {
      console.error('Error', action.payload);
      state.overlay = isErrorData(action.payload) ? action.payload : convertRequestResult(action.payload);
    },
    showOverlay: (state: NavigationState, action: PayloadAction<Overlay>) => {
      state.overlay = action.payload;
    },
    showVideoPlayer: (state: NavigationState, action: PayloadAction<VideoParams>) => {
      state.overlay = action.payload;
    },
    showRightPanel: (state: NavigationState, action: PayloadAction<React.ReactNode>) => {
      if (state.lifecyclePhase !== LifecyclePhase.Lobby) {
        return;
      }
      state.rightPanelContent = action.payload;
    }
  }
});

export const {
  navigateTo,
  hideAllOverlays,
  hideOverlay,
  hideRightPanel,
  setLifecycleOverride,
  showError,
  showOverlay,
  showRightPanel,
  showVideoPlayer,
  updateLifecycle
} = navigationSlice.actions;
