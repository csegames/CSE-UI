/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import {
  IMatchmakingUpdate,
  MatchmakingUpdateType,
  MatchmakingServerReady,
  MatchmakingKickOff,
  MatchmakingError,
} from '@csegames/library/lib/hordetest/graphql/schema';
import { Route } from 'components/fullscreen';
import { Error } from 'components/fullscreen/Error';

export function onMatchmakingUpdate(callback: (matchmakingUpdate: IMatchmakingUpdate) => any): EventHandle {
  return game.on('subscription-matchmakingUpdates', callback);
}

const subscription = gql`
  subscription MatchmakingNotificationSubscription {
    matchmakingUpdates {
      type

      ... on MatchmakingServerReady {
        host
        port
      }

      ... on MatchmakingKickOff {
        matchID
        secondsToWait
      }

      ... on MatchmakingError {
        message
      }
    }
  }
`;

export interface MatchmakingContextState {
  // MatchmakingServerReady
  host: string;
  port: number;

  // MatchmakingKickOff
  matchID: string;
  secondsToWait: number;
  teamMates: string;

  // Error
  error: string;
}

const getDefaultMatchmakingContextState = (): MatchmakingContextState => ({
  host: null,
  port: null,
  matchID: null,
  secondsToWait: null,
  teamMates: null,
  error: null,
});

export const MatchmakingContext = React.createContext(getDefaultMatchmakingContextState());

export class MatchmakingContextProvider extends React.Component<{}, MatchmakingContextState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultMatchmakingContextState();
  }

  public render() {
    return (
      <MatchmakingContext.Provider value={this.state}>
        <GraphQL subscription={subscription} subscriptionHandler={this.handleSubscription} />
        {this.props.children}
      </MatchmakingContext.Provider>
    );
  }

  private handleSubscription = (result: SubscriptionResult<{ matchmakingUpdates: IMatchmakingUpdate }>, data: any) => {
    if (!result.data && !result.data.matchmakingUpdates) return data;

    const matchmakingUpdate = result.data.matchmakingUpdates;
    game.trigger('subscription-matchmakingUpdates', matchmakingUpdate);

    switch (matchmakingUpdate.type) {
      case MatchmakingUpdateType.ServerReady: {
        const { host, port } = matchmakingUpdate as MatchmakingServerReady;

        // CONNECT TO GAME SERVER
        this.setState({ host, port });
        break;
      }

      case MatchmakingUpdateType.KickOff: {
        const { matchID, secondsToWait, serializedTeamMates } = matchmakingUpdate as MatchmakingKickOff;
        this.setState({ matchID, secondsToWait, teamMates: serializedTeamMates  }, () => {
          game.trigger('fullscreen-navigate', Route.ChampionSelect);
        });
        break;
      }

      case MatchmakingUpdateType.Error: {
        const msg = (matchmakingUpdate as MatchmakingError).message;
        this.setState({ error: msg }, () => {
          game.trigger('fullscreen-navigate', Route.Start);
          game.trigger('show-middle-modal', <Error title='Failed' message={msg} errorCode={1003} />);
        });
        break;
      }
    }
  }
}
