/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SettingsPanel } from '../components/SettingsPanel';

/* tslint:disable:function-name */
export function ComingSoon() {
  return (
    <SettingsPanel>
      <div style={{ padding: '5px' }}>
        <div style={{ color: 'white' }}>Coming soon</div>
      </div>
    </SettingsPanel>
  );
}
