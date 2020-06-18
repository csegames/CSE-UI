/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { OvermindSummaryDBModel, OvermindCharacterSummary } from '@csegames/library/lib/hordetest/graphql/schema';

import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { formatTime } from '../../../lib/timeHelpers';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const HighlightContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom right, #fece71, #81603c);
  border-image-slice: 5;
  background-color: #242424;
  outline: rgba(255, 223, 5, 0.32) 1px solid;
  outline-offset: -4px;
  margin: 13px;
  text-align: center;

  animation: popIn 1s forwards;
  animation-delay: 0.5s;
  margin-top: 100px;
  opacity: 0;
  transform: scale(1);

  &.card1 {
    animation-delay: 0.5s;
  }

  &.card2 {
    animation-delay: 1s;
  }

  &.card3 {
    animation-delay: 1.5s;
  }

  &.card4 {
    animation-delay: 2s;
  }


  @keyframes popIn {
    0% {
      opacity: 0;
      margin-top: 100px;
      filter: brightness(1);
      transform:scale(1);
    }
    85%{
      margin-top: 13px;
      filter: brightness(1.7);
      transform:scale(1.07);
    }
    100% {
      opacity: 1;
      margin-top: 13px;
      filter: brightness(1);
      transform:scale(1);
    }
  }
`;

const ChampionImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const BGOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent, rgba(0, 0, 0, 0.6));
`;

const PlayerInfoContainer = styled.div`
  position: absolute;
  top: 5px;
  width: 100%;
`;

const PlayerName = styled.div`
  font-size: 23px;
  font-family: Lato;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
`;

const ChampionName = styled.div`
  font-size: 16px;
  font-family: Lato;
  color: white;
  opacity: 0.7;
`;

const StatContainer = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
`;

const StatNumber = styled.div`
  font-family: Colus;
  font-size: 35px;
  color: white;
`;

const StatName = styled.div`
  font-family: Colus;
  font-size: 16px;
  color: white;
  opacity: 0.7;
`;

export interface Props {
  overmindSummary: OvermindSummaryDBModel;
}

export interface HighlightStat {
  player: OvermindCharacterSummary;
  statNumber: number;
  statName: string;
}

interface PlayerDifference extends HighlightStat {
  difference: number;
}

export function Highlights(props: Props) {
  const championInfoContext = useContext(ChampionInfoContext);

  function getHighlightPlayers() {
    let totalKills = 0;
    let totalDamage = 0;
    let totalDamageTaken = 0;

    let bestKills = 0;
    let bestKillsPlayer: OvermindCharacterSummary = null;

    let bestKillStreak = 0;
    let bestKillStreakPlayer: OvermindCharacterSummary = null;

    let bestLongestLife = 0;
    let bestLongestLifePlayer: OvermindCharacterSummary = null;

    let bestDamage = 0;
    let bestDamagePlayer: OvermindCharacterSummary = null;

    let bestDamageTaken = 0;
    let bestDamageTakenPlayer: OvermindCharacterSummary = null;

    let secondBestKills = 0;
    let secondBestDamage = 0;
    let secondBestDamageTaken = 0;
    let secondBestKillStreak = 0;
    let secondLongestLife = 0;

    props.overmindSummary.characterSummaries.forEach((player) => {
      totalKills += player.kills;
      totalDamage += player.damageApplied;
      totalDamageTaken += player.damageTaken;

      if (player.kills >= bestKills) {
        secondBestKills = bestKills;
        bestKills = player.kills;
        bestKillsPlayer = player;
      }

      if (player.damageApplied >= bestDamage) {
        secondBestDamage = bestDamage;
        bestDamage = player.damageApplied;
        bestDamagePlayer = player;
      }

      if (player.damageTaken >= bestDamageTaken) {
        secondBestDamageTaken = bestDamageTaken;
        bestDamageTaken = player.damageTaken;
        bestDamageTakenPlayer = player;
      }

      if (player.longestKillStreak >= bestKillStreak) {
        secondBestKillStreak = bestKillStreak;
        bestKillStreak = player.longestKillStreak;
        bestKillStreakPlayer = player;
      }

      if (player.longestLife >= bestLongestLife) {
        secondLongestLife = bestLongestLife;
        bestLongestLife = player.longestLife;
        bestLongestLifePlayer = player;
      }
    });

    // Run through a second time to ensure we actually got second best
    if (!secondBestKills || !secondBestDamage || !secondBestDamageTaken || !secondBestKillStreak || !secondLongestLife) {
      props.overmindSummary.characterSummaries.forEach((player) => {
        if (player.kills < bestKills && player.kills > secondBestKills) {
          secondBestKills = player.kills;
        }

        if (player.longestKillStreak < bestKillStreak && player.longestKillStreak > secondBestKillStreak) {
          secondBestKillStreak = player.longestKillStreak;
        }

        if (player.damageApplied < bestDamage && player.damageApplied > secondBestDamage) {
          secondBestDamage = player.damageApplied;
        }

        if (player.damageTaken < bestDamageTaken && player.damageTaken > secondBestDamageTaken) {
          secondBestDamageTaken = player.damageTaken;
        }

        if (player.longestLife < bestLongestLife && player.longestLife > secondLongestLife) {
          secondLongestLife = player.longestLife;
        }
      });
    }

    // Get percentage differences
    const killDifference: PlayerDifference = {
      player: bestKillsPlayer,
      statName: 'kills',
      statNumber: bestKillsPlayer.kills,
      difference: (bestKills / totalKills) - (secondBestKills / totalKills)
    };
    const damageDifference: PlayerDifference = {
      player: bestDamagePlayer,
      statName: 'total damage',
      statNumber: bestDamagePlayer.damageApplied,
      difference: (bestDamage / totalDamage) - (secondBestDamage / totalDamage)
    };
    const damageTakenDifference: PlayerDifference = {
      player: bestDamageTakenPlayer,
      statName: 'damage taken',
      statNumber: bestDamageTakenPlayer.damageTaken,
      difference: (bestDamageTaken / totalDamageTaken) - (secondBestDamageTaken / totalDamageTaken)
    };
    const killStreakDifference: PlayerDifference = {
      player: bestKillStreakPlayer,
      statName: 'kill streak',
      statNumber: bestKillStreakPlayer.longestKillStreak,
      difference: 1 - (secondBestKillStreak / bestKillStreak),
    };
    const longestLifeDifference: PlayerDifference = {
      player: bestLongestLifePlayer,
      statName: 'longest life',
      statNumber: bestLongestLifePlayer.longestLife,
      difference: 1 - (secondLongestLife / bestLongestLife)
    };

    const sortedHighlightStats: HighlightStat[] = [
      killDifference,
      damageDifference,
      damageTakenDifference,
      killStreakDifference,
      longestLifeDifference,
    ].sort((a, b) => b.difference - a.difference)
    .map(p => ({
      player: p.player,
      statName: p.statName,
      statNumber: p.statNumber,
    }));

    return sortedHighlightStats;
  }

  function getChampionInfo(player: OvermindCharacterSummary) {
    const champion = championInfoContext.champions.find(champion => champion.id === player.classID);
    const costume = championInfoContext.championCostumes.find(costume => costume.id === player.raceID);

    return {
      ...champion,
      costume,
    };
  }

  function renderHighlight(p: HighlightStat, className: string) {
    const championInfo = getChampionInfo(p.player);
    return (
      <HighlightContainer className={className}>
        <ChampionImage src={championInfo && championInfo.costume ? championInfo.costume.cardImageURL : ''} />
        <BGOverlay />
        <PlayerInfoContainer>
          <PlayerName>{p.player.userName}</PlayerName>
          <ChampionName>{championInfo ? championInfo.name : ''}</ChampionName>
        </PlayerInfoContainer>
        <StatContainer>
          <StatNumber>
            {p.statName === 'longest life' ? formatTime(p.statNumber) : Math.round(p.statNumber).printWithSeparator(',')}
          </StatNumber>
          <StatName>{p.statName}</StatName>
        </StatContainer>
      </HighlightContainer>
    );
  }

  const highlightPlayers = getHighlightPlayers();
  return (
    <Container>
      {renderHighlight(highlightPlayers[0], 'card1')}
      {renderHighlight(highlightPlayers[1], 'card2')}
      {renderHighlight(highlightPlayers[2], 'card3')}
      {renderHighlight(highlightPlayers[3], 'card4')}
    </Container>
  );
}
