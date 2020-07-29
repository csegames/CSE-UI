/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import { GearSlotDefRefFragment } from './GearSlotDefRefFragment';

export const ItemDefRefFragment = gql`
  fragment ItemDefRef on ItemDefRef {
    id
    description
    name
    iconUrl
    itemType
    defaultResourceID
    numericItemDefID
    isStackableItem
    tags
    equipRequirements
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
        ...GearSlotDefRef
      }
    }
    substanceDefinition {
      id
      type
      minQuality
      maxQuality
    }
    alloyDefinition {
      id
      type
      subType
    }
    isVox
  }
  ${GearSlotDefRefFragment}
`;
