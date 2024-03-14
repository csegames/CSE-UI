/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { PlayerDown } from './PlayerDown';
import { General } from './General';

const AnnouncementsContainer = 'Announcements-AnnouncementsContainer';

const AnnouncementSpacing = 'Announcements-AnnouncementSpacing';

export interface GeneralAnnouncement {
  type: 'general';
  text: string;
  iconClass: string;
}

export interface PlayerDownAnnouncement {
  type: 'playerdown';
  text: string;
  seconds: number;
}

export type Announcement = GeneralAnnouncement | PlayerDownAnnouncement;

export function Announcements() {
  const [announcements] = React.useState<Announcement[]>([]);
  return (
    <div className={AnnouncementsContainer}>
      <div className={AnnouncementSpacing}>
        {announcements.map((announcement, i) => {
          switch (announcement.type) {
            case 'playerdown': {
              return <PlayerDown key={i} message={announcement.text} seconds={announcement.seconds} />;
            }
            case 'general': {
              return <General key={i} text={announcement.text} iconClass={announcement.iconClass} />;
            }
          }
        })}
      </div>
    </div>
  );
}
