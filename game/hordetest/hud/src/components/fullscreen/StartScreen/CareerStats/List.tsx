/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Dropdown } from '../../Dropdown';
import { ListItem } from './ListItem';
import { StatType, topPlayers } from './testData';
import { Title } from 'components/fullscreen/Title';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DropdownContainer = styled.div`
  display: flex;
  max-height: 40px;
  flex: 1;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-top: 10px;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
  }
`;

const UnderlineStyle = css`
  margin-top: 45px;
`;

const ChampionDropdownSpacing = css`
  margin-right: 5px;
`;

const StatDropdownSpacing = css`
  margin-left: 5px;
`;

export interface Props {
}

const championDropdownItems = [
  'Any',
  'Amazon',
  'Berserker',
];

const statDropdownItems = [
  StatType[StatType.Kills],
  StatType[StatType.KillStreak],
  StatType[StatType.LongestLife],
  StatType[StatType.DamageTaken],
  StatType[StatType.TotalDamage],
];

export function List() {
  const [selectedChampion, setSelectedChampion] = useState(championDropdownItems[0]);
  const [selectedStat, setSelectedStat] = useState<StatType>(StatType.Kills);

  function onSelectChampion(champion: string) {
    setSelectedChampion(champion);
  }

  function onSelectStat(statTypeKey: string) {
    setSelectedStat(StatType[statTypeKey]);
  }

  function getFilteredTopPlayers() {
    const topPlayersClone = cloneDeep(topPlayers).concat(topPlayers).concat(topPlayers);
    return topPlayersClone.filter(p =>
      (selectedChampion === 'Any' || p.championInfo.name === selectedChampion) && p.statType === selectedStat);
  }


  const sortedFilteredTopPlayers = getFilteredTopPlayers().sort((a, b) => b.statNumber - a.statNumber);
  return (
    <Container>
      <DropdownContainer>
        <Dropdown
          containerStyles={ChampionDropdownSpacing}
          items={championDropdownItems}
          selectedItem={selectedChampion}
          onSelectItem={onSelectChampion}
        />
        <Dropdown
          containerStyles={StatDropdownSpacing}
          items={statDropdownItems}
          selectedItem={StatType[selectedStat]}
          onSelectItem={onSelectStat}
          formatItem={item => item.toTitleCase()}
        />
      </DropdownContainer>
      <Title className={UnderlineStyle} />
      <ListContainer>
        {sortedFilteredTopPlayers.map((topPlayer, i) => {
          return (
            <ListItem player={topPlayer} rank={i + 1} />
          );
        })}
      </ListContainer>
    </Container>
  );
}
