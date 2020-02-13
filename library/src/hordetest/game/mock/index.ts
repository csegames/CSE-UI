/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as mockAnnouncements from './mockAnnouncement';
import * as mockPlayerDirections from './mockPlayerDirections';
import * as mockObjectives from './mockObjectives';

export interface Mock {
  name: string;
  expectedOutcomeDescription: string;
  function: () => void;
}

const mocks: { [section: string]: Mock[] } = {
  announcements: [
    mockAnnouncements.mockPopup,
    mockAnnouncements.mockEmptyPopup,
  ],

  // Player Direction Indicators
  playerDirectionIndicators: [
    mockPlayerDirections.mock,
    mockPlayerDirections.mockNull,
    mockPlayerDirections.mockTooMany,
  ],

  objectives: [
    mockObjectives.mock,
    mockObjectives.mockRemove,
    mockObjectives.mockNull,
  ],
}

export { mocks };
