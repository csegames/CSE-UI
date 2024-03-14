/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

function getGameOption(name: string): GameOption {
  const option = Object.values(game.options).find((o) => o.name === name);
  if (option) {
    return cloneDeep(option);
  }

  return null;
}

export interface GameOptionsState {
  gameOptions: Dictionary<GameOption>;
}

export enum GameOptionIDs {
  MuteTextChat = 'optMuteTextChat',
  BlockOffensiveWords = 'optBlockOffensiveWords',
  AdvancedHUD = 'optAdvancedHUD',
  PlayAbilityCooldownOverSFX = 'optPlayAbilityCooldownOverSFX',
  DoNotDisturb = 'optDoNotDisturb',
  PlayAbilityDisabledSFX = 'optPlayAbilityDisabledSFX'
}

const initialStatus: Dictionary<GameOption> = {};
initialStatus[GameOptionIDs.MuteTextChat] = getGameOption(GameOptionIDs.MuteTextChat);
initialStatus[GameOptionIDs.BlockOffensiveWords] = getGameOption(GameOptionIDs.BlockOffensiveWords);
initialStatus[GameOptionIDs.AdvancedHUD] = getGameOption(GameOptionIDs.AdvancedHUD);
initialStatus[GameOptionIDs.PlayAbilityCooldownOverSFX] = getGameOption(GameOptionIDs.PlayAbilityCooldownOverSFX);
initialStatus[GameOptionIDs.DoNotDisturb] = getGameOption(GameOptionIDs.DoNotDisturb);
initialStatus[GameOptionIDs.PlayAbilityDisabledSFX] = getGameOption(GameOptionIDs.PlayAbilityDisabledSFX);

export const gameOptionsSlice = createSlice({
  name: 'gameOptions',
  initialState: {
    gameOptions: initialStatus
  },
  reducers: {
    updateGameOption: (state: GameOptionsState, action: PayloadAction<GameOption>) => {
      state.gameOptions[action.payload.name] = cloneDeep(action.payload);
    }
  }
});

export const { updateGameOption } = gameOptionsSlice.actions;
