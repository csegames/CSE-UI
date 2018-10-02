/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { mockGame } from './mockGame';
import { mockLoading } from './mockLoading';
import { mockPlot } from './mockPlot';
import { mockKeyActions } from './mockKeyActions';
import { mockSelfPlayerState } from './mockSelfPlayerState';

export function runMocks() {
  mockGame();
  mockLoading();
  mockPlot();
  mockKeyActions();
  mockSelfPlayerState();
}
