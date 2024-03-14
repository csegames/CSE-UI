/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as mockAnnouncements from './mockAnnouncement';
import * as mockPlayerDirections from './mockPlayerDirections';
import * as mockObjectiveDetails from './mockObjectiveDetails';
import * as mockFriendlyPlayers from './mockFriendlyPlayers';

export interface Mock {
  name: string;
  expectedOutcomeDescription: string;
  function: () => void;
}

const mocks: { [section: string]: Mock[] } = {
  announcements: [
    mockAnnouncements.mockPopup,
    mockAnnouncements.mockObjectiveSuccess,
    mockAnnouncements.mockObjectiveFailed,
    mockAnnouncements.mockEmptyPopup
  ],

  dialogue: [
    mockAnnouncements.mockDialogueLong,
    mockAnnouncements.mockDialogueShort,
    mockAnnouncements.mockDialogueNoSound
  ],

  // Fake players
  friendlyPlayers: [
    mockFriendlyPlayers.mockAddSingle,
    mockFriendlyPlayers.mockRemoveSingle,
    mockFriendlyPlayers.mockAddMultiple,
    mockFriendlyPlayers.mockRemoveAll
  ],

  // Player Direction Indicators
  playerDirectionIndicators: [
    mockPlayerDirections.mock,
    mockPlayerDirections.mockNull,
    mockPlayerDirections.mockTooMany
  ],

  objectiveDetails: [
    mockObjectiveDetails.mockClearAllObjectiveDetails,

    // primary
    mockObjectiveDetails.mockPrimaryTimer,
    mockObjectiveDetails.mockPrimaryCounter,
    mockObjectiveDetails.mockPrimaryTimerAndCounter,

    // main quest
    mockObjectiveDetails.mockMainQuestTimer,
    mockObjectiveDetails.mockMainQuestCounter,
    mockObjectiveDetails.mockMainQuestTimerCounter,

    // side quest
    mockObjectiveDetails.mockSideQuestTimer,
    mockObjectiveDetails.mockSideQuestCounter,
    mockObjectiveDetails.mockSideQuestTimerCounter,

    // 3 of each category, all states
    mockObjectiveDetails.mockMultipleObjectiveDetails,
    mockObjectiveDetails.mockSetAllSuccess,
    mockObjectiveDetails.mockSetAllFailed,

    // 3 of each category, all states (no description line)
    mockObjectiveDetails.mockMultipleObjectiveDetailsNoDesc,
    mockObjectiveDetails.mockSetAllSuccessNoDesc,
    mockObjectiveDetails.mockSetAllFailedNoDesc,

    // 3 of each category, all states (no title line)
    mockObjectiveDetails.mockMultipleObjectiveDetailsNoTitle,
    mockObjectiveDetails.mockSetAllSuccessNoTitle,
    mockObjectiveDetails.mockSetAllFailedNoTitle,

    // 3 of each category, all states (no text - progress bar only)
    mockObjectiveDetails.mockMultipleObjectiveDetailsProgressBarOnly,
    mockObjectiveDetails.mockSetAllSuccessProgressBarOnly,
    mockObjectiveDetails.mockSetAllFailedProgressBarOnly
  ]
};

export { mocks };
