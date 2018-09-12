/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import { InventoryItemFragment } from 'gql/fragments/InventoryItemFragment';

export const VoxJobFragment = gql`
  fragment VoxJob on VoxJobStatus {
    id
    jobType
    jobState
    voxHealthCost
    totalCraftingTime
    timeRemaining
    givenName
    itemCount
    recipeID
    endQuality
    usedRepairPoints
    startTime
    possibleItemSlots
    outputItems {
      outputItemType
      item {
        ...InventoryItem
      }
    }
    ingredients {
      ...InventoryItem
    }
  }

  ${InventoryItemFragment}
`;
