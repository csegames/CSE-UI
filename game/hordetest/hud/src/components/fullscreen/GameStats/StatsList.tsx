/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { OvermindSummaryDBModel } from '@csegames/library/lib/hordetest/graphql/schema';

import { StatsListItem } from './StatsListItem';
import { StatsListHeader } from './StatsListHeader';

const Container = styled.div`
  height: 100%;
`;

const ListContainer = styled.div`
  height: 100%;
  background: linear-gradient(to bottom, black, rgba(0, 0, 0, 0.1));
`;

export interface Props {
  overmindSummary: OvermindSummaryDBModel;
  thumbsUp: { [characterID: string]: string[] };
  onThumbsUpClick: (characterID: string) => void;
  onRevokeClick: (characterID: string) => void;
}

export enum SortBy {
  None,
  PlayerName,
  Kills,
  KillStreak,
  LongestLife,
  Damage,
  DamageTaken,
}

export function StatsList(props: Props) {
  const [sortBy, setSortBy] = useState(SortBy.None);
  const [leastToGreatest, setLeastToGreatest] = useState(false);

  function onSortBy(nextSortBy: SortBy) {
    if (sortBy === nextSortBy) {
      if (leastToGreatest) {
        setSortBy(SortBy.None);
        setLeastToGreatest(false);
      } else {
        setLeastToGreatest(true);
      }
      return;
    }

    setSortBy(nextSortBy);
    setLeastToGreatest(false);
  }

  function getSortedPlayers() {
    const playerStatsClone = [...props.overmindSummary.characterSummaries];
    switch(sortBy) {
      case SortBy.PlayerName: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => b.userName.localeCompare(a.userName));
        } else {
          return playerStatsClone.sort((a, b) => a.userName.localeCompare(b.userName));
        }
      }
      case SortBy.Kills: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.kills - b.kills);
        } else {
          return playerStatsClone.sort((a, b) => b.kills - a.kills);
        }
      }
      case SortBy.KillStreak: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.longestKillStreak - b.longestKillStreak);
        } else {
          return playerStatsClone.sort((a, b) => b.longestKillStreak - a.longestKillStreak);
        }
      }
      case SortBy.LongestLife: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.longestLife - b.longestLife);
        } else {
          return playerStatsClone.sort((a, b) => b.longestLife - a.longestLife);
        }
      }
      case SortBy.Damage: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.damageApplied - b.damageApplied);
        } else {
          return playerStatsClone.sort((a, b) => b.damageApplied - a.damageApplied);
        }
      }
      case SortBy.DamageTaken: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.damageTaken - b.damageTaken);
        } else {
          return playerStatsClone.sort((a, b) => b.damageTaken - a.damageTaken);
        }
      }
      default: {
        return playerStatsClone;
      }
    }
  }

  return (
    <Container>
      <StatsListHeader sortBy={sortBy} leastToGreatest={leastToGreatest} onSortBy={onSortBy} />
      <ListContainer>
        {getSortedPlayers().map((playerStat) => {
          return (
            <StatsListItem
              playerStat={playerStat}
              players={props.overmindSummary.characterSummaries}
              thumbsUp={props.thumbsUp}
              onThumbsUpClick={props.onThumbsUpClick}
              onRevokeClick={props.onRevokeClick}
            />
          );
        })}
      </ListContainer>
    </Container>
  );
}
