/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from '@csegames/camelot-unchained';
import { CUSubscription } from '@csegames/camelot-unchained/lib/graphql';
import { GraphQLSubscriptionOptions } from '@csegames/camelot-unchained/lib/graphql/react';

const url =  `${client.apiHost}/graphql`.replace('http', 'ws');
const initPayload = {
  shardID: client.shardID,
  loginToken: client.loginToken,
  characterID: client.characterID,
};


export type SubscriptionData = Pick<CUSubscription, 'interactiveAlerts'>;

export const subscription: GraphQLSubscriptionOptions<SubscriptionData> = {
  query: `
    subscription {
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
  url,
  initPayload,
  debug: false,
};

