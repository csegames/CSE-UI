/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';
import { InteractiveAlertGQL } from 'gql/interfaces';

export const query = gql`
  query InteractiveAlertGQL {
    myInteractiveAlerts {
      category
      targetID
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

export type QueryData = InteractiveAlertGQL.Query;
