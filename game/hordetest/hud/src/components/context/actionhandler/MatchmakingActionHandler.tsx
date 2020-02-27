/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { RequestResult } from '@csegames/library/lib/_baseGame';
import { webAPI } from '@csegames/library/lib/hordetest';
import {
  IMatchmakingUpdate,
  MatchmakingUpdateType,
  MatchmakingServerReady,
  MatchmakingKickOff,
  MatchmakingError,
} from '@csegames/library/lib/hordetest/graphql/schema';
import { query } from '@csegames/library/lib/_baseGame/graphql/query'
import {
  MatchmakingContext,
  MatchmakingContextState,
  onMatchmakingUpdate,
  REENTER_MATCHMAKING_ERROR,
  SOMEONE_DISCONNECTED_MATCHMAKING_ERROR,
  SOMEONE_DISCONNECTED_WEBSOCKET_ERROR,
  MATCH_FAILED_ERROR,
  MATCH_CANCELED_ERROR,
  NO_SERVERS_ERROR,
} from '../MatchmakingContext';
import { WarbandContext, WarbandContextState } from '../WarbandContext';
import { fullScreenNavigateTo, Route } from 'context/FullScreenNavContext';
import { ErrorComponent } from 'components/fullscreen/Error';

const KICKOFF_TIMEOUT = 500;

export interface Props {
  matchmakingContext: MatchmakingContextState;
  warbandContext: WarbandContextState;
}

class MatchmakingActionHandlerWithContext extends React.Component<Props> {
  private matchmakingEVH: EventHandle;
  private kickOffTimeout: number;

  public render() {
    return null as any;
  }

  public componentDidMount() {
    this.matchmakingEVH = onMatchmakingUpdate(this.handleMatchmakingUpdate);
  }

  public componentWillUnmount() {
    if (!this.matchmakingEVH) {
      this.matchmakingEVH.clear();
      this.matchmakingEVH = null;
    }

    window.clearTimeout(this.kickOffTimeout);
  }

  private handleMatchmakingUpdate = (matchmakingUpdate: IMatchmakingUpdate) => {
    switch (matchmakingUpdate.type) {
      case MatchmakingUpdateType.ServerReady: {
        const { host, port } = matchmakingUpdate as MatchmakingServerReady;

        if (!game.isConnectedOrConnectingToServer) {
          console.log(`Received matchmaking server ready. Calling connect ${host}:${port}`);

          //We dont clear any forced loading screens here because we will clear the force during connection
          tryConnect(host, port, 0, this.props.matchmakingContext.matchID);
          game.trigger('hide-fullscreen');
        }
        else {
          console.error(`Received matchmaking server ready for ${host}:${port}.
            In a game or connecting to one, ignoring it`);
        }
        break;
      }

      case MatchmakingUpdateType.KickOff: {
        const { secondsToWait, serializedTeamMates } = matchmakingUpdate as MatchmakingKickOff;
        if (game.isConnectedOrConnectingToServer) {
          console.error(`Received matchmaking kickoff. In a game or already connecting to one, ignoring it`);
          return;
        }

        try {
          console.log(`Received matchmaking kickoff. ${serializedTeamMates ? JSON.parse(serializedTeamMates).length : null}
            mates, ${secondsToWait} timeout`);
        } catch (e) {
          console.error(e);
        }

        this.kickOffTimeout = window.setTimeout(() => {
          fullScreenNavigateTo(Route.ChampionSelect);
        }, KICKOFF_TIMEOUT);
        break;
      }

      case MatchmakingUpdateType.Error: {
        const { message, code } = (matchmakingUpdate as MatchmakingError);
        if (game.isConnectedOrConnectingToServer) {
          return;
        } else {
          var shouldFire = false;
          switch(code)
          {
            case SOMEONE_DISCONNECTED_MATCHMAKING_ERROR:
              // Matchmaking had them marked disconnected and they never returned so they were removed from the match
              shouldFire = this.props.matchmakingContext.isEntered;
              break;
            case SOMEONE_DISCONNECTED_WEBSOCKET_ERROR:
              // Someone in our warband lost their websocket.
            case MATCH_CANCELED_ERROR:
              // Someone in your warband canceled the matchmaking.
              //TODO: Dont show. figur eout later
              if (this.props.warbandContext.groupID) {
                shouldFire = true;
              }
              break;
            case MATCH_FAILED_ERROR:
              // General failure
              shouldFire = true;
              break;
            case NO_SERVERS_ERROR:
              // We timed out on finding a server
              shouldFire = this.props.matchmakingContext.isWaitingOnServer;
              break;
            case REENTER_MATCHMAKING_ERROR:
              // We actually need to just reenter matchmaking here cause the match failed to kick off
              // Someone must have dropped on kick off. Attempting to reenter matchmaking`
              shouldFire = true;

              let myGroupMember = null;
              if (this.props.warbandContext.groupID) {
                myGroupMember = Object.values(this.props.warbandContext.groupMembers).find(m =>
                  m.characterID === game.characterID);

                if (!myGroupMember) {
                  console.error('Got a reenter matchmaking error, while in a group, but cant find member info.');
                }
              }

              if (!myGroupMember || myGroupMember.isLeader) {
                callEnterMatchmaking().then((res) => {
                  if (res.ok) {
                    this.props.matchmakingContext.onEnterMatchmaking();
                  }
                  else {
                    console.error("Failed to reenter matchmaking!");
                  }
                }).catch(() => { console.error("Failed to call reenter matchmaking")});
              }
              break;
          }
          if (shouldFire) {
              console.log(`Received matchmaking error ${code} ${message}. Showing fullscreen, navigating to start and popping up error`)
              game.trigger("reset-fullscreen");
              game.trigger('show-middle-modal', <ErrorComponent title='Matchmaking Failure' message={message} errorCode={code} />, true);
          }
          else {
            console.log(`Received matchmaking error ${code} ${message}. Not firing cause bad state`);
          }
        }
        break;
      }
    }
  }
}

export function MatchmakingActionHandler() {
  const matchmakingContext = useContext(MatchmakingContext);
  const warbandContext = useContext(WarbandContext);
  return (
    <MatchmakingActionHandlerWithContext
      matchmakingContext={matchmakingContext}
      warbandContext={warbandContext}
    />
  );
}


export function tryConnect(host: string, port: number, tries: number, matchID: string) {
  game.connectToServer(host, port);
  window.setTimeout(() => checkConnected(host, port, ++tries, matchID), 500);
}

export async function checkConnected(host: string, port: number, tries: number, matchID: string) {
  if (game.isConnectedToServer) {
    return;
  }

  if (game.isConnectedOrConnectingToServer) {
    // check again in another timeout
    window.setTimeout(() => checkConnected(host, port, tries, matchID), 500);
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
        serverState(server:"${host}:${port}", match: "${matchID}") {
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
      tryConnect(host, port, tries, matchID);
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

export async function callEnterMatchmaking() {
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

export async function callCancelMatchmaking() {
  // We allow canceling while attached to a server cause it should be idempotent
  return webAPI.MatchmakingAPI.CancelMatchmaking(webAPI.defaultConfig);
}
