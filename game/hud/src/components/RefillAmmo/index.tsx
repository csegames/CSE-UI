/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import RefillButton from './components/RefillButton';
import { client, hasClientAPI } from '@csegames/camelot-unchained';

const RefillAmmo = () => <RefillButton refill={() => {
  if (hasClientAPI()) {
    client.SendSlashCommand('refillammo');
  } else {
    console.log('would have sent /refillammo to server');
  }
}}/>;

export default RefillAmmo;
