/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-04-12 20:06:39
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-04-12 23:49:31
 */

import * as React from 'react';
import RefillButton from './components/RefillButton';
import { client, hasClientAPI } from 'camelot-unchained';

const RefillAmmo = () => <RefillButton refill={() => {
  if (hasClientAPI()) {
    client.SendSlashCommand('refillammo');
  } else {
    console.log('would have sent /refillammo to server');
  }
}}/>;

export default RefillAmmo;
