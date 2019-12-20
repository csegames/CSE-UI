/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { OvermindSummaryDBModel, OvermindCharacterSummary } from '@csegames/library/lib/hordetest/graphql/schema';
import { formatTime } from 'lib/timeHelpers';

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
  margin: 13px;
`;

const ChampionImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  object-fit: contain;
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

const PlayerName = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 23px;
  font-family: Lato;
  font-weight: bold;
  color: #fff;
`;

const StatContainer = styled.div`
  position: absolute;
  left: 15px;
  bottom: 15px;
`;

const StatNumber = styled.div`
  font-family: Colus;
  font-size: 35px;
  color: #fff;
`;

const StatName = styled.div`
  font-family: Colus;
  font-size: 18px;
  color: #aaa9a9;
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

  function renderHighlight(p: HighlightStat) {
    return (
      <HighlightContainer>
        <ChampionImage src={'images/fullscreen/character-select/face.png'} />
        <BGOverlay />
        <PlayerName>{p.player.userName}</PlayerName>
        <StatContainer>
          <StatNumber>{p.statName === 'longest life' ? formatTime(p.statNumber) : p.statNumber}</StatNumber>
          <StatName>{p.statName}</StatName>
        </StatContainer>
      </HighlightContainer>
    );
  }

  const highlightPlayers = getHighlightPlayers();
  return (
    <Container>
      {renderHighlight(highlightPlayers[0])}
      {renderHighlight(highlightPlayers[1])}
      {renderHighlight(highlightPlayers[2])}
      {renderHighlight(highlightPlayers[3])}
    </Container>
  );
}
