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
  MatchmakingEntered,
  MatchmakingQueueCount,
} from '@csegames/library/lib/hordetest/graphql/schema';
import { TimerRef, startTimer, endTimer } from '@csegames/library/lib/_baseGame/utils/timerUtils';
import { preloadQueryEvents } from '../fullscreen/Preloader';
import { query as SendGQLQuery, defaultQuery } from '@csegames/library/lib/_baseGame/graphql/query';

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

export const INVALID_QUEUE_COUNT: string = "?"

export interface GameMode {
  mode: string,
  name: string,
  isDev: boolean
}

export function getMatchmakingGameModes() {
  const defaultMode = {
    "isDev": true,
    "isDefault": false
  }

  return [
    {
      ...defaultMode,
      "mode": "csetestone",
      "name": "TestOne",
    },
    {
      ...defaultMode,
      "mode": "inttest",
      "name": "TestTwo",
    },
    {
      ...defaultMode,
      "mode": "hordetest8",
      "name": "Normal HT8",
      "isDev": false,
      "isDefault": true
    },
    {
      ...defaultMode,
      "mode": "hordetest9",
      "name": "Normal HT9",
    },
    {
      ...defaultMode,
      "mode": "hordetest10",
      "name": "Normal HT10",
    },
    {
      ...defaultMode,
      "mode": "hordetest11",
      "name": "Normal HT11",
    }
  ]
}

const queueCountQuery = gql`
  query QueueCountQuery {
    matchmakingQueueCount {
      count
    }
  }
`;

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

      ... on MatchmakingEntered {
        gameMode
      }

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

  selectedGameMode: GameMode;
  enteredGameMode: string;
  currentQueueCount: number | string;
  hasActiveQueueCountQuery: boolean;

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
  shouldShowButtonFound: boolean;
}

export interface ContextFunctions {
  selectGameMode: (gameMode: GameMode) => void;
  onEnterMatchmaking: (gameMode: string) => void;
  onCancelMatchmaking: () => void;
  onWaitingForServerHandled: () => void;
  clearMatchmakingContext: () => void;
  setShouldShowButtonFound: (shouldShow: boolean) => void;
}

export type MatchmakingContextState = ContextState & ContextFunctions;

export const getDefaultMatchmakingContextState = () : ContextState => {
  const modes = getMatchmakingGameModes()
    
  const modeFromClient = modes.find(x => x.mode == game.matchmakingGameMode)
  let initialMode = modeFromClient ? modeFromClient : modes.find(x => x.isDefault)
  
  return {
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
    currentQueueCount: INVALID_QUEUE_COUNT,
    hasActiveQueueCountQuery: false,
    enteredGameMode: null,
    selectedGameMode: initialMode,
    selectedPlayerNumberMode: PlayerNumberMode.TenMan,
    shouldShowButtonFound: false,
  };
}

export const MatchmakingContext = React.createContext({
  ...getDefaultMatchmakingContextState(),
  selectGameMode: (gameMode: GameMode) => {},
  onEnterMatchmaking: (gameMode: string) => {},
  onCancelMatchmaking: () => {},
  onWaitingForServerHandled: () => {},
  clearMatchmakingContext: () => null,
  setShouldShowButtonFound: () => null,
} as MatchmakingContextState);

export class MatchmakingContextProvider extends React.Component<{}, ContextState> {
  private isInitialQuery: boolean = true;
  private timeSearchingUpdateHandle: TimerRef = null
  private queueCountGrabHandle: TimerRef = null
  private kickOffTimeout: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultMatchmakingContextState(),
    }
  }

  public componentWillUnmount() {
    this.endSearchingTimer();
    this.endQueueGrabTimer();

    window.clearTimeout(this.kickOffTimeout);
  }

  public render() {
    return (
      <MatchmakingContext.Provider
        value={{
          ...this.state,
          selectGameMode: this.selectGameMode,
          onEnterMatchmaking: this.onEnterMatchmaking,
          onCancelMatchmaking: this.onCancelMatchmaking,
          onWaitingForServerHandled: this.onWaitingForServerHandled,
          clearMatchmakingContext: this.clearMatchmakingContext,
          setShouldShowButtonFound: this.setShouldShowButtonFound,
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

  private selectGameMode = (gameMode: GameMode) => {
    this.setState({selectedGameMode: gameMode});
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
      case MatchmakingUpdateType.Entered: {
        this.handleMatchmakingEntered(matchmakingUpdate as MatchmakingEntered);
        break;
      }

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

  private handleMatchmakingEntered = (matchmakingUpdate: MatchmakingEntered) => {
    if (!matchmakingUpdate) {
      console.error('Tried to call handleMatchmakingEntered with an invalid matchmakingUpdate');
      return;
    }

    // We're in a group and the leader has put us into matchmaking
    const modes = getMatchmakingGameModes();
    const modeToEnter = modes.find(x => x.mode == matchmakingUpdate.gameMode)
    if (modeToEnter) {
      this.setState({enteredGameMode: modeToEnter.mode}, () => {
        this.onEnterMatchmaking(this.state.enteredGameMode)
      });
    } else {
      const listOfModes = modes.map(mode => mode.mode)
      console.error(`Received game mode ${matchmakingUpdate.gameMode} which is not in our list of modes ${listOfModes}`);
    }
  }

  private handleMatchmakingServerReady = (matchmakingUpdate: MatchmakingServerReady) => {
    if (!matchmakingUpdate) {
      console.error('Tried to call handleMatchmakingServerReady with an invalid matchmakingUpdate');
      return;
    }

    const { host, port } = matchmakingUpdate;
    this.setState({ host, port, isEntered: false, enteredGameMode: null, isWaitingOnServer: false, timeSearching: 0, hasActiveQueueCountQuery: false, currentQueueCount: INVALID_QUEUE_COUNT }, () => {
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
      currentQueueCount: INVALID_QUEUE_COUNT,
      hasActiveQueueCountQuery: false,
      shouldShowButtonFound: true,
    }, () => {
      this.triggerMatchmakingUpdate(matchmakingUpdate);
      this.endSearchingTimer();
      this.endQueueGrabTimer();
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
          this.onCancelMatchmaking();
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
        this.setState({ error: message, isEntered: false, isWaitingOnServer: false, timeSearching: 0, hasActiveQueueCountQuery: false, currentQueueCount: INVALID_QUEUE_COUNT }, () => {
          this.triggerMatchmakingUpdate(matchmakingUpdate);
          this.endSearchingTimer();
          this.endQueueGrabTimer();
        });
      }
      else {
        console.log(`Received matchmaking error ${code} ${message}. Not firing cause bad state`) 
      }
    }
  }

  private onEnterMatchmaking = (gameMode: string) => {
    console.log("Matchmaking context understands we have entered matchmaking");
    this.setState({ isEntered: true, timeSearching: 0, hasActiveQueueCountQuery: false, currentQueueCount: INVALID_QUEUE_COUNT, enteredGameMode: gameMode });

    //If someone waits in matchmaking for 30 minutes and nothing happens, then i guess the timer just stops. We probably have bigger problems
    const thirtyMinutes = 30 * 60 * 60 * 1000;
    const interval = 60; //Choosing a non divisable number so the update will appear smoother

    this.timeSearchingUpdateHandle = startTimer(thirtyMinutes, interval, (elapsed, remainingTime) => {
      if (elapsed / 1000 > this.state.timeSearching) {
        this.setState({ timeSearching: this.state.timeSearching + 1 })
      }
    });

    //Note: this is on an interval instead of using a subscription because a subscription would not be performant
    // with the rate that people can potentially enter/exit matchmaking. We also dont need that level of responsiveness
    // in this data
    const threeSeconds = 3000;
    this.queueCountGrabHandle = startTimer(thirtyMinutes, threeSeconds, (elapsed, remainingTime) => {
        this.updateQueueCount()
    });
  }

  private updateQueueCount = async () => {
    let partialQuery = { 
      query: queueCountQuery
    };
    let query = withDefaults(partialQuery, defaultQuery);
    if (this.state.hasActiveQueueCountQuery) {
      console.error("Actively querying for a count of the queue! Ignoring request to query again until next iteration...");
      return;
    }
    this.setState({hasActiveQueueCountQuery: true})
    SendGQLQuery(query).then((result) => {
      try {
        if (result.ok && result.data) {
          const {matchmakingQueueCount} = result.data as { matchmakingQueueCount: MatchmakingQueueCount };
          if (matchmakingQueueCount) {
            this.setState({currentQueueCount: matchmakingQueueCount.count ? matchmakingQueueCount.count : INVALID_QUEUE_COUNT})
          }
        }
        else {
          console.error(`Failed to get matchmaking queue count`);
        }
      }
      catch {
        console.error("Failed to handle matchmaking queue count response!")
      }
      finally {
        this.setState({hasActiveQueueCountQuery: false});
      }
    }, (reason) => {
      console.error(`Get matchmaking queue count was rejected! Probably network failure or something is very broke. ${reason}`);
      this.setState({hasActiveQueueCountQuery: false, currentQueueCount: INVALID_QUEUE_COUNT})
    })
  }

  private endSearchingTimer = () => {
    if (this.timeSearchingUpdateHandle) {
      endTimer(this.timeSearchingUpdateHandle);
      this.timeSearchingUpdateHandle = null
    }
  }

  private endQueueGrabTimer = () => {
    if (this.queueCountGrabHandle) {
      endTimer(this.queueCountGrabHandle);
      this.queueCountGrabHandle = null
    }
  }

  private onCancelMatchmaking = () => {
    console.log("Matchmaking context understands we have canceled matchmaking");
    this.setState({ isEntered: false, enteredGameMode: null, timeSearching: 0, hasActiveQueueCountQuery: false, currentQueueCount: INVALID_QUEUE_COUNT });
    this.endSearchingTimer();
    this.endQueueGrabTimer();
  }

  private onWaitingForServerHandled = () => {
    console.log("Matchmaking context understands we are done waiting for a server");
    this.setState({ isWaitingOnServer: false, isEntered: false, timeSearching: 0, hasActiveQueueCountQuery: false, currentQueueCount: INVALID_QUEUE_COUNT });
    this.endSearchingTimer();
    this.endQueueGrabTimer();
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

  private setShouldShowButtonFound = (shouldShowButtonFound: boolean) => {
    console.log('Setting shouldShowButtonFound to: ' + shouldShowButtonFound);
    this.setState({ shouldShowButtonFound });
  }
}
