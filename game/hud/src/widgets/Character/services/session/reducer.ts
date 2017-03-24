/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-04-21 17:12:09
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 17:43:40
 */

import { combineReducers } from 'redux';

import characterSheetReducer from './character';
const characterSheet = characterSheetReducer;

import tabPanelReducer from './tabpanel';
const tabPanel = tabPanelReducer;

export default combineReducers({
  characterSheet,
  tabPanel,
});
