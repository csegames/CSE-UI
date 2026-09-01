/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateAbilityBookTabs } from '../../redux/gameDefsSlice';

export const abilityBookTabsManifestID = 'abilitybooktabs';

export interface AbilityBookTabDef {
  id: string;
  name: string;
  iconClass: string;
  sortOrder: number;
}

export function processAbilityBookTabs(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isAbilityBookTabData)) {
    console.error('Invalid AbilityBookTab manifest file');
    return;
  }

  var abilityBookTabs: AbilityBookTabDef[] = [];

  for (const tab of json.defs) {
    switch (version) {
      case 1:
        abilityBookTabs.push({
          id: tab.id,
          name: tab.name,
          iconClass: tab.iconClass,
          sortOrder: tab.sortOrder
        });
        break;
    }
  }

  abilityBookTabs.sort((a: AbilityBookTabDef, b: AbilityBookTabDef) => {
    return a.sortOrder - b.sortOrder;
  });
  dispatch(updateAbilityBookTabs(abilityBookTabs));
}

function isAbilityBookTabData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 4 && 'id' in obj && 'iconClass' in obj && 'name' in obj && 'sortOrder' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid AbilityBookTab object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid AbilityBookTab version ${version}`);
      return false;
  }
}
