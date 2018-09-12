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
import { PermissibleHolderFragment } from './PermissibleHolderFragment';
import { RequirementsFragment } from './RequirementsFragment';
import { ContainerStatsFragment } from './ContainerStatsFragment';
import { ItemDefRefFragment } from './ItemDefRefFragment';

export const ContainedItemsFragment = gql`
  fragment ContainedItems on Item {
    id
    givenName
    stackHash
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
    permissibleHolder {
      ...PermissibleHolder
    }
    containerDrawers {
      id
      requirements {
        ...Requirements
      }
      stats {
        ...ContainerStats
      }
      containedItems {
        id
        givenName
        stackHash
        containerColor {
          ...ContainerColor
        }
        actions {
          ...ItemActions
        }
        location {
          ...ItemLocation
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
        permissibleHolder {
          ...PermissibleHolder
        }
      }
    }
  }
  ${ContainerColorFragment}
  ${ItemLocationFragment}
  ${ItemActionsFragment}
  ${ItemStatsFragment}
  ${EquipRequirementFragment}
  ${ItemDefRefFragment}
  ${PermissibleHolderFragment}
  ${RequirementsFragment}
  ${ContainerStatsFragment}
`;
