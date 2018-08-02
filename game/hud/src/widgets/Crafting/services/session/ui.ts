/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Module } from 'redux-typed-modules';

export interface UIState {
  mode: string;
  remaining: number;      // crafting timer
  minimized: boolean;     // minimized?
}

export const initialState = (): UIState => {
  return {
    mode: 'crafting',
    remaining: 0,
    minimized: false,
  };
};

const module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date(),
    };
  },
});

export const setUIMode = module.createAction({
  type: 'crafting/ui/mode',
  action: (mode: string) => {
    return { mode };
  },
  reducer: (s, a) => {
    return { mode: a.mode };
  },
});

export const setRemaining = module.createAction({
  type: 'crafting/ui/crafting-progress',
  action: (remaining: number) => {
    return { remaining };
  },
  reducer: (s, a) => {
    return { remaining: a.remaining };
  },
});

export const setMinimized = module.createAction({
  type: 'crafting/ui/minimized',
  action: (minimized: boolean) => {
    return { minimized };
  },
  reducer: (s, a) => {
    return { minimized: a.minimized };
  },
});

export default module.createReducer();
