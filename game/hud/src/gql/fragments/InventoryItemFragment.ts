/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

import { ContainerColorFragment } from './ContainerColorFragment';
import { ItemLocationFragment } from './ItemLocationFragment';
import { ItemActionsFragment } from './ItemActionsFragment';
import { ItemStatsFragment } from './ItemStatsFragment';
import { EquipRequirementFragment } from './EquipRequirementFragment';
import { ContainerDrawersFragment } from './ContainerDrawersFragment';
import { PermissibleHolderFragment } from './PermissibleHolderFragment';
import { ItemDefRefFragment } from './ItemDefRefFragment';

export const InventoryItemFragment = gql`
  fragment InventoryItem on Item {
    id
    givenName
    stackHash
    hasSubItems
    containerColor {
      ...ContainerColor
    }
    location {
      ...ItemLocation
    }
    actions {
      ...ItemActions
    }
    stats {
      ...ItemStats
    }
    equiprequirement {
      ...EquipRequirement
    }
    staticDefinition {
      ...ItemDefRef
    }
    containerDrawers {
      ...ContainerDrawers
    }
    permissibleHolder {
      ...PermissibleHolder
    }
  }
  ${ContainerColorFragment}
  ${ItemLocationFragment}
  ${ItemActionsFragment}
  ${ItemStatsFragment}
  ${EquipRequirementFragment}
  ${ItemDefRefFragment}
  ${ContainerDrawersFragment}
  ${PermissibleHolderFragment}
`;
