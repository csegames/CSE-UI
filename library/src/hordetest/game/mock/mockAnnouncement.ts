/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Mock } from './index';
import { EE_OnAnnouncement } from '../engineEvents';

export const mockPopup: Mock = {
  name: 'Normal',
  expectedOutcomeDescription: `A message should come pop up in the center of the screen with
    the text \"This is a mock popup announcement\"`,
  function: () => {
    console.log('-- Mock expected popup announcement');
    engine.trigger(
      EE_OnAnnouncement,
      AnnouncementType.PopUp,
      'This is a mock popup announcement ' + Math.random().toFixed(3),
    );
  },
}

export const mockEmptyPopup: Mock = {
  name: 'Empty Message',
  expectedOutcomeDescription: 'No message should pop up',
  function: () => {
    console.log('-- Mock no message popup announcement');
    engine.trigger(EE_OnAnnouncement, AnnouncementType.PopUp, '');
  },
}
