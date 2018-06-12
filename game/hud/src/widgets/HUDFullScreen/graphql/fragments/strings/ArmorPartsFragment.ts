/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { GearSlotDefRefFragment } from './GearSlotDefRefFragment';
import { DamageTypeValuesFragment } from './DamageTypeValuesFragment';

export const ArmorPartsFragment = `
  statsPerSlot {
    gearSlot {
      ${GearSlotDefRefFragment}
    }
    stats {
      armorClass
    }
    resistances {
      ${DamageTypeValuesFragment}
    }
    mitigations {
      ${DamageTypeValuesFragment}
    }
  }
`;
