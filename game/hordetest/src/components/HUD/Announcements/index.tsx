/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { LeveledUp } from './LeveledUp';
import { PlayerDown } from './PlayerDown';
import { General } from './General';

const AnnouncementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const AnnouncementSpacing = styled.div`
  margin-bottom: 5px;
`;

export interface GeneralAnnouncement {
  type: 'general';
  text: string;
  iconClass: string;
}

export interface LevelAnnouncement {
  type: 'level';
}

export interface PlayerDownAnnouncement {
  type: 'playerdown';
  text: string;
  seconds: number;
}

export type Announcement = GeneralAnnouncement | LevelAnnouncement | PlayerDownAnnouncement;

export function Announcements() {
  const [announcements] = useState<Announcement[]>([
    {
      type: 'general',
      text: 'Wave Cleared! 10:23',
      iconClass: 'icon-enemy',
    },
  ]);
  return (
    <AnnouncementsContainer>
      <AnnouncementSpacing>
        {announcements.map((announcement, i) => {
          switch (announcement.type) {
            case 'level': {
              return (
                <LeveledUp isAnnouncement key={i} />
              );
            }
            case 'playerdown': {
              return (
                <PlayerDown key={i} message={announcement.text} seconds={announcement.seconds} />
              );
            }
            case 'general': {
                return (
                  <General key={i} text={announcement.text} iconClass={announcement.iconClass} />
                );
            }
          }
        })}
      </AnnouncementSpacing>
    </AnnouncementsContainer>
  );
}
