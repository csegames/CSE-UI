/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateEntityResources } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const entityResourcesManifestID = 'entityresources';

// keep in sync with UnitFrameDisplay.cs
export enum UnitFrameDisplay {
  Hidden = 'Hidden',
  HiddenWhenCurrentValue0 = 'HiddenWhenCurrentValue0',
  Visible = 'Visible'
}

export interface EntityResourceDef {
  id: string;
  numericID: number;
  name: string;
  categoryID: string;
  sortOrder: number;
  unitFrameSortOrder: number;
  tooltipTextColor: string;
  unitFrameDisplay: UnitFrameDisplay;
  itemStatBackedMax: string;
  barIconClass: string;
}

export function processEntityResources(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isEntityResourceData)) {
    console.error('Invalid EntityResources manifest file');
    return;
  }

  var resourcesByStringID: Record<string, EntityResourceDef> = {};
  var resourcesByNumericID: Record<number, EntityResourceDef> = {};

  for (const resource of json.defs) {
    switch (version) {
      case 1:
        const resourceDef = {
          id: resource.id,
          numericID: resource.numericID,
          name: resource.name,
          categoryID: resource.categoryID,
          sortOrder: resource.sortOrder,
          unitFrameSortOrder: resource.unitFrameSortOrder,
          addPointsAtCharacterCreation: resource.addPointsAtCharacterCreation,
          tooltipTextColor: resource.tooltipTextColor,
          unitFrameDisplay: resource.unitFrameDisplay,
          itemStatBackedMax: resource.itemStatBackedMax,
          barIconClass: resource.barIconClass
        };
        resourcesByStringID[resourceDef.id] = resourceDef;
        resourcesByNumericID[resourceDef.numericID] = resourceDef;
        break;
    }
  }

  dispatch(updateEntityResources([resourcesByStringID, resourcesByNumericID]));
}

function isEntityResourceData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 10 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'categoryID' in obj &&
        'sortOrder' in obj &&
        'unitFrameSortOrder' in obj &&
        'tooltipTextColor' in obj &&
        'unitFrameDisplay' in obj &&
        'itemStatBackedMax' in obj &&
        'barIconClass' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid EntityResource object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid EntityResource version ${version}`);
      return false;
  }
}
