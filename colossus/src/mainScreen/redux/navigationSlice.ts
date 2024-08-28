/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as React from 'react';
import { ErrorData, convertRequestResult, isErrorData } from '../helpers/errorConversionHelpers';
import { PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

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
  Play = 'Play',
  Champions = 'Champions',
  BattlePass = 'BattlePass',
  Store = 'Store',
  CareerStats = 'CareerStats',
  Leaderboards = 'Leaderboards'
}

// chosen by user navigation when in the lobby, display lobby view underneath
export enum Overlay {
  ChampionDetails,
  ChampionSelectCosmetics,
  ClaimBattlePassModal,
  ConfirmProgressionReset,
  Credits,
  Debug,
  EmoteMenu,
  EndedBattlePassModal,
  EventAdvertisementModal,
  FreeBattlePassModal,
  GameModeSelection,
  MainMenu,
  MOTDModal,
  NewBattlePassModal,
  ProgressionTree,
  PurchaseGems,
  PurchaseProcessing,
  ReportPlayer,
  RewardCollection,
  RuneMods,
  RuneModsTutorial,
  SetDisplayName,
  Settings,
  SpendQuestXPPotions,
  WarningBroadcastModal
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
  state.overlays = state.overlays.filter((overlay) => !isErrorData(overlay.data));
}

export interface OverlayInstance {
  id: string;
  data: OverlayFieldType;
}

interface NavigationState {
  lifecyclePhase: LifecyclePhase;
  phaseOverride: LifecyclePhase | null;
  lobbyView: LobbyView;
  overlays: OverlayInstance[];
  rightPanelContent: React.ReactNode; // TODO : hold data to populate the panel instead of the actual content
  rightPanelVeilContent: React.ReactNode;
  cosmeticTab: PerkType;
}

const defaultNavigationState: NavigationState = {
  lifecyclePhase: LifecyclePhase.Lobby,
  phaseOverride: null,
  lobbyView: LobbyView.Play,
  overlays: [],
  rightPanelContent: null,
  rightPanelVeilContent: null,
  cosmeticTab: PerkType.Costume
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
    hideOverlay: (state: NavigationState, action: PayloadAction<OverlayFieldType>) => {
      state.overlays = state.overlays.filter((overlay) => overlay.data !== action.payload);
    },
    hideAllOverlays: (state: NavigationState) => {
      state.overlays = [];
    },
    hideRightPanel: (state: NavigationState) => {
      state.rightPanelContent = null;
      state.rightPanelVeilContent = null;
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
      const data = isErrorData(action.payload) ? action.payload : convertRequestResult(action.payload);
      state.overlays.push({
        id: genID(),
        data
      });
    },
    showOverlay: (state: NavigationState, action: PayloadAction<Overlay>) => {
      state.overlays.push({
        id: genID(),
        data: action.payload
      });
    },
    showVideoPlayer: (state: NavigationState, action: PayloadAction<VideoParams>) => {
      state.overlays.push({
        id: genID(),
        data: action.payload
      });
    },
    showRightPanel: {
      reducer: (
        state: NavigationState,
        action: PayloadAction<{ content: React.ReactNode; veilContent?: React.ReactNode }>
      ) => {
        if (state.lifecyclePhase !== LifecyclePhase.Lobby) {
          return;
        }
        state.rightPanelContent = action.payload.content;
        state.rightPanelVeilContent = action.payload.veilContent ?? null;
      },
      prepare: (content: React.ReactNode, veilContent?: React.ReactNode) => {
        return {
          payload: {
            content,
            veilContent
          }
        };
      }
    },
    setCosmeticTab: (state: NavigationState, action: PayloadAction<PerkType>) => {
      state.cosmeticTab = action.payload;
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
  updateLifecycle,
  setCosmeticTab
} = navigationSlice.actions;
