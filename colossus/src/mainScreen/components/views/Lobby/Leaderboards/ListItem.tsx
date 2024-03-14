/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { TopPlayer } from './testData';

const Container = 'Leaderboards-ListItem-Container';
const ItemLeftSection = 'Leaderboards-ListItem-ItemLeftSection';
const RankText = 'Leaderboards-ListItem-RankText';
const ChampionImage = 'Leaderboards-ListItem-ChampionImage';
const UserName = 'Leaderboards-ListItem-UserName';
const ChampionName = 'Leaderboards-ListItem-ChampionName';

const StatValue = 'Leaderboards-ListItem-StatValue';

export interface Props {
  rank: number;
  player: TopPlayer;
}

export function ListItem(props: Props) {
  return (
    <div className={Container}>
      <div className={ItemLeftSection}>
        <div className={RankText}>{props.rank}</div>
        <img className={ChampionImage} src={props.player.championInfo.iconUrl} />
        <div>
          <div className={UserName}>{props.player.userName}</div>
          <div className={ChampionName}>{props.player.championInfo.name}</div>
        </div>
      </div>

      <div className={StatValue}>{props.player.statNumber}</div>
    </div>
  );
}
