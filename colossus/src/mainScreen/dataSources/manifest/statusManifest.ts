/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import { updateStatusDefs } from '../../redux/gameSlice';
import { isDataArray } from './manifestDefService';

export const statusManifestID = 'statuses';

export interface StatusDef {
  id: string;
  numericID: number;
  uiText: string;
  showInHUD: boolean;
  showOnAdd: boolean;
  showOnRemove: boolean;
  showOnInactive: boolean;
  blocksAbilities: boolean;
  statusTags: string[];
  name: string;
  description: string;
  iconURL: string;
  iconClass: string;
}

export function processStatuses(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isStatusData)) {
    console.error('Invalid statuses manifest file');
    return;
  }

  const statusDefsByID: Dictionary<StatusDef> = {};
  const statusDefsByNumericID: Dictionary<StatusDef> = {};

  for (const status of json.defs) {
    switch (version) {
      case 1:
        statusDefsByNumericID[status.numericID] = {
          id: status.id,
          numericID: Number(status.numericID),
          uiText: status.uiText,
          showInHUD: status.showInHUD,
          showOnAdd: status.showOnAdd,
          showOnRemove: status.showOnRemove,
          showOnInactive: status.showOnInactive,
          blocksAbilities: status.blocksAbilities,
          statusTags: status.statusTags,
          name: status.name,
          description: status.description,
          iconURL: status.iconURL,
          iconClass: status.iconClass
        };
        statusDefsByID[status.id] = statusDefsByNumericID[status.numericID];
        break;
    }
  }

  dispatch(updateStatusDefs({ statusDefsByID, statusDefsByNumericID }));
}

function isStatusData(obj: any, version: number): obj is StatusDef {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 13 &&
        'id' in obj &&
        'numericID' in obj &&
        'uiText' in obj &&
        'showInHUD' in obj &&
        'showOnAdd' in obj &&
        'showOnRemove' in obj &&
        'showOnInactive' in obj &&
        'blocksAbilities' in obj &&
        'statusTags' in obj &&
        'name' in obj &&
        'description' in obj &&
        'iconURL' in obj &&
        'iconClass' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid Status object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Status version ${version}`);
      return;
  }
}
