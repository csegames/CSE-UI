/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Container = 'Leaderboards-ListHeader-Container';
const ItemLeftSection = 'Leaderboards-ListHeader-ItemLeftSection';
const RankText = 'Leaderboards-ListHeader-RankText';
const PlayerInfo = 'Leaderboards-ListHeader-PlayerInfo';

const StatValue = 'Leaderboards-ListHeader-StatValue';

export function ListHeader() {
  return (
    <div className={Container}>
      <div className={ItemLeftSection}>
        <div className={RankText}>Rank</div>
        <div className={PlayerInfo} />
      </div>

      <div className={StatValue}>Survival Time</div>
    </div>
  );
}
