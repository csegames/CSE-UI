/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/library/lib/_baseGame/graphql/subscription';
import {
  BattleGroupsIDQuery,
  BattleGroupNotificationSubscription,
  GroupTypes,
  GroupNotificationType,
  BattleGroupUpdateSubscription,
} from 'gql/interfaces';

const query = gql`
  query BattleGroupsIDQuery {
    myBattlegroup {
      battlegroup {
        id
      }
    }
  }
`;

const notificationSubscription = gql`
  subscription BattleGroupNotificationSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;

const updateSubscription = gql`
  subscription BattleGroupUpdateSubscription($groupID: String!) {
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

export interface State {
  activeBattlegroupID: string;
}

export class BattleGroupNotificationProvider extends React.Component<Props, State> {
  public static notificationEventName = 'battlegroup-notification';
  public static updateEventName = 'battlegroup-update';
  constructor(props: Props) {
    super(props);
    this.state = {
      activeBattlegroupID: '',
    };
  }

  public render() {
    return (
      <>
        <GraphQL
          query={query}
          onQueryResult={this.handleQueryResult}
          subscription={{
            query: notificationSubscription,
            initPayload: defaultSubscriptionOpts().initPayload,
          }}
          subscriptionHandler={this.handleNotificationSubscription}
        />
        {this.state.activeBattlegroupID &&
          <GraphQL
            subscription={{
              query: updateSubscription,
              initPayload: defaultSubscriptionOpts().initPayload,
              variables: {
                groupID: this.state.activeBattlegroupID,
              },
            }}
            subscriptionHandler={this.handleUpdateSubscription}
          />
        }
      </>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<BattleGroupsIDQuery.Query>) => {
    if (!graphql.data || !graphql.data.myBattlegroup || !graphql.data.myBattlegroup.battlegroup) return graphql;

    this.setState({ activeBattlegroupID: graphql.data.myBattlegroup.battlegroup.id });
  }

  private handleNotificationSubscription = (result: SubscriptionResult<BattleGroupNotificationSubscription.Subscription>,
                                            data: any) => {
    if (!result.data) return data;

    const notification = result.data.myGroupNotifications;
    if (notification.groupType === GroupTypes.Battlegroup) {
      game.trigger(BattleGroupNotificationProvider.notificationEventName, notification);

      switch (notification.type) {
        case GroupNotificationType.Removed: {
          game.trigger('chat-leave-room', notification.groupID);
          this.setState({ activeBattlegroupID: '' });
          break;
        }

        case GroupNotificationType.Joined: {
          this.setState({ activeBattlegroupID: notification.groupID });
          break;
        }
      }
    }

    return data;
  }

  private handleUpdateSubscription = (result: SubscriptionResult<BattleGroupUpdateSubscription.Subscription>,
                                      data: any) => {
    if (!result.data) return data;

    const update = result.data.activeGroupUpdates;
    game.trigger(BattleGroupNotificationProvider.updateEventName, update);
  }
}

