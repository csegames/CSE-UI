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
import { WarbandNotificationSubscription, WarbandGroupIDQuery, GroupNotificationType } from 'gql/interfaces';

const query = gql`
  query WarbandGroupIDQuery {
    myActiveWarband {
      info {
        id
      }
    }
  }
`;

const subscription = gql`
  subscription WarbandNotificationSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;

export interface Props {
  onNotification?: (notification: WarbandNotificationSubscription.MyGroupNotifications) => void;
}

export interface State {
  groupID: string;
}

class WarbandNotificationProvider extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      groupID: '',
    };
  }

  public render() {
    return (
      <GraphQL
        query={query}
        onQueryResult={this.handleQueryResult}
        subscription={{
          query: subscription,
          initPayload: defaultSubscriptionOpts().initPayload,
        }}
        subscriptionHandler={this.handleSubscription}
      />
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<WarbandGroupIDQuery.Query>) => {
    if (!graphql.data) return graphql;

    const myActiveWarband = graphql.data.myActiveWarband;
    if (myActiveWarband && myActiveWarband.info) {
      this.setState({ groupID: myActiveWarband.info.id });
    }
  }

  private handleSubscription = (result: SubscriptionResult<WarbandNotificationSubscription.Subscription>,
                                data: WarbandGroupIDQuery.Query) => {
    if (!result.data) return data;

    const notification = result.data.myGroupNotifications;
    if (notification.groupType === 'Warband') {
      switch (notification.type) {
        case GroupNotificationType.Joined: {
          this.setState({ groupID: notification.groupID });
          break;
        }

        case GroupNotificationType.Removed: {
          this.setState({ groupID: '' });
          game.trigger('chat-leave-room', notification.groupID);
          break;
        }
      }

      if (this.props.onNotification) {
        this.props.onNotification(notification);
      }
    }

    return data;
  }
}

export default WarbandNotificationProvider;
