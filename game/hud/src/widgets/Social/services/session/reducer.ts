/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-16 16:06:24
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-20 18:15:45
 */

import {combineReducers} from 'redux';

import navigation, {NavigationState} from './navigation';
import order, {OrderState} from './order';

export default combineReducers({
  navigation,
  order,
});

export interface SessionState {
  navigation: NavigationState,
  order: OrderState,
}
