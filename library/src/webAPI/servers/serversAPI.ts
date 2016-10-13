/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-13 12:43:45
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-13 12:43:45
 */

import {create} from 'apisauce';
import createOptions from '../createOptions';

export function fetchCharacters() {
  return create(createOptions()).get('servers');
};
