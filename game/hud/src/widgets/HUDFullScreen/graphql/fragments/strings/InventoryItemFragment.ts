/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { ContainerColorFragment } from './ContainerColorFragment';
import { ItemLocationFragment } from './ItemLocationFragment';
import { ItemActionsFragment } from './ItemActionsFragment';
import { ItemStatsFragment } from './ItemStatsFragment';
import { EquipRequirementFragment } from './EquipRequirementFragment';
import { GearSlotDefRefFragment } from './GearSlotDefRefFragment';
import { ContainerDrawersFragment } from './ContainerDrawersFragment';
import { PermissibleHolderFragment } from './PermissibleHolderFragment';

export const InventoryItemFragment = `
  id
  givenName
  stackHash
  containerColor {
    ${ContainerColorFragment}
  }
  location {
    ${ItemLocationFragment}
  }
  actions {
    ${ItemActionsFragment}
  }
  stats {
    ${ItemStatsFragment}
  }
  equiprequirement {
    ${EquipRequirementFragment}
  }
  staticDefinition {
    id
    description
    name
    iconUrl
    itemType
    defaultResourceID
    deploySettings {
      resourceID
      isDoor
      snapToGround
      rotateYaw
      rotatePitch
      rotateRoll
    }
    gearSlotSets {
      gearSlots {
        ${GearSlotDefRefFragment}
      }
    }
    isVox
  }
  containerDrawers {
    ${ContainerDrawersFragment}
  }
  permissibleHolder {
    ${PermissibleHolderFragment}
  }
`;
