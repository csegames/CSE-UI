/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ListItem } from './ListItem';
import { players } from './testData';
import { Title } from '../Title';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

const Container = 'Leaderboards-List-Container';
const ListContainer = 'Leaderboards-List-ListContainer';
const TitleStyle = 'Leaderboards-List-Title';
const TitleSection = 'Leaderboards-List-TitleSection';
const TitleName = 'Leaderboards-List-TitleName';
const FilterSection = 'Leaderboards-List-FilterSection';

const FilterButton = 'Leaderboards-List-FilterButton';

enum FilterType {
  Solo,
  Group
}

export interface Props {}

export function List() {
  const [filterType, setFilterType] = React.useState<FilterType>(FilterType.Solo);
  const p = cloneDeep(players)
    .concat(players)
    .concat(players);
  const sortedFilteredTopPlayers = p.sort((a, b) => b.statNumber - a.statNumber);

  function onClickSolo() {
    setFilterType(FilterType.Solo);
  }

  function onClickGroup() {
    setFilterType(FilterType.Group);
  }

  return (
    <div className={Container}>
      <div className={`${Title} ${TitleStyle}`}>
        <div className={TitleSection}>
          <div className={TitleName}>Name of Season</div>
        </div>
        <div className={FilterSection}>
          <div className={`${FilterButton} ${filterType === FilterType.Solo ? 'selected' : ''}`} onClick={onClickSolo}>
            Solo
          </div>
          <div
            className={`${FilterButton} ${filterType === FilterType.Group ? 'selected' : ''} group`}
            onClick={onClickGroup}
          >
            Group
          </div>
        </div>
      </div>
      <div className={ListContainer}>
        {sortedFilteredTopPlayers.map((topPlayer, i) => {
          return <ListItem player={topPlayer} rank={i + 1} />;
        })}
      </div>
    </div>
  );
}
