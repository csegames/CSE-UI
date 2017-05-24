/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-17 20:46:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-24 22:23:58
 */

import { Module } from 'redux-typed-modules';

export interface UIState {
  mode: string;
  countdown: number;
}

const initialState = () : UIState => {
  return {
    mode: 'crafting',
    countdown: 0,
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

export const setCountdown = module.createAction({
  type: 'crafting/ui/countdown',
  action: (countdown: number) => {
    return { countdown };
  },
  reducer: (s, a) => {
    return { countdown: a.countdown };
  },
});

export default module.createReducer();
