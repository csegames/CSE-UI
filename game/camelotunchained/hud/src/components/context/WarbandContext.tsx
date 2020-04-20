/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/library/lib/_baseGame/graphql/subscription';
import {
  WarbandNotificationSubscription,
  GroupNotificationType,
  WarbandUpdateSubscription,
  WarbandIDQuery,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
} from 'gql/interfaces';

const warbandQuery = gql`
  query WarbandIDQuery {
    myActiveWarband {
      info {
        id
      }
    }
  }
`;

const notificationSubscription = gql`
  subscription WarbandNotificationSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;

const updateSubscription = gql`
  subscription WarbandUpdateSubscription($groupID: String!) {
    activeGroupUpdates(groupID: $groupID) {
      updateType
      groupID

      ... on GroupMemberUpdate {
        memberState
      }

      ... on GroupMemberRemovedUpdate {
        characterID
      }
    }
  }
`;

export interface Props {
}

export interface WarbandContextState {
  activeWarbandID: string;
  memberIdToMemberState: { [characterId: string]: GroupMemberState };
}

export function getDefaultWarbandContextState(): WarbandContextState {
  return {
    activeWarbandID: '',
    memberIdToMemberState: {},
  }
}

export const WarbandContext = React.createContext(getDefaultWarbandContextState());

export class WarbandContextProvider extends React.Component<Props, WarbandContextState> {
  public static notificationEventName = 'warband-notification';
  public static updateEventName = 'warband-update';
  constructor(props: Props) {
    super(props);
    this.state = getDefaultWarbandContextState();
  }

  public render() {
    return (
      <WarbandContext.Provider value={this.state}>
        <GraphQL
          query={{
            query: warbandQuery,
            operationName: "warband-context",
            maxAttempts: 5
          }}
          onQueryResult={this.handleWarbandQueryResult}
          subscription={{
            query: notificationSubscription,
            initPayload: defaultSubscriptionOpts().initPayload,
          }}
          subscriptionHandler={this.handleNotificationSubscription}
        />
        {this.state.activeWarbandID &&
          <GraphQL
            subscription={{
              query: updateSubscription,
              operationName: "active-warband-sub",
              initPayload: defaultSubscriptionOpts().initPayload,
              variables: {
                groupID: this.state.activeWarbandID,
              },
            }}
            subscriptionHandler={this.handleUpdateSubscription}
          />
        }
        {this.props.children}
      </WarbandContext.Provider>
    );
  }

  private handleWarbandQueryResult = (graphql: GraphQLResult<WarbandIDQuery.Query>) => {
    if (!graphql.data || !graphql.data.myActiveWarband || !graphql.data.myActiveWarband.info) return graphql;

    this.setState({ activeWarbandID: graphql.data.myActiveWarband.info.id });
  }

  private handleNotificationSubscription = (result: SubscriptionResult<WarbandNotificationSubscription.Subscription>,
                                            data: any) => {
    if (!result.data) return data;

    const notification = result.data.myGroupNotifications;
    if (notification.groupType === 'Warband') {
      switch (notification.type) {
        case GroupNotificationType.Removed: {
          game.trigger('chat-leave-room', notification.groupID);
          this.setState({ activeWarbandID: '' });
          break;
        }
        case GroupNotificationType.Joined: {
          this.setState({ activeWarbandID: notification.groupID });
          break;
        }
      }

      game.trigger(WarbandContextProvider.notificationEventName, notification);
    }

    return data;
  }

  private handleUpdateSubscription = (result: SubscriptionResult<WarbandUpdateSubscription.Subscription>,
                                      data: any) => {
    if (!result.data) return data;

    const update = result.data.activeGroupUpdates;
    game.trigger(WarbandContextProvider.updateEventName, update);

    switch(update.updateType) {
      case GroupUpdateType.MemberUpdate: {
        const memberIdToMemberState = { ...this.state.memberIdToMemberState };
        try {
          const member = JSON.parse((update as GroupMemberUpdate).memberState);
          memberIdToMemberState[member.id] = member;
          this.setState({ memberIdToMemberState });
        } catch(e) {
          console.error('There was an error updating warband member');
        }
        break;
      }

      case GroupUpdateType.MemberRemoved: {
        const memberIdToMemberState = { ...this.state.memberIdToMemberState };
        delete memberIdToMemberState[(update as GroupMemberRemovedUpdate).characterID];
        this.setState({ memberIdToMemberState });
        break;
      }
    }
  }
}
