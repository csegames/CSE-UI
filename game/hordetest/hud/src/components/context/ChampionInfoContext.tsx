/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQLResult, GraphQL } from '@csegames/library/lib/_baseGame/graphql/react';
import { ChampionCostumeInfo, ChampionInfo } from '@csegames/library/lib/hordetest/graphql/schema';

const query = gql`
  query ChampionInfoContextQuery {
    championCostumes {
      description
      id
      name
      requiredChampionID
      standingImageURL
      championSelectImageURL
      thumbnailURL
      cardImageURL
      backgroundImageURL
    }

    champions {
      id
      name
      abilities {
        name
        iconClass
        description
      }
    }
  }
`;

export interface ChampionInfoContextState {
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
}

const getDefaultChampionInfoContextState = (): ChampionInfoContextState => ({
  championCostumes: [],
  champions: [],
});

export const ChampionInfoContext = React.createContext(getDefaultChampionInfoContextState());

export enum Champions {
  Berserker = 25,
  Amazon = 26,
  Celt = 27,
  Knight = 28,
}

export class ChampionInfoContextProvider extends React.Component<{}, ChampionInfoContextState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultChampionInfoContextState(),
    };
  }

  public render() {
    return (
      <ChampionInfoContext.Provider value={this.state}>
        <GraphQL query={query} onQueryResult={this.handleQueryResult} />
        {this.props.children}
      </ChampionInfoContext.Provider>
    );
  }

  public componentDidMount() {
  }

  public componentWillUnmount() {
  }

  private handleQueryResult = (query: GraphQLResult<ChampionInfoContextState>) => {
    if (!query || !query.data || !query.data.championCostumes || !query.data.champions) {
      console.error("Missing data, championCostumes, or champions from ChampionInfoContextQuery query");
      return query;
    }

    this.setState({ championCostumes: query.data.championCostumes, champions: query.data.champions });
    return query;
  }
}
