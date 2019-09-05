/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { SortBy } from './StatsList';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
`;

const PreviewImageSpacing = styled.div`
  width: 40px;
  margin-right: 10px;
`;

const ChampionInfo = styled.div`
  flex: 1.5;
  color: #636363;
  font-family: Colus;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    filter: brightness(130%);
  }
`;

const Section = styled.div`
  flex: 1;
  color: #636363;
  margin: 0 10px;
  font-family: Colus;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    filter: brightness(130%);
  }
`;

const ButtonSpacing = styled.div`
  width: 28px;
`;

export interface Props {
  sortBy: SortBy;
  leastToGreatest: boolean;
  onSortBy: (sortBy: SortBy) => void;
}

export function StatsListHeader(props: Props) {
  function onPlayerClick() {
    props.onSortBy(SortBy.PlayerName);
  }

  function onKillsClick() {
    props.onSortBy(SortBy.Kills);
  }

  function onKillStreakClick() {
    props.onSortBy(SortBy.KillStreak);
  }

  function onLongestLifeClick() {
    props.onSortBy(SortBy.LongestLife);
  }

  function onTotalDamageClick() {
    props.onSortBy(SortBy.Damage);
  }

  function onDamageTakenClick() {
    props.onSortBy(SortBy.DamageTaken);
  }

  function renderArrow(sortBy: SortBy) {
    if (sortBy !== props.sortBy) return null;

    if (props.leastToGreatest) {
      return <span className='fas fa-chevron-up'></span>;
    } else {
      return <span className='fas fa-chevron-down'></span>;
    }
  }

  return (
    <Container>
      <ChampionInfo onClick={onPlayerClick}>Player</ChampionInfo>
      <PreviewImageSpacing />
      <Section onClick={onKillsClick}>Kills {renderArrow(SortBy.Kills)}</Section>
      <Section onClick={onKillStreakClick}>Kill Streak {renderArrow(SortBy.KillStreak)}</Section>
      <Section onClick={onLongestLifeClick}>Longest Life {renderArrow(SortBy.LongestLife)}</Section>
      <Section onClick={onTotalDamageClick}>Total Damage {renderArrow(SortBy.Damage)}</Section>
      <Section onClick={onDamageTakenClick}>Damage Taken {renderArrow(SortBy.DamageTaken)}</Section>
      <ButtonSpacing />
    </Container>
  );
}
