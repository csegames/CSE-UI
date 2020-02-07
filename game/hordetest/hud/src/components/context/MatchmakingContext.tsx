/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { query } from '@csegames/library/lib/_baseGame/graphql/query'
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
import { webAPI } from '@csegames/library/lib/hordetest';
import { RequestResult } from '@csegames/library/lib/_baseGame';

import { Route, fullScreenNavigateTo } from 'context/FullScreenNavContext';
import { ErrorComponent } from 'components/fullscreen/Error';
import { ReconnectComponent } from 'components/fullscreen/Reconnect';
import { preloadQueryEvents } from '../fullscreen/Preloader';

export enum PlayerNumberMode {
  SixMan,
  TenMan,
}

export function onMatchmakingUpdate(callback: (matchmakingUpdate: IMatchmakingUpdate) => any): EventHandle {
  return game.on('subscription-matchmakingUpdates', callback);
}

const REENTER_MATCHMAKING_ERROR: number = 1007;
const SOMEONE_DISCONNECTED_MATCHMAKING_ERROR:number = 1001;
const SOMEONE_DISCONNECTED_WEBSOCKET_ERROR:number = 1011;
const MATCH_FAILED_ERROR:number = 1002;
const MATCH_CANCELED_ERROR:number = 1003;
const NO_SERVERS_ERROR:number = 1005;

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

export interface MatchmakingContextState {
  // MatchmakingEnter
  isEntered: boolean;
  timeSearching: number;
  onEnterMatchmaking: () => void;
  onCancelMatchmaking: () => void;
  onWaitingForServerHandled: () => void;
  callEnterMatchmaking: () => Promise<RequestResult>,
  callCancelMatchmaking: () => Promise<RequestResult>,
  tryConnect: (host: string, port: number, tries: number, onConnect?: () => void) => void;

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

const getDefaultMatchmakingContextState = (): MatchmakingContextState => ({
  isEntered: false,
  onEnterMatchmaking: () => {},
  onCancelMatchmaking: () => {},
  onWaitingForServerHandled: () => {},
  callEnterMatchmaking: () => null,
  callCancelMatchmaking: () => null,
  tryConnect: () => null,
  host: null,
  port: null,
  matchID: null,
  secondsToWait: null,
  teamMates: null,
  error: null,
  errorCode: 0,
  isWaitingOnServer: false,
  timeSearching: 0,
  selectedPlayerNumberMode: PlayerNumberMode.TenMan,
});

export const MatchmakingContext = React.createContext(getDefaultMatchmakingContextState());

export class MatchmakingContextProvider extends React.Component<{}, MatchmakingContextState> {
  private isInitialQuery: boolean = true;
  private timeSearchingUpdateHandle: TimerRef = null
  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultMatchmakingContextState(),
      tryConnect: this.tryConnect,
      onEnterMatchmaking: this.onEnterMatchmaking,
      onCancelMatchmaking: this.onCancelMatchmaking,
      onWaitingForServerHandled: this.onWaitingForServerHandled,
      callCancelMatchmaking: this.callCancelMatchmaking,
      callEnterMatchmaking: this.callEnterMatchmaking
    }
  }

  public componentWillUnmount() {
    this.endSearchingTimer();
  }

  public render() {
    return (
      <MatchmakingContext.Provider value={this.state}>
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

    if (!game.isConnectedOrConnectingToServer && activeMatchServer.serverHost && activeMatchServer.serverPort) {
      // We have an active match running, but we are not connected or connecting to a server. Require users to reconnect.
      game.trigger('show-middle-modal', <ReconnectComponent />, true);
    }
    else {
      console.log(`Not opening reconnect modal. On server? ${game.isConnectedOrConnectingToServer}`);
    }

    this.onDonePreloading(true);
    return graphql;
  }

  private handleSubscription = (result: SubscriptionResult<{ matchmakingUpdates: IMatchmakingUpdate }>, data: any) => {
    if (!result.data || !result.data.matchmakingUpdates) return data;

    const matchmakingUpdate = result.data.matchmakingUpdates;
    game.trigger('subscription-matchmakingUpdates', matchmakingUpdate);

    switch (matchmakingUpdate.type) {
      case MatchmakingUpdateType.ServerReady: {
        const { host, port } = matchmakingUpdate as MatchmakingServerReady;

        this.setState({ host, port, isEntered: false, isWaitingOnServer: false, timeSearching: 0 });
        if (!game.isConnectedOrConnectingToServer) {
          console.log(`Received matchmaking server ready. Calling connect ${host}:${port}`);

          //We dont clear any forced loading screens here because we will clear the force during connection
          this.tryConnect(host, port, 0);
          game.trigger('hide-fullscreen');
          this.endSearchingTimer();
        }
        else {
          console.error(`Received matchmaking server ready for ${host}:${port}. In a game or connecting to one, ignoring it`)
        }
        break;
      }

      case MatchmakingUpdateType.KickOff: {
        const { matchID, secondsToWait, serializedTeamMates } = matchmakingUpdate as MatchmakingKickOff;
        this.setState({ matchID, secondsToWait, teamMates: serializedTeamMates, isWaitingOnServer: true, timeSearching: 0  }, () => {
          this.endSearchingTimer();

          if (game.isConnectedOrConnectingToServer) {
            console.error(`Received matchmaking kickoff. In a game or already connecting to one, ignoring it`)
            return;
          }

          console.log(`Received matchmaking kickoff. ${serializedTeamMates ? JSON.parse(serializedTeamMates).length : null} mates, ${secondsToWait} timeout`);
          console.log(serializedTeamMates);
          fullScreenNavigateTo(Route.ChampionSelect);
        });
        break;
      }

      case MatchmakingUpdateType.Error: {
        const { message, code } = (matchmakingUpdate as MatchmakingError);
        if (game.isConnectedOrConnectingToServer) {
          console.error(`Received matchmaking error ${code} ${message}. In a game or connecting to one, ignoring it`)
        }
        else {
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
              //TODO: Dont show. figur eout later
              // if (useContext(WarbandContext).groupID) {
              //   shouldFire = true;
              // }
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
              // console.log(`Received matchmaking error ${code} ${message}. Someone must have dropped on kick off. Attempting to reenter matchmaking`)
              shouldFire = true;
              //TODO: Grab warband context state and check if leader and only fire if leader

              // this.callEnterMatchmaking().then((res) => {
              //   if (res.ok) {
              //     this.onEnterMatchmaking();
              //   }
              //   else {
              //     console.error("Failed to reenter matchmaking!");
              //   }
              // }).catch(() => { console.error("Failed to call reenter matchmaking")});
                //TODO: Tell the ready button
              break;
          }
          if (shouldFire) {
            this.setState({ error: message, isEntered: false, isWaitingOnServer: false, timeSearching: 0 }, () => {
              this.endSearchingTimer();
              console.log(`Received matchmaking error ${code} ${message}. Showing fullscreen, navigating to start and popping up error`)
              game.trigger("reset-fullscreen");
              game.trigger('show-middle-modal', <ErrorComponent title='Matchmaking Failure' message={message} errorCode={code} />, true);
            });
          }
          else {
            console.log(`Received matchmaking error ${code} ${message}. Not firing cause bad state`) 
          }
        }
        break;
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

  private tryConnect = (host: string, port: number, tries: number) => {
    game.connectToServer(host, port);
    window.setTimeout(() => this.checkConnected(host, port, ++tries), 500);
  }

  private checkConnected = async (host: string, port: number, tries: number) => {
    if (game.isConnectedToServer) {
      // We already have connected successfully
      this.setState({ isWaitingOnServer:false });
      return;
    }

    if (game.isConnectedOrConnectingToServer) {
      // check again in another timeout
      window.setTimeout(() => this.checkConnected(host, port, tries), 500);
      return;
    }

    // give up after 15 seconds / 30 tries
    if (tries > 30) {
      game.trigger('show-middle-modal',
        <ErrorComponent title='Failed' message={'Failed to establish connection to game server.'} errorCode={1010} />, true);
      game.trigger('reset-fullscreen');
      return;
    }

    try {
      const response = await query<any>(gql`
        {
          serverState(server:"${host}:${port}", match: "${this.state.matchID}") {
            status
          }
        }`,   {
        url: game.webAPIHost + '/graphql',
        requestOptions: {
          headers: {
            Authorization: `Bearer ${game.accessToken}`,
            CharacterID: `${game.characterID},`
          },
        },
      });

      const status = response.data.serverState.status;
      if (status === 'Running' || status === 'Reserved') {
        // try again.
        this.tryConnect(host, port, tries);
        return;
      } else {
        // fail out.
        game.trigger('show-middle-modal',
          <ErrorComponent
            title='Failed'
            message={'Failed to establish connection to game server.'}
            errorCode={1011}
          />,
          true);
        // reset back to lobby
        game.trigger('reset-fullscreen');
      }
    } catch (err) {
      // failed to check status... so just fail out
      // reset back to lobby
      console.error(err);
      game.trigger('show-middle-modal',
        <ErrorComponent
          title='Failed'
          message={'Failed to establish connection to game server.'}
          errorCode={1009}
        />,
        true);
      game.trigger('reset-fullscreen');
    }
  }

  private callEnterMatchmaking = async () => {
    if (game.isConnectedOrConnectingToServer) {
      console.error("Trying to enter matchmaking while attached to a server! Ignoring");
      return new Promise<RequestResult>(() => {
        return {
          ok: false,
          status: 500,
          statusText: "You cannot enter matchmaking while in a game",
          data: '{"FieldCodes":[{"Message":"You cannot enter matchmaking while in a game","Code":1038}]}',
          json: () => {},
          headers: ""
        }
      });
    }

    const request = {
      mode: game.matchmakingGameMode,
    };
    return webAPI.MatchmakingAPI.EnterMatchmaking(webAPI.defaultConfig, request as any);
  }

  private callCancelMatchmaking = async () => {
    // We allow canceling while attached to a server cause it should be idempotent
    return webAPI.MatchmakingAPI.CancelMatchmaking(webAPI.defaultConfig);
  }

  private onDonePreloading = (isSuccessful: boolean) => {
    if (this.isInitialQuery) {
      game.trigger(preloadQueryEvents.matchmakingContext, isSuccessful);
      this.isInitialQuery = false;
    }
  }
}
