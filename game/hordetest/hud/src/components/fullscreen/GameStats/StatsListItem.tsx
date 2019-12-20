/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { OvermindCharacterSummary } from '@csegames/library/lib/hordetest/graphql/schema';
import { formatTime } from 'lib/timeHelpers';
import { ResourceBar } from '../../shared/ResourceBar';
import { ThumbsUpButton } from './ThumbsUpButton';

const Container = styled.div`
  display: flex;  align-items: center;
  padding: 10px;
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
  color: #6c6c6c;
`;

const Section = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const ThumbsUpButtonSpacing = styled.div`
  margin-left: 10px;
`;

const BarStyles = css`
  height: 30px;
  filter: grayscale(20%);
  background-color: #2a3754;
`;

export interface Props {
  playerStat: OvermindCharacterSummary;
  players: OvermindCharacterSummary[];
  thumbsUp: { [characterID: string]: string[] };
  onThumbsUpClick: (characterID: string) => void;
  onRevokeClick: (characterID: string) => void;
}

export function StatsListItem(props: Props) {
  function getStatsCurrentPercentage() {
    let totalKills = 0;
    let bestKillStreak = 0;
    let bestLongestLife = 0;
    let totalDamage = 0;
    let totalDamageTaken = 0;

    props.players.forEach((player) => {
      totalKills += player.kills;
      totalDamage += player.damageApplied;
      totalDamageTaken += player.damageTaken;

      if (player.longestKillStreak > bestKillStreak) {
        bestKillStreak = player.longestKillStreak;
      }

      if (player.longestLife > bestLongestLife) {
        bestLongestLife = player.longestLife;
      }
    });

    return {
      kills: (props.playerStat.kills / totalKills) * 100,
      killStreak: (props.playerStat.longestKillStreak / bestKillStreak) * 100,
      longestLife: (props.playerStat.longestLife / bestLongestLife) * 100,
      totalDamage: (props.playerStat.damageApplied / totalDamage) * 100,
      damageTaken: (props.playerStat.damageTaken / totalDamageTaken) * 100,
    }
  }

  function renderBar(numberText: string, current: number) {
    return (
      <ResourceBar isSquare type='blue' current={current} max={100} text={numberText} containerStyles={BarStyles} />
    );
  }

  function onThumbsUpClick() {
    props.onThumbsUpClick(props.playerStat.characterID);
  }

  function onRevokeClick() {
    props.onRevokeClick(props.playerStat.characterID);
  }

  const statsCurrentPercentage = getStatsCurrentPercentage();
  return (
    <Container>
      <ChampionProfile src={'images/fullscreen/character-select/face.png'} />
      <ChampionInfo>
        <PlayerName>{props.playerStat.userName}</PlayerName>
        <ChampionName>{'Champion Name'}</ChampionName>
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
