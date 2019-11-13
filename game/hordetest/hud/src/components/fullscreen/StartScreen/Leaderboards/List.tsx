/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ListItem } from './ListItem';
import { players } from './testData';
import { Title } from 'components/fullscreen/Title';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

const TitleStyle = css`
  margin-top: 45px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  align-self: flex-end;
`;

const TitleName = styled.div`
  font-family: Colus;
  font-size: 30px;
  color: white;
`;

const FilterSection = styled.div`
  display: flex;
`;

const FilterButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 20px 0;
  width: 120px;
  font-size: 18px;
  font-family: Colus;
  color: white;
  background-color: #353535;
  filter: brightness(100%);

  &.group {
    margin-left: 5px;
  }

  &.selected {
    background-color: #284076;

    &:hover {
      filter: brightness(100%);
    }
  }

  &:hover {
    filter: brightness(140%);
  }
`;

enum FilterType {
  Solo,
  Group,
}

export interface Props {
}

export function List() {
  const [filterType, setFilterType] = useState<FilterType>(FilterType.Solo);
  const p = cloneDeep(players).concat(players).concat(players);
  const sortedFilteredTopPlayers = p.sort((a, b) => b.statNumber - a.statNumber);

  function onClickSolo() {
    setFilterType(FilterType.Solo);
  }

  function onClickGroup() {
    setFilterType(FilterType.Group);
  }

  return (
    <Container>
      <Title className={TitleStyle}>
        <TitleSection>
          <TitleName>Name of Season</TitleName>
        </TitleSection>
        <FilterSection>
          <FilterButton onClick={onClickSolo} className={filterType === FilterType.Solo ? 'selected' : ''}>
            Solo
          </FilterButton>
          <FilterButton onClick={onClickGroup} className={`${filterType === FilterType.Group ? 'selected' : ''} group`}>
            Group
          </FilterButton>
        </FilterSection>
      </Title>
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