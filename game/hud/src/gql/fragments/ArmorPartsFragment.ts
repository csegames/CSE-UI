/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

import { GearSlotDefRefFragment } from './GearSlotDefRefFragment';
import { DamageTypeValuesFragment } from './DamageTypeValuesFragment';

export const ArmorPartsFragment = gql`
  fragment ArmorParts on ArmorStatSet {
    statsPerSlot {
      gearSlot {
        ...GearSlotDefRef
      }
      stats {
        armorClass
      }
      resistances {
      ...DamageTypeValues
      }
      mitigations {
      ...DamageTypeValues
      }
    }
  }
  ${GearSlotDefRefFragment}
  ${DamageTypeValuesFragment}
`;
