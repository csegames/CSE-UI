/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { utils } from 'camelot-unchained';

import { FactionColors } from '../constants';
import { SortBy } from './ListHeaderItem';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import TeamScore from './TeamScore';
import { TeamInterface, TeamPlayer } from './ScenarioResultsContainer';

const Container = styled('div')`
  position: relative;
  height: 100%;
  background: url(images/scenario-results/bg.png) no-repeat;
  background-size: cover;
  -webkit-mask-image: url(images/scenario-results/ui-mask.png);
  -webkit-mask-size: cover;
  -webkit-mask-position: bottom;
  -webkit-mask-repeat: no-repeat;
`;

const ListContainer = styled('div')`
  overflow: auto;
  height: 500px;
  padding: 0px 5px 0px 5px;
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 4%);
  &::-webkit-scrollbar {
    width: 7px !important;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #222, #333, #222) !important;
    box-shadow: none !important;
  }
`;

const ItemSpacing = styled('div')`
  margin-bottom: 3px;
`;

const NoDataText = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 18px;
  font-family: Caudex;
  color: white;
`;

export interface ListProps {
  scenarioID: string;
  teams: TeamInterface[];
  players: TeamPlayer[];
  status: {
    loading: boolean;
    lastError: string;
  };
}

export interface ListState {
  selectedSortBy: SortBy;
  leastToGreatest: boolean;
  searchValue: string;
}

class List extends React.Component<ListProps, ListState> {
  private listRef: HTMLDivElement;
  constructor(props: ListProps) {
    super(props);
    this.state = {
      selectedSortBy: SortBy.None,
      leastToGreatest: false,
      searchValue: '',
    };
  }

  public render() {
    const { players, teams, status } = this.props;
    if (!_.isEmpty(players) && !_.isEmpty(teams) && !status.loading && status.lastError === 'OK') {
      const displayedPlayers = this.getDisplayedPlayers();
      return (
        <Container>
          <TeamScore teams={this.props.teams} scenarioID={this.props.scenarioID} />
          <ListHeader onSearchChange={this.onSearchChange} onSortClick={this.onSortClick} {...this.state} />
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            {displayedPlayers.map((player: any, i) => {
              const colors = FactionColors[player.teamID];
              return (
                <ItemSpacing key={i}>
                  <ListItem
                    player={player}
                    searchIncludes={utils.doesSearchInclude(this.state.searchValue, player.displayName)}
                    backgroundColor={colors ? colors.backgroundColor : 'transparent'}
                    scrollTop={this.listRef.scrollTop}
                    listHeight={this.listRef.clientHeight}
                  />
                </ItemSpacing>
              );
            })}
          </ListContainer>
        </Container>
      );
    } else if (status.loading) {
      return (
        <Container>
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            <NoDataText>Fetching data for Scenario...</NoDataText>
          </ListContainer>
        </Container>
      );
    } else if (status.lastError !== 'OK') {
      return (
        <Container>
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            <NoDataText>There was an error fetching data about a recent Scenario...</NoDataText>
            <NoDataText>{status.lastError}</NoDataText>
          </ListContainer>
        </Container>
      );
    } else {
      return (
        <Container>
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            <NoDataText>No data for any recent Scenarios</NoDataText>
          </ListContainer>
        </Container>
      );
    }
  }

  public shouldComponentUpdate(nextProps: ListProps, nextState: ListState) {
    return this.props.scenarioID !== nextProps.scenarioID ||
      this.props.status.loading !== nextProps.status.loading ||
      this.props.status.lastError !== nextProps.status.lastError ||
      this.state.selectedSortBy !== nextState.selectedSortBy ||
      this.state.leastToGreatest !== nextState.leastToGreatest ||
      this.state.searchValue !== nextState.searchValue ||
      !_.isEqual(this.props.players, nextProps.players) ||
      !_.isEqual(this.props.teams, nextProps.teams);
  }

  private getSearchPlayers = () => {
    const players = [...this.props.players];
    const matchingPlayers: TeamPlayer[] = [];
    players.forEach((player, i) => {
      if (utils.doesSearchInclude(this.state.searchValue, player.displayName)) {
        matchingPlayers.push(player);
        players[i] = null;
      }
    });

    return [...matchingPlayers, ..._.compact(players)];
  }

  private getDisplayedPlayers = () => {
    const players = [...this.props.players];
    const sortedPlayers = this.state.searchValue === '' ? this.state.selectedSortBy !== SortBy.None ?
      players.sort((a: TeamPlayer, b: TeamPlayer) => this.sortPlayersByStat(a, b, this.state)) :
        players : this.getSearchPlayers();
    return sortedPlayers;
  }

  private sortPlayersByStat = (a: TeamPlayer, b: TeamPlayer, state: ListState) => {
    if (state.selectedSortBy === SortBy.Name) {
      // sorting by name
      if (state.leastToGreatest) {
        return b.displayName.localeCompare(a.displayName);
      }
      return a.displayName.localeCompare(b.displayName);
    } else if (state.selectedSortBy === SortBy.Faction) {
      if (state.leastToGreatest) {
        return b.teamID.localeCompare(a.teamID);
      }
      return a.teamID.localeCompare(b.teamID);
    } else {
      // sorting by numberz
      if (a && a.damage[state.selectedSortBy] && b && b.damage[state.selectedSortBy]) {
        if (state.leastToGreatest) {
          return a.damage[state.selectedSortBy].anyCharacter -
            b.damage[state.selectedSortBy].anyCharacter;
        }
        return b.damage[state.selectedSortBy].anyCharacter - a.damage[state.selectedSortBy].anyCharacter;
      } else if (state.selectedSortBy === SortBy.Score) {
        if (state.leastToGreatest) {
          return a.score - b.score;
        }
        return b.score - a.score;
      }
    }
  }

  private onSortClick = (sortBy: SortBy, leastToGreatest: boolean) => {
    this.setState({ searchValue: '', selectedSortBy: sortBy, leastToGreatest });
  }

  private onSearchChange = (value: string) => {
    this.setState({ searchValue: value, selectedSortBy: SortBy.None, leastToGreatest: false });
  }
}

export default List;
