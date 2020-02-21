/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import {
  IMatchmakingUpdate,
  MatchmakingUpdateType,
  MatchmakingServerReady,
  MatchmakingKickOff,
  MatchmakingError,
  ActiveMatchServer,
} from '@csegames/library/lib/hordetest/graphql/schema';
import { TimerRef, startTimer, endTimer } from '@csegames/library/lib/_baseGame/utils/timerUtils';
import { preloadQueryEvents } from '../fullscreen/Preloader';

export enum PlayerNumberMode {
  SixMan,
  TenMan,
}

export function onMatchmakingUpdate(callback: (matchmakingUpdate: IMatchmakingUpdate) => any): EventHandle {
  return game.on('subscription-matchmakingUpdates', callback);
}

export const REENTER_MATCHMAKING_ERROR: number = 1007;
export const SOMEONE_DISCONNECTED_MATCHMAKING_ERROR: number = 1001;
export const SOMEONE_DISCONNECTED_WEBSOCKET_ERROR: number = 1011;
export const MATCH_FAILED_ERROR: number = 1002;
export const MATCH_CANCELED_ERROR: number = 1003;
export const NO_SERVERS_ERROR: number = 1005;

const activeMatchQuery = gql`
  query ActiveMatchQuery {
    activeMatchServer {
      serverHost
      serverPort
    }
  }
`;

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
        serializedTeamMates
      }

      ... on MatchmakingError {
        message
        code
      }
    }
  }
`;

export interface ContextState {
  // MatchmakingEnter
  isEntered: boolean;
  timeSearching: number;

  // MatchmakingServerReady || activeMatchServer gql query
  host: string;
  port: number;
  isWaitingOnServer: boolean;

  // MatchmakingKickOff
  matchID: string;
  secondsToWait: number;
  teamMates: string;

  // Error
  error: string;
  errorCode: number

  selectedPlayerNumberMode: PlayerNumberMode;
}

export interface ContextFunctions {
  onEnterMatchmaking: () => void;
  onCancelMatchmaking: () => void;
  onWaitingForServerHandled: () => void;
  clearMatchmakingContext: () => void;
}

export type MatchmakingContextState = ContextState & ContextFunctions;

export const getDefaultMatchmakingContextState = (): ContextState => ({
  isEntered: false,
  host: '',
  port: 0,
  matchID: null,
  secondsToWait: 0,
  teamMates: null,
  error: null,
  errorCode: 0,
  isWaitingOnServer: false,
  timeSearching: 0,
  selectedPlayerNumberMode: PlayerNumberMode.TenMan,
});

export const MatchmakingContext = React.createContext({
  ...getDefaultMatchmakingContextState(),
  onEnterMatchmaking: () => {},
  onCancelMatchmaking: () => {},
  onWaitingForServerHandled: () => {},
  clearMatchmakingContext: () => null,
} as MatchmakingContextState);

export class MatchmakingContextProvider extends React.Component<{}, ContextState> {
  private isInitialQuery: boolean = true;
  private timeSearchingUpdateHandle: TimerRef = null
  private kickOffTimeout: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultMatchmakingContextState(),
    }
  }

  public componentWillUnmount() {
    this.endSearchingTimer();

    window.clearTimeout(this.kickOffTimeout);
  }

  public render() {
    return (
      <MatchmakingContext.Provider
        value={{
          ...this.state,
          onEnterMatchmaking: this.onEnterMatchmaking,
          onCancelMatchmaking: this.onCancelMatchmaking,
          onWaitingForServerHandled: this.onWaitingForServerHandled,
          clearMatchmakingContext: this.clearMatchmakingContext,
        }}>
        <GraphQL
          query={activeMatchQuery}
          onQueryResult={this.handleQueryResult}
          subscription={subscription}
          subscriptionHandler={this.handleSubscription}
        />
        {this.props.children}
      </MatchmakingContext.Provider>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<{ activeMatchServer: ActiveMatchServer }>) => {
    if (!graphql || !graphql.data) {
      // Query failed but we don't want to hold up loading. In future, handle this a little better,
      // maybe try to refetch a couple times and if not then just continue on the flow.

      this.onDonePreloading(false);
      return graphql;
    }

    if (!graphql.data.activeMatchServer) {
      this.onDonePreloading(true);
      return;
    }

    const activeMatchServer = graphql.data.activeMatchServer;
    console.log(`Checked active match and got back ${activeMatchServer.serverHost}:${activeMatchServer.serverPort}`);
    this.setState({ host: activeMatchServer.serverHost, port: activeMatchServer.serverPort });
    this.onDonePreloading(true);
    return graphql;
  }

  private handleSubscription = (result: SubscriptionResult<{ matchmakingUpdates: IMatchmakingUpdate }>, data: any) => {
    if (!result || !result.data || !result.data.matchmakingUpdates) return data;

    const matchmakingUpdate = result.data.matchmakingUpdates;
    switch (matchmakingUpdate.type) {
      case MatchmakingUpdateType.ServerReady: {
        this.handleMatchmakingServerReady(matchmakingUpdate as MatchmakingServerReady);
        break;
      }

      case MatchmakingUpdateType.KickOff: {
        this.handleMatchmakingKickOff(matchmakingUpdate as MatchmakingKickOff);
        break;
      }

      case MatchmakingUpdateType.Error: {
        this.handleMatchmakingError(matchmakingUpdate as MatchmakingError);
        break;
      }
    }
  }

  private handleMatchmakingServerReady = (matchmakingUpdate: MatchmakingServerReady) => {
    if (!matchmakingUpdate) {
      console.error('Tried to call handleMatchmakingServerReady with an invalid matchmakingUpdate');
      return;
    }

    const { host, port } = matchmakingUpdate;
    this.setState({ host, port, isEntered: false, isWaitingOnServer: false, timeSearching: 0 }, () => {
      this.triggerMatchmakingUpdate(matchmakingUpdate);
    });
  }

  private handleMatchmakingKickOff = (matchmakingUpdate: MatchmakingKickOff) => {
    if (!matchmakingUpdate) {
      console.error('Tried to call handleMatchmakingKickOff with an invalid matchmakingUpdate');
      return;
    }

    const { matchID, secondsToWait, serializedTeamMates } = matchmakingUpdate as MatchmakingKickOff;
    this.setState({
      matchID,
      secondsToWait,
      teamMates: serializedTeamMates,
      isWaitingOnServer: true,
      timeSearching: 0,
    }, () => {
      this.triggerMatchmakingUpdate(matchmakingUpdate);
      this.endSearchingTimer();
    });
  }

  private handleMatchmakingError = (matchmakingUpdate: MatchmakingError) => {
    if (!matchmakingUpdate) {
      console.error('Tried to call handleMatchmakingError with an invalid matchmaking update');
      return;
    }

    const { message, code } = (matchmakingUpdate as MatchmakingError);
    if (game.isConnectedOrConnectingToServer) {
      console.error(`Received matchmaking error ${code} ${message}. In a game or connecting to one, ignoring it`);
    } else {
      var shouldFire = false;
      switch(code)
      {
        case SOMEONE_DISCONNECTED_MATCHMAKING_ERROR:
          // Matchmaking had them marked disconnected and they never returned so they were removed from the match
          shouldFire = this.state.isEntered
          break;
        case SOMEONE_DISCONNECTED_WEBSOCKET_ERROR:
          // Someone in our warband lost their websocket.
        case MATCH_CANCELED_ERROR:
          // Someone in your warband canceled the matchmaking.
          break;
        case MATCH_FAILED_ERROR:
          // General failure
          shouldFire = true;
          break;
        case NO_SERVERS_ERROR:
          // We timed out on finding a server
          shouldFire = this.state.isWaitingOnServer
          break;
        case REENTER_MATCHMAKING_ERROR:
          // We actually need to just reenter matchmaking here cause the match failed to kick off
          shouldFire = true;
          break;
      }
      if (shouldFire) {
        this.setState({ error: message, isEntered: false, isWaitingOnServer: false, timeSearching: 0 }, () => {
          this.triggerMatchmakingUpdate(matchmakingUpdate);
          this.endSearchingTimer();
        });
      }
      else {
        console.log(`Received matchmaking error ${code} ${message}. Not firing cause bad state`) 
      }
    }
  }

  private onEnterMatchmaking = () => {
    console.log("Matchmaking context understands we have entered matchmaking");
    this.setState({ isEntered: true, timeSearching: 0 });

    //If someone waits in matchmaking for 30 minutes and nothing happens, then i guess the timer just stops. We probably have bigger problems
    const thirtyMinutes = 30 * 60 * 60 * 1000;

    const interval = 60; //Choosing a non divisable number so the update will appear smoother
    this.timeSearchingUpdateHandle = startTimer(thirtyMinutes, interval, (elapsed, remainingTime) => {
      if (elapsed / 1000 > this.state.timeSearching) {
        this.setState({ timeSearching: this.state.timeSearching + 1 })
      }
    });
  }

  private endSearchingTimer = () => {
    if (this.timeSearchingUpdateHandle) {
      endTimer(this.timeSearchingUpdateHandle);
      this.timeSearchingUpdateHandle = null
    }
  }

  private onCancelMatchmaking = () => {
    console.log("Matchmaking context understands we have canceled matchmaking");
    this.setState({ isEntered: false, timeSearching: 0 });
    this.endSearchingTimer();
  }

  private onWaitingForServerHandled = () => {
    console.log("Matchmaking context understands we are done waiting for a server");
    this.setState({ isWaitingOnServer: false, isEntered: false });
    this.endSearchingTimer();
  }

  private triggerMatchmakingUpdate = (matchmakingUpdate: IMatchmakingUpdate) => {
    game.trigger('subscription-matchmakingUpdates', matchmakingUpdate);
  }

  private onDonePreloading = (isSuccessful: boolean) => {
    if (this.isInitialQuery) {
      game.trigger(preloadQueryEvents.matchmakingContext, isSuccessful);
      this.isInitialQuery = false;
    }
  }

  private clearMatchmakingContext = () => {
    console.log('Clearing matchmaking context');
    this.setState({ ...getDefaultMatchmakingContextState() });
  }
}
