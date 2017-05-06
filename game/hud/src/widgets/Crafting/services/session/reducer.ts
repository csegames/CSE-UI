/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:41
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-05 21:45:13
 */


import { combineReducers } from 'redux';

import job, { JobState } from './job';

export default combineReducers({
  job,
});

export interface GlobalState {
  job: JobState;
}
