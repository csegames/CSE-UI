/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const PlayerDownContainer = 'Announcements-PlayerDown-PlayerDownContainer';
const InfoContainer = 'Announcements-PlayerDown-InfoContainer';
const Title = 'Announcements-PlayerDown-Title';
const BarContainer = 'Announcements-PlayerDown-BarContainer';

const BarFill = 'Announcements-PlayerDown-BarFill';

export interface Props {
  message: string;
  seconds: number;
}

export function PlayerDown(props: Props) {
  return (
    <div className={PlayerDownContainer}>
      <div className={InfoContainer}>
        <div className={Title}>{props.message}</div>
        <div className={BarContainer}>
          <div className={BarFill} />
        </div>
      </div>
    </div>
  );
}
