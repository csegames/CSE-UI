/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { GraphQL } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult, defaultSubscriptionOpts } from '@csegames/camelot-unchained/lib/graphql/subscription';
import { BattleGroupNotificationSubscription, GroupTypes, GroupNotificationType } from 'gql/interfaces';

const subscription = gql`
  subscription BattleGroupNotificationSubscription {
    myGroupNotifications {
      type
      groupType
      characterID
      groupID
    }
  }
`;

export interface Props {
  onNotification?: (notification: BattleGroupNotificationSubscription.MyGroupNotifications) => void;
}

class BattleGroupNotificationProvider extends React.PureComponent<Props> {
  public render() {
    return (
      <GraphQL
        subscription={{
          query: subscription,
          initPayload: defaultSubscriptionOpts().initPayload,
        }}
        subscriptionHandler={this.handleSubscription}
      />
    );
  }

  private handleSubscription = (result: SubscriptionResult<BattleGroupNotificationSubscription.Subscription>,
                                data: any) => {
    if (!result.data) return data;

    const notification = result.data.myGroupNotifications;
    if (notification.groupType === GroupTypes.Battlegroup) {
      if (this.props.onNotification) {
        this.props.onNotification(notification);
      }

      if (notification.type === GroupNotificationType.Removed) {
        game.trigger('chat-leave-room', notification.groupID);
      }
    }

    return data;
  }
}

export default BattleGroupNotificationProvider;

