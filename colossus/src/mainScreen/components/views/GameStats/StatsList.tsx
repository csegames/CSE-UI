/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { OvermindCharacterSummaryGQL, OvermindSummaryGQL } from '@csegames/library/dist/hordetest/graphql/schema';

import { StatsListItem } from './StatsListItem';
import { StatsListHeader } from './StatsListHeader';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';

const Container = 'GameStats-StatsList-Container';

const ListContainer = 'GameStats-StatsList-ListContainer';

export enum SortBy {
  None,
  PlayerName,
  Score,
  Kills,
  KillStreak,
  LongestLife,
  AllyRevives,
  Damage,
  DamageTaken
}

interface State {
  sortBy: SortBy;
  leastToGreatest: boolean;
}

interface ReactProps {}

interface InjectedProps {
  overmindSummary: OvermindSummaryGQL;
}

type Props = ReactProps & InjectedProps;

class AStatsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sortBy: SortBy.Score,
      leastToGreatest: false
    };
  }

  render(): React.ReactNode {
    return (
      <div className={Container}>
        <StatsListHeader
          sortBy={this.state.sortBy}
          leastToGreatest={this.state.leastToGreatest}
          onSortBy={this.onSortBy.bind(this)}
        />
        <div className={ListContainer}>
          {this.getSortedPlayers().map((playerStat, index) => {
            return <StatsListItem key={index} playerStat={playerStat} />;
          })}
        </div>
      </div>
    );
  }

  private onSortBy(nextSortBy: SortBy) {
    if (this.state.sortBy === nextSortBy) {
      if (this.state.leastToGreatest) {
        this.setState({ sortBy: SortBy.None, leastToGreatest: false });
      } else {
        this.setState({ leastToGreatest: true });
      }
      return;
    }

    this.setState({ sortBy: nextSortBy, leastToGreatest: false });
  }

  private getSortedPlayers(): OvermindCharacterSummaryGQL[] {
    const { sortBy, leastToGreatest } = this.state;

    const playerStatsClone = [...this.props.overmindSummary.characterSummaries];
    switch (sortBy) {
      case SortBy.PlayerName: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => b.userName.localeCompare(a.userName));
        } else {
          return playerStatsClone.sort((a, b) => a.userName.localeCompare(b.userName));
        }
      }
      case SortBy.Score: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.score - b.score);
        } else {
          return playerStatsClone.sort((a, b) => b.score - a.score);
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
      case SortBy.AllyRevives: {
        if (leastToGreatest) {
          return playerStatsClone.sort((a, b) => a.reviveAssistCount - b.reviveAssistCount);
        } else {
          return playerStatsClone.sort((a, b) => b.reviveAssistCount - a.reviveAssistCount);
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
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { overmindSummary } = state.gameStats;

  return {
    ...ownProps,
    overmindSummary
  };
}

export const StatsList = connect(mapStateToProps)(AStatsList);
