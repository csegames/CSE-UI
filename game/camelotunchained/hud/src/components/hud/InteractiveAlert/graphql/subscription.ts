/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import { GraphQLSubscriptionOptions } from '@csegames/library/lib/_baseGame/graphql/react';
import { defaultSubscriptionOpts } from '@csegames/library/lib/_baseGame/graphql/subscription';
import { InteractiveAlertSubscriptionGQL } from 'gql/interfaces';

export type SubscriptionData = InteractiveAlertSubscriptionGQL.Subscription;

export const subscription = (): GraphQLSubscriptionOptions<SubscriptionData> => ({
  query: gql`
    subscription InteractiveAlertSubscriptionGQL {
      interactiveAlerts {
        category
        targetID
        ... on TradeAlert {
          targetID
          secureTradeID
          otherEntityID
          otherName
          kind
        }
        ... on GroupAlert {
          kind
          fromName
          fromID
          forGroup
          forGroupName
          code
        }
      }
    }
    `,
  initPayload: defaultSubscriptionOpts().initPayload,
  debug: false,
});
