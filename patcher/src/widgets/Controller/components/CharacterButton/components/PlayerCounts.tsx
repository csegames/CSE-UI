/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MetricsData } from '@csegames/library/lib/_baseGame/graphql/schema';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

const PlayerCount = styled.span`
  font-size: 12px;
`;

function query(shard: number) {
  return `
      {
        metrics {
          currentPlayerCount(shard: ${shard}) {
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
  shard: number;
  host: string;
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
      <div>
        <PlayerCount style={{ color: '#FF8080', marginRight: 10 }}>{this.state.playerCountA} A</PlayerCount>
        <PlayerCount style={{ color: '#92E989', marginRight: 10 }}>{this.state.playerCountT} T</PlayerCount>
        <PlayerCount style={{ color: '#6DB9D9' }}>{this.state.playerCountV} V</PlayerCount>
        <GraphQL
          query={{
            query: query(this.props.shard),
            pollInterval: 30000,
            url: this.props.host + '/graphql',
          }}
          onQueryResult={this.handleQueryResult}
        />
      </div>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<QueryType>) => {
    if (graphql.data) {
      const currentPlayerCount = graphql.data.metrics.currentPlayerCount;
      if (currentPlayerCount.arthurian !== this.state.playerCountA) {
        this.setState({ playerCountA: currentPlayerCount.arthurian });
      }
      if (currentPlayerCount.tuatha !== this.state.playerCountT) {
        this.setState({ playerCountT: currentPlayerCount.tuatha });
      }
      if (currentPlayerCount.viking !== this.state.playerCountV) {
        this.setState({ playerCountV: currentPlayerCount.viking });
      }
    }
  }
}

export default PlayerCounts;
