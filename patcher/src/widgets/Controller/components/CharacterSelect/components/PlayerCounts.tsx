/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Faction } from '@csegames/camelot-unchained';
import { MetricsData } from '@csegames/camelot-unchained/lib/graphql/schema';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

const PlayerCount = styled('span')`
  font-size: 14px;
  padding-right: ${props => props.faction === Faction.Viking ? '0px' : '10px'};
  color: ${props => props.faction === Faction.Arthurian ? '#FF8080'
    : props.faction === Faction.Viking ? '#6DB9D9'
    : '#92E989'};
`;

const PlayerCountLabel = styled('span')`
  font-size: 14px;
  opacity: 0.5;
  padding-right: 4px;
`;

const PlayerCountsContainer = styled('div')`
  margin-left: 24px;
  margin-top: -24px;
`;

function query(server: string) {
  return `
      {
        metrics {
          currentPlayerCount(server: "${server}") {
            arthurian
            tuatha
            viking
          }
        }
      }
    `;
}

type QueryType = {
  metrics: MetricsData;
};

export interface PlayerCountsProps {
  server: string;
}

export interface PlayerCountsState {
  playerCountA: number;
  playerCountT: number;
  playerCountV: number;
}

class PlayerCounts extends React.PureComponent<PlayerCountsProps, PlayerCountsState> {
  constructor(props: PlayerCountsProps) {
    super(props);
    this.state = {
      playerCountA: 0,
      playerCountT: 0,
      playerCountV: 0,
    };
  }

  public render() {
    return (
      <PlayerCountsContainer>
        <PlayerCountLabel>Players:</PlayerCountLabel>
        <PlayerCount faction={Faction.Arthurian}>{this.state.playerCountA} A</PlayerCount>
        <PlayerCount faction={Faction.TDD}>{this.state.playerCountT} T</PlayerCount>
        <PlayerCount faction={Faction.Viking}>{this.state.playerCountV} V</PlayerCount>
        <GraphQL query={{
        query: query(this.props.server),
        pollInterval: 30000,
        }} onQueryResult={this.handleQueryResult} />
      </PlayerCountsContainer>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<QueryType>) => {
    if (graphql.data) {
      const currentPlayerCount = graphql.data.metrics.currentPlayerCount;
      if (currentPlayerCount.arthurian !== this.state.playerCountA) {
        this.setState({playerCountA: currentPlayerCount.arthurian});
      }
      if (currentPlayerCount.tuatha !== this.state.playerCountT) {
        this.setState({playerCountT: currentPlayerCount.tuatha});
      }
      if (currentPlayerCount.viking !== this.state.playerCountV) {
        this.setState({playerCountV: currentPlayerCount.viking});
      }
    }
  }
}

export default PlayerCounts;
