/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Promise } from 'es6-promise';
import * as RestClient from './../RestClient';
import client from '../../core/client';

export function getBlueprintIcon(id: number): Promise<string> {
  return RestClient.getJSON('cuapi://buildingicons/blueprint/' + id);
}
