import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import { updateStatusDefs } from '../../redux/gameSlice';

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
  if (!isStatusesDataArray(json.defs)) {
    console.error('Invalid statuses manifest file');
    return;
  }

  const statusesByID: Dictionary<StatusDef> = {};
  const statusesByNumericID: Dictionary<StatusDef> = {};

  for (const status of json.defs) {
    statusesByNumericID[status.numericID] = {
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
    statusesByID[status.id] = statusesByNumericID[status.numericID];
  }

  dispatch(updateStatusDefs(statusesByID, statusesByNumericID));
}

function isStatusData(obj: any): obj is StatusDef {
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
}

function isStatusesDataArray(obj: any): obj is StatusDef[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isStatusData(arrayEntry);
      }) === undefined
    );
  }
}
