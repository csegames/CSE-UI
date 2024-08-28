/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';
import { inventoryItemFragment } from './fragments';

// Specify the subset of keys from CUQuery that we are interested in.
export type InventoryQueryResult = Pick<CUQuery, 'myInventory'>;

export const inventoryQuery = gql`
  query InventoryBaseGQL {
    myInventory(allowOfflineItems: false) {
      items {
        ...InventoryItem
      }
      itemCount
    }
  }
  ${inventoryItemFragment}
`;
