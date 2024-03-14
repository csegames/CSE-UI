/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type InteractiveAlertsQueryResult = Pick<CUQuery, 'myInteractiveAlerts'>;
export type InteractiveAlertsSubscriptionResult = Pick<CUSubscription, 'interactiveAlerts'>;

export const interactiveAlertsQuery = gql`
  query InteractiveAlertsQuery {
    myInteractiveAlerts {
      category
      targetID
      when
      ... on TradeAlert {
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
`;

export const interactiveAlertsSubscription = gql`
  subscription InteractiveAlertsSubscription {
    interactiveAlerts {
      category
      targetID
      when
      ... on TradeAlert {
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
`;
