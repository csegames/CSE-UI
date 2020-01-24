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
  IChampionUpdate,
  ChampionUpdateType,
  ChampionSelectionUpdate,
  ChampionSelectInfo,
} from '@csegames/library/lib/hordetest/graphql/schema';

const subscription = gql`
  subscription ChampionSelectSubscription($matchID: String!) {
    championSelectionUpdates(matchID: $matchID) {
      type
      updaterCharacterID

      ... on ChampionSelectionUpdate {
        displayName
        championID
        championMetaData
      }
    }
  }
`;

const query = gql`
  query ChampionSelectPlayers {
    championSelection {
      matchID
      teamMates {
        characterID
        displayName
        metaData
      }
    }
  }
`;

export interface ChampionSelectPlayer {
  characterID: string;
  isLocked: boolean;
  championID: string;
  displayName: string;
}

export interface Props {
  matchID: string;
}

export interface ChampionSelectContextState {
  playerStates: { [characterID: string]: ChampionSelectPlayer };

  onChampionSelect: (championID: string) => void;
}

const getDefaultChampionSelectContextState = (): ChampionSelectContextState => ({
  playerStates: {},

  onChampionSelect: () => {},
});

export const ChampionSelectContext = React.createContext(getDefaultChampionSelectContextState());

export class ChampionSelectContextProvider extends React.Component<Props, ChampionSelectContextState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ...getDefaultChampionSelectContextState(),
      onChampionSelect: this.onChampionSelect,
    };
  }

  public render() {
    return (
      <ChampionSelectContext.Provider value={this.state}>
        {this.props.matchID &&
          <GraphQL
            query={query}
            onQueryResult={this.handleQueryResult}
            subscription={{
              query: subscription,
              variables: {
                matchID: this.props.matchID,
              },
            }}
            subscriptionHandler={this.handleSubscription}
          />
        }
        {this.props.children}
      </ChampionSelectContext.Provider>
    );
  }

  private handleQueryResult = (query: GraphQLResult<{ championSelection: ChampionSelectInfo }>) => {
    if (!query || !query.data || !query.data.championSelection) return query;

    const championSelectInfo = query.data.championSelection;
    const playerStates = { ...this.state.playerStates };
    championSelectInfo.teamMates.forEach((teamMate) => {
      if (!playerStates[teamMate.characterID]) {
        playerStates[teamMate.characterID] = {
          displayName: teamMate.displayName,
          characterID: teamMate.characterID,
          ...JSON.parse(teamMate.metaData),
        };
      }
    });

    this.setState({ playerStates });
  }

  private handleSubscription = (result: SubscriptionResult<{ championSelectionUpdates: IChampionUpdate }>, data: any) => {
    if (!result.data || !result.data.championSelectionUpdates) return data;

    const championSelectUpdate = result.data.championSelectionUpdates;
    const playerStates = { ...this.state.playerStates };
    let shouldUpdateState = false;
    switch (championSelectUpdate.type) {
      case ChampionUpdateType.Selection: {
        const update = championSelectUpdate as ChampionSelectionUpdate;

        if (playerStates[update.updaterCharacterID]) {
          playerStates[update.updaterCharacterID] = {
            ...playerStates[update.updaterCharacterID],
            championID: update.championID,
          };
        } else {
          playerStates[update.updaterCharacterID] = {
            displayName: '_display_name_',
            characterID: update.updaterCharacterID,
            championID: update.championID,
            isLocked: false,
          };
        }

        shouldUpdateState = true;
        break;
      }

      case ChampionUpdateType.Lock: {
        if (!playerStates[championSelectUpdate.updaterCharacterID]) {
          // We should always have information about a player at this point
          console.error(`ChampionSelectContext: Got a Lock ChampionUpdate when
            the UI did not have any information about the player who supposedly Locked in.`);
          return;
        }

        playerStates[championSelectUpdate.updaterCharacterID] = {
          ...playerStates[championSelectUpdate.updaterCharacterID],
          isLocked: true,
        };

        shouldUpdateState = true;
        break;
      }

      case ChampionUpdateType.Unlock: {
        if (!playerStates[championSelectUpdate.updaterCharacterID]) {
          console.error(`ChampionSelectcontext: Got an Unlock ChampionUpdate when the UI
            did not have any information about the player who supposedly Unlocked.`);
          return;
        }

        playerStates[championSelectUpdate.updaterCharacterID] = {
          ...playerStates[championSelectUpdate.updaterCharacterID],
          isLocked: false,
        };

        shouldUpdateState = true;
      }
    }

    if (shouldUpdateState) {
      this.setState({ playerStates });
    }
  }

  private onChampionSelect = (championID: string) => {
    const playerStates = { ...this.state.playerStates };
    const myCharacterID = game.characterID;
    playerStates[myCharacterID] = { ...playerStates[myCharacterID], championID };

    this.setState({ playerStates });
  }
}
