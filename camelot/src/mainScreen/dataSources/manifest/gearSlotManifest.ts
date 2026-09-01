/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateGearSlots } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const gearSlotsManifestID = 'gearslots';

export interface GearSlotDef {
  id: string;
  numericID: number;
  name: string;
  iconClass: string;
}

export function processGearSlots(dispatch: Dispatch, json: any, version: number): void {
  const gearSlots: Record<string, GearSlotDef> = {};

  if (!isDataArray(json.defs, version, isGearSlotData)) {
    console.error('Invalid gearSlots manifest file');
    return;
  }

  for (const gearSlot of json.defs) {
    switch (version) {
      case 1:
        gearSlots[gearSlot.id] = {
          id: gearSlot.id,
          numericID: gearSlot.numericID,
          name: gearSlot.name,
          iconClass: gearSlot.iconClass
        };
        break;
      case 2:
        gearSlots[gearSlot.id] = {
          id: gearSlot.id,
          numericID: gearSlot.numericID,
          name: gearSlot.name,
          iconClass: gearSlot.iconClass
        };
        break;
    }
  }

  dispatch(updateGearSlots(gearSlots));
}

function isGearSlotData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectTypev1 =
        Object.keys(obj).length === 5 && 'id' in obj && 'numericID' in obj && 'name' in obj && 'iconClass' in obj;
      if (!isCorrectTypev1) {
        console.error(`Found invalid gearslot object`, obj);
      }
      return isCorrectTypev1;
    case 2:
      const isCorrectTypev2 =
        Object.keys(obj).length === 4 && 'id' in obj && 'numericID' in obj && 'name' in obj && 'iconClass' in obj;
      if (!isCorrectTypev2) {
        console.error(`Found invalid gearslot object`, obj);
      }
      return isCorrectTypev2;
    default:
      console.error(`Found invalid gearslot version ${version}`);
      return false;
  }
}
