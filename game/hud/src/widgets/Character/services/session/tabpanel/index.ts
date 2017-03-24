/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 17:39:46
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 16:09:01
 */

import { Module } from 'redux-typed-modules';

export const types = {
  SET_TAB_INDEX: 'tabpanel/SET_TAB_INDEX',
};

export interface TabPanelState {
  currentTabIndex: number;
}

export function getInitialState() {
  const initialState: TabPanelState = {
    currentTabIndex: 0,
  };
  return initialState;
}

export const module = new Module({
  initialState: getInitialState(),
});

export const setTabIndex = module.createAction({
  type: 'tabpanel/SET_TAB_INDEX',
  action: (action: { tabIndex: number }) => action,
  reducer: (state, action) => {
    return {
      currentTabIndex: action.tabIndex,
    };
  },
});

export default module.createReducer();
