/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SortBy } from './StatsList';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'GameStats-StatsListHeader-Container';
const PreviewImageSpacing = 'GameStats-StatsListHeader-PreviewImageSpacing';
const ChampionInfo = 'GameStats-StatsListHeader-ChampionInfo';
const Section = 'GameStats-StatsListHeader-Section';

const ButtonSpacing = 'GameStats-StatsListHeader-ButtonSpacing';

const StringIDGameStatsHeaderPlayer = 'GameStatsHeaderPlayer';
const StringIDGameStatsHeaderScore = 'GameStatsHeaderScore';
const StringIDGameStatsHeaderKills = 'GameStatsHeaderKills';
const StringIDGameStatsHeaderKillStreak = 'GameStatsHeaderKillStreak';
const StringIDGameStatsHeaderLongestLife = 'GameStatsHeaderLongestLife';
const StringIDGameStatsHeaderAlliesRevived = 'GameStatsHeaderAlliesRevived';
const StringIDGameStatsHeaderTotalDamage = 'GameStatsHeaderTotalDamage';
const StringIDGameStatsHeaderDamageTaken = 'GameStatsHeaderDamageTaken';

export interface ReactProps {
  sortBy: SortBy;
  leastToGreatest: boolean;
  onSortBy: (sortBy: SortBy) => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export class AStatsListHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private onPlayerClick() {
    this.props.onSortBy(SortBy.PlayerName);
  }

  private onScoreClick() {
    this.props.onSortBy(SortBy.Score);
  }

  private onKillsClick() {
    this.props.onSortBy(SortBy.Kills);
  }

  private onKillStreakClick() {
    this.props.onSortBy(SortBy.KillStreak);
  }

  private onLongestLifeClick() {
    this.props.onSortBy(SortBy.LongestLife);
  }

  private onAllyRevivesClick() {
    this.props.onSortBy(SortBy.AllyRevives);
  }

  private onTotalDamageClick() {
    this.props.onSortBy(SortBy.Damage);
  }

  private onDamageTakenClick() {
    this.props.onSortBy(SortBy.DamageTaken);
  }

  private renderArrow(sortBy: SortBy): JSX.Element {
    if (sortBy !== this.props.sortBy) return null;

    if (this.props.leastToGreatest) {
      return <span className='fs-icon-misc-caret-up' />;
    } else {
      return <span className='fs-icon-misc-caret-down' />;
    }
  }

  public render() {
    return (
      <div className={Container}>
        <div className={ChampionInfo} onClick={this.onPlayerClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderPlayer, this.props.stringTable)}{' '}
          {this.renderArrow(SortBy.PlayerName)}
        </div>
        <div className={PreviewImageSpacing} />
        <div className={Section} onClick={this.onScoreClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderScore, this.props.stringTable)} {this.renderArrow(SortBy.Score)}
        </div>
        <div className={Section} onClick={this.onKillsClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderKills, this.props.stringTable)} {this.renderArrow(SortBy.Kills)}
        </div>
        <div className={Section} onClick={this.onKillStreakClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderKillStreak, this.props.stringTable)}{' '}
          {this.renderArrow(SortBy.KillStreak)}
        </div>
        <div className={Section} onClick={this.onLongestLifeClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderLongestLife, this.props.stringTable)}{' '}
          {this.renderArrow(SortBy.LongestLife)}
        </div>
        <div className={Section} onClick={this.onAllyRevivesClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderAlliesRevived, this.props.stringTable)}{' '}
          {this.renderArrow(SortBy.AllyRevives)}
        </div>
        <div className={Section} onClick={this.onTotalDamageClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderTotalDamage, this.props.stringTable)}{' '}
          {this.renderArrow(SortBy.Damage)}
        </div>
        <div className={Section} onClick={this.onDamageTakenClick.bind(this)}>
          {getStringTableValue(StringIDGameStatsHeaderDamageTaken, this.props.stringTable)}{' '}
          {this.renderArrow(SortBy.DamageTaken)}
        </div>
        <div className={ButtonSpacing} />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const StatsListHeader = connect(mapStateToProps)(AStatsListHeader);
