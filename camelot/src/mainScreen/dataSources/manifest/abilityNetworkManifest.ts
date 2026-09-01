/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { updateAbilityNetworks } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const abilityNetworksManifestID = 'abilitynetworks';

export interface AbilityNetworkDef {
  id: string;
  name: string;
  abilityBuilderHueRotation: string;
  abilityBuilderMaskImage: string;
  abilityBuilderNameplateImage: string;
  abilityBookTabID: string;
  abilityComponentCategoryIDS: string[];
}

export function processAbilityNetworks(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isAbilityNetworkData)) {
    console.error('Invalid AbilityNetwork manifest file');
    return;
  }

  var networks: Dictionary<AbilityNetworkDef> = {};

  for (const network of json.defs) {
    switch (version) {
      case 1:
        networks[network.id] = {
          id: network.id,
          name: network.name,
          abilityBuilderHueRotation: network.abilityBuilderHueRotation,
          abilityBuilderMaskImage: network.abilityBuilderMaskImage,
          abilityBuilderNameplateImage: network.abilityBuilderNameplateImage,
          abilityBookTabID: network.abilityBookTabID,
          abilityComponentCategoryIDS: network.abilityComponentCategoryIDS
        };
        break;
    }
  }

  dispatch(updateAbilityNetworks(networks));
}

function isAbilityNetworkData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 7 &&
        'id' in obj &&
        'name' in obj &&
        'abilityBuilderHueRotation' in obj &&
        'abilityBuilderMaskImage' in obj &&
        'abilityBuilderNameplateImage' in obj &&
        'abilityBookTabID' in obj &&
        'abilityComponentCategoryIDS' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid AbilityNetwork object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid AbilityNetwork version ${version}`);
      return false;
  }
}
