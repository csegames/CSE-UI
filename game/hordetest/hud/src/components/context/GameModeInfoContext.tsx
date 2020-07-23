/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQLResult, GraphQL } from '@csegames/library/lib/_baseGame/graphql/react';
import { GameModeInfo } from '@csegames/library/lib/hordetest/graphql/schema';
import { preloadQueryEvents } from '../fullscreen/Preloader';

const query = gql`
  query gameModeInfoQuery {
    gameModeInfo {
      id
      name
      isDevMode
      isDefaultMode
      teamSize
    }
  }
`;

export interface GameModeInfoContextState {
  gameModes: GameModeInfo[];
}

export const getDefaultGameModeInfoContextState = (): GameModeInfoContextState => ({
  gameModes: [],
});

export const GameModeInfoContext = React.createContext(getDefaultGameModeInfoContextState());


export class GameModeInfoContextProvider extends React.Component<{}, GameModeInfoContextState> {
  private isInitialQuery: boolean = true;
  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultGameModeInfoContextState(),
    };
  }

  public render() {
    let gql = <GraphQL query={query} onQueryResult={this.handleQueryResult} />;
    console.log(gql);
    return (
      <GameModeInfoContext.Provider value={this.state}>
        <GraphQL query={query} onQueryResult={this.handleQueryResult} />
        {this.props.children}
      </GameModeInfoContext.Provider>
    );
  }

  private handleQueryResult = (query: GraphQLResult<GameModeInfoContextState>) => {
    console.log('handleQueryResult');
    if (!query || !query.data || !query.data.gameModes) {
      console.error("Missing data or gameModes from GameModeInfoContextQuery query");

      // Query failed but we don't want to hold up loading. In future, handle this a little better,
      // maybe try to refetch a couple times and if not then just continue on the flow.
      this.onDonePreloading(false);
      return query;
    }

    this.setState({
      gameModes: query.data.gameModes,
    });
    this.onDonePreloading(true);
    return query;
  }

  private onDonePreloading = (isSuccessful: boolean) => {
    if (this.isInitialQuery) {
      game.trigger(preloadQueryEvents.gameModeInfoContext, isSuccessful);
      this.isInitialQuery = false;
    }
  }
}
