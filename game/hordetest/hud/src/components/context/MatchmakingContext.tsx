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
import { Route, fullScreenNavigateTo } from 'context/FullScreenNavContext';
import { ErrorComponent } from 'components/fullscreen/Error';
import { query } from '@csegames/library/lib/_baseGame/graphql/query'
import { TimerRef, startTimer, endTimer } from '@csegames/library/lib/_baseGame/utils/timerUtils';

export enum PlayerNumberMode {
  SixMan,
  TenMan,
}

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

  // MatchmakingServerReady
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
  private timeSearchingUpdateHandle: TimerRef = null
  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultMatchmakingContextState(),
      onEnterMatchmaking: this.onEnterMatchmaking,
      onCancelMatchmaking: this.onCancelMatchmaking,
      onWaitingForServerHandled: this.onWaitingForServerHandled
    }
  }

  public componentWillUnmount() {
    if (this.timeSearchingUpdateHandle) {
      endTimer(this.timeSearchingUpdateHandle);
      this.timeSearchingUpdateHandle = null
    }
  }

  public render() {
    return (
      <MatchmakingContext.Provider value={this.state}>
        <GraphQL subscription={subscription} subscriptionHandler={this.handleSubscription} />
        {this.props.children}
      </MatchmakingContext.Provider>
    );
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

  private onCancelMatchmaking = () => {
    console.log("Matchmaking context understands we have canceled matchmaking");
    this.setState({ isEntered: false, timeSearching: 0 });
    if (this.timeSearchingUpdateHandle) {
      endTimer(this.timeSearchingUpdateHandle);
      this.timeSearchingUpdateHandle = null
    }
  }

  private onWaitingForServerHandled = () => {
    console.log("Matchmaking context understands we are done waiting for a server");
    this.setState({ isWaitingOnServer: false, isEntered: false });
  }

  private handleSubscription = (result: SubscriptionResult<{ matchmakingUpdates: IMatchmakingUpdate }>, data: any) => {
    if (!result.data || !result.data.matchmakingUpdates) return data;

    const matchmakingUpdate = result.data.matchmakingUpdates;
    game.trigger('subscription-matchmakingUpdates', matchmakingUpdate);

    switch (matchmakingUpdate.type) {
      case MatchmakingUpdateType.ServerReady: {
        const { host, port } = matchmakingUpdate as MatchmakingServerReady;

        this.setState({ host, port, isEntered: false, isWaitingOnServer: false });
        if (!game.isConnectedOrConnectingToServer) {
          console.log(`Received matchmaking server ready. Calling connect ${host}:${port}`);

          //We dont clear any forced loading screens here because we will clear the force during connection
          this.tryConnect(host, port, 0);
          game.trigger('hide-fullscreen');
        }
        else {
          console.error(`Received matchmaking server ready for ${host}:${port}. In a game or connecting to one, ignoring it`)
        }
        break;
      }

      case MatchmakingUpdateType.KickOff: {
        const { matchID, secondsToWait, serializedTeamMates } = matchmakingUpdate as MatchmakingKickOff;
        this.setState({ matchID, secondsToWait, teamMates: serializedTeamMates, isWaitingOnServer: true  }, () => {
          if (this.timeSearchingUpdateHandle) {
            endTimer(this.timeSearchingUpdateHandle);
            this.timeSearchingUpdateHandle = null
          }
          if (game.isConnectedOrConnectingToServer) {
            console.error(`Received matchmaking kickoff. In a game or already connecting to one, ignoring it`)
            return;
          }

          console.log(`Received matchmaking kickoff. ${serializedTeamMates ? JSON.parse(serializedTeamMates).length : null} mates, ${secondsToWait} timeout`)
          fullScreenNavigateTo(Route.ChampionSelect);
        });
        break;
      }

      case MatchmakingUpdateType.Error: {
        const { message, code } = (matchmakingUpdate as MatchmakingError);
        this.setState({ error: message, isEntered: false, isWaitingOnServer: false }, () => {
          if (game.isConnectedOrConnectingToServer) {
            console.error(`Received matchmaking error ${code} ${message}. In a game or connecting to one, ignoring it`)
            return;
          }
          console.log(`Received matchmaking error ${code} ${message}. Showing fullscreen, navigating to start and popping up error`)
          game.trigger("reset-fullscreen");
          game.trigger('show-middle-modal', <ErrorComponent title='Matchmaking Failure' message={message} errorCode={code} />, true);
        });
        break;
      }
    }
  }

  private tryConnect(host: string, port: number, tries: number) {
    game.connectToServer(host, port);
    window.setTimeout(() => this.checkConnected(host, port, ++tries), 500);
  }

  private async checkConnected(host: string, port: number, tries: number) {
    if (game.isConnectedToServer) {
      //Extra failsafe
      this.setState({ isWaitingOnServer:false});
      return;
    }

    if (game.isConnectedOrConnectingToServer) {
      // check again in another timeout
      window.setTimeout(() => this.checkConnected(host, port, tries), 500);
      return;
    }

    // give up after 15 seconds / 30 tries
    if (tries > 30) {
      game.trigger('show-middle-modal', <ErrorComponent title='Failed' message={'Failed to establish connection to game server.'} errorCode={1010} />, true);
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
        game.trigger('show-middle-modal', <ErrorComponent title='Failed' message={'Failed to establish connection to game server.'} errorCode={1011} />, true);
        // reset back to lobby
        game.trigger('reset-fullscreen');
      }
    } catch (err) {
      // failed to check status... so just fail out
      // reset back to lobby
      console.error(err);
      game.trigger('show-middle-modal', <ErrorComponent title='Failed' message={'Failed to establish connection to game server.'} errorCode={1009} />, true);
      game.trigger('reset-fullscreen');
    }
  }
}
