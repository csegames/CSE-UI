/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

let nextToasterID: number = 1;

export const DEFAULT_TOAST_DURATION_MILLIS = 3000;

export interface ToasterRewardModel {
  name: string;
  amount: number;
  iconUrl?: string; // Item icon rendered between the plus and the name. Omitted when unset.
  isGold?: boolean; // Gold renders as a coin MoneyDisplay instead of text.
}

export interface ToasterModel {
  iconURL?: string;
  eyebrow?: string; // Small headline rendered above the title. Omitted when unset.
  category?: string; // Small realm-colored label rendered directly above the title. Omitted when unset.
  titleIconURL?: string; // Small icon rendered to the left of the title. Omitted when unset.
  title?: string;
  message?: string;
  rewards?: ToasterRewardModel[]; // Reward rows rendered below the message, each led by a realm-colored plus.
  isError?: boolean;
  isSmall?: boolean;
}

export interface ToasterParams {
  id?: string;
  content: (() => React.ReactNode) | ToasterModel;
  duration?: number;
  // 'quest' toasts stack in the Quest Notifications HUD widget, 'level' toasts in the
  // Level Notifications HUD widget. Default is 'bottom'.
  position?: 'bottom' | 'quest' | 'level';
  soundEvent?: SoundEvents; // If included, this event will fire when the toaster is shown.
}

export interface ToastersState {
  toasters: ToasterParams[];
  questToasters: ToasterParams[];
  levelToasters: ToasterParams[];
}

function buildDefaultToastersState() {
  const DefaultModalsState: ToastersState = {
    toasters: [],
    questToasters: [],
    levelToasters: []
  };

  return DefaultModalsState;
}

export const toastersSlice = createSlice({
  name: 'toasters',
  initialState: buildDefaultToastersState(),
  reducers: {
    showToaster: (state: ToastersState, action: PayloadAction<ToasterParams>) => {
      if (!action.payload.id) {
        action.payload.id = `${nextToasterID++}`;
      }
      if (!action.payload.position) {
        action.payload.position = 'bottom';
      }

      let queue: ToasterParams[];
      switch (action.payload.position) {
        case 'quest':
          queue = state.questToasters;
          break;
        case 'level':
          queue = state.levelToasters;
          break;
        default:
          queue = state.toasters;
          break;
      }

      const oldToast = queue.find((toast) => {
        return toast.id === action.payload.id;
      });
      if (oldToast) {
        // If a toast with that ID is already in the queue, just update it.
        Object.assign(oldToast, action.payload);
      } else {
        // If the toast is new, push it in.
        queue.push(action.payload);
      }
    },
    hideToaster: (state: ToastersState, action: PayloadAction<string>) => {
      // Was it a bottom toaster?
      let index = state.toasters.findIndex((p) => p.id === action.payload);
      if (index > -1) {
        state.toasters.splice(index, 1);
        return;
      }
      // Was it a quest toaster?
      index = state.questToasters.findIndex((p) => p.id === action.payload);
      if (index > -1) {
        state.questToasters.splice(index, 1);
        return;
      }
      // Was it a level toaster?
      index = state.levelToasters.findIndex((p) => p.id === action.payload);
      if (index > -1) {
        state.levelToasters.splice(index, 1);
      }
    }
  }
});

export const { showToaster, hideToaster } = toastersSlice.actions;
