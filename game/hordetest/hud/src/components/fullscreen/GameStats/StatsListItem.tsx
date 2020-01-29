/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { OvermindCharacterSummary } from '@csegames/library/lib/hordetest/graphql/schema';

import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { formatTime } from 'lib/timeHelpers';
import { ResourceBar } from '../../shared/ResourceBar';
import { ThumbsUpButton } from './ThumbsUpButton';

const Container = styled.div`
  display: flex;  align-items: center;
  padding: 10px;
  transition: background 0.1s;

  &:hover {
    background: rgba(65, 116, 255, 0.17);
  }
`;

const ChampionProfile = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  background-color: #4b3311;
  margin-right: 10px;
`;

const ChampionInfo = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 18px;
  color: white;
`;

const ChampionName = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 12px;
  color: #8c8c8c;
`;

const Section = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const ThumbsUpButtonSpacing = styled.div`
`;

const BarStyles = css`
  height: 15px;
  background-color: #2a3754;
  filter: grayscale(70%);
  transition: width .5s ease-in;

  &.self {
    filter: grayscale(0);
  }
`;

export interface Props {
  playerStat: OvermindCharacterSummary;
  players: OvermindCharacterSummary[];
  thumbsUp: { [characterID: string]: string[] };
  onThumbsUpClick: (characterID: string) => void;
  onRevokeClick: (characterID: string) => void;
}

export function StatsListItem(props: Props) {
  const championInfoContext = useContext(ChampionInfoContext);

  function getStatsCurrentPercentage() {
    let bestKills = 0;
    let bestKillStreak = 0;
    let bestLongestLife = 0;
    let bestDamage = 0;
    let bestDamageTaken = 0;

    props.players.forEach((player) => {
      if (player.kills > bestKills) {
        bestKills = player.kills;
      }

      if (player.damageApplied > bestDamage) {
        bestDamage = player.damageApplied;
      }

      if (player.damageTaken > bestDamageTaken) {
        bestDamageTaken = player.damageTaken;
      }

      if (player.longestKillStreak > bestKillStreak) {
        bestKillStreak = player.longestKillStreak;
      }

      if (player.longestLife > bestLongestLife) {
        bestLongestLife = player.longestLife;
      }
    });

    return {
      kills: (props.playerStat.kills / bestKills) * 100,
      killStreak: (props.playerStat.longestKillStreak / bestKillStreak) * 100,
      longestLife: (props.playerStat.longestLife / bestLongestLife) * 100,
      totalDamage: (props.playerStat.damageApplied / bestDamage) * 100,
      damageTaken: (props.playerStat.damageTaken / bestDamageTaken) * 100,
    }
  }

  function renderBar(numberText: string, current: number) {
    const isSelf = hordetest.game.selfPlayerState ?
      props.playerStat.characterID === hordetest.game.selfPlayerState.characterID :
      props.playerStat.characterID === game.characterID;
    return (
      <ResourceBar
        isSquare
        type='blue'
        current={current}
        max={100}
        text={numberText}
        containerStyles={`${BarStyles} ${isSelf ? 'self' : ''}`}
      />
    );
  }

  function onThumbsUpClick() {
    props.onThumbsUpClick(props.playerStat.characterID);
  }

  function onRevokeClick() {
    props.onRevokeClick(props.playerStat.characterID);
  }

  function getChampionInfo() {
    const playerChampion = championInfoContext.champions.find(champion => champion.id === props.playerStat.classID);
    const playerCostume = championInfoContext.championCostumes.find(costume => costume.id === props.playerStat.raceID);
    return {
      ...playerChampion,
      costume: playerCostume,
    }
  }

  const statsCurrentPercentage = getStatsCurrentPercentage();
  const championInfo = getChampionInfo();
  return (
    <Container>
      <ChampionProfile src={championInfo && championInfo.costume ? championInfo.costume.thumbnailURL : ''} />
      <ChampionInfo>
        <PlayerName>{props.playerStat.userName}</PlayerName>
        <ChampionName>{championInfo ? championInfo.name : 'Champion Name'}</ChampionName>
      </ChampionInfo>
      <Section>
        {renderBar(props.playerStat.kills.toString(), statsCurrentPercentage.kills)}
      </Section>
      <Section>
        {renderBar(props.playerStat.longestKillStreak.toString(), statsCurrentPercentage.killStreak)}
      </Section>
      <Section>
        {renderBar(formatTime(props.playerStat.longestLife), statsCurrentPercentage.longestLife)}
      </Section>
      <Section>
        {renderBar(props.playerStat.damageApplied.toString(), statsCurrentPercentage.totalDamage)}
      </Section>
      <Section>
        {renderBar(props.playerStat.damageTaken.toString(), statsCurrentPercentage.damageTaken)}
      </Section>
      <ThumbsUpButtonSpacing>
        <ThumbsUpButton
          thumbsUp={props.thumbsUp}
          characterID={props.playerStat.characterID}
          onThumbsUpClick={onThumbsUpClick}
          onRevokeClick={onRevokeClick}
        />
      </ThumbsUpButtonSpacing>
    </Container>
  );
}
