/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { mockEvents } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AnnouncementType } from '@csegames/library/dist/_baseGame/types/localDefinitions';

export const consolePrint = (message: string | Object): void => {
  const text = typeof message === 'string' ? message : JSON.stringify(message);
  mockEvents.triggerAnnouncement(AnnouncementType.Text, text, '', '', 0);
};
