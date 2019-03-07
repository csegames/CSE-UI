/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/camelot-unchained/lib/graphql/subscription';
import {
  WarbandNotificationSubscription,
  GroupNotificationType,
  WarbandUpdateSubscription,
  WarbandIDQuery,
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

export interface State {
  activeWarbandID: string;
}


export class WarbandNotificationProvider extends React.Component<Props, State> {
  public static notificationEventName = 'warband-notification';
  public static updateEventName = 'warband-update';
  constructor(props: Props) {
    super(props);
    this.state = {
      activeWarbandID: '',
    };
  }

  public render() {
    return (
      <>
        <GraphQL
          query={warbandQuery}
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
              initPayload: defaultSubscriptionOpts().initPayload,
              variables: {
                groupID: this.state.activeWarbandID,
              },
            }}
            subscriptionHandler={this.handleUpdateSubscription}
          />
        }
      </>
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

      game.trigger(WarbandNotificationProvider.notificationEventName, notification);
    }

    return data;
  }

  private handleUpdateSubscription = (result: SubscriptionResult<WarbandUpdateSubscription.Subscription>,
                                      data: any) => {
    if (!result.data) return data;

    const update = result.data.activeGroupUpdates;
    game.trigger(WarbandNotificationProvider.updateEventName, update);
  }
}
