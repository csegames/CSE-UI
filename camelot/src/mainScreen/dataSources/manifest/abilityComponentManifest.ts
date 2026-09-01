/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateAbilityComponents } from '../../redux/gameDefsSlice';

export const abilityComponentsManifestID = 'abilitycomponents';

// keep in sync with AbilityBarKind.cs
export enum AbilityBarKind {
  Normal = 'Normal',
  SiegeEngine = 'SiegeEngine',
  Dynamic = 'Dynamic',
  Other = 'Other',
  Hidden = 'Hidden',
  COUNT = 'COUNT'
}

export interface AbilityNetworkRequirementDef {
  requireTag: string;
  excludeTag: string;
  requireComponentID: string;
  excludeComponentID: string;
}

export interface AbilityComponentDef {
  id: string;
  name: string;
  iconURL: string;
  description: string;
  tags: string[];
  abilityComponentCategoryID: string;
  abilityBarKind: AbilityBarKind;
  requirements: AbilityNetworkRequirementDef[];
}

export function processAbilityComponents(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isAbilityComponentData)) {
    console.error('Invalid AbilityComponent manifest file');
    return;
  }

  var components: Dictionary<AbilityComponentDef> = {};

  for (const componentJson of json.defs) {
    switch (version) {
      case 1:
        components[componentJson.id] = {
          id: componentJson.id,
          name: componentJson.name,
          iconURL: componentJson.iconURL,
          description: componentJson.description,
          tags: componentJson.tags,
          abilityComponentCategoryID: componentJson.abilityComponentCategoryID,
          abilityBarKind: componentJson.abilityBarKind,
          requirements: componentJson.requirements
        };
        break;
    }
  }

  dispatch(updateAbilityComponents(components));
}

function isAbilityComponentData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 8 &&
        'id' in obj &&
        'name' in obj &&
        'iconURL' in obj &&
        'description' in obj &&
        'tags' in obj &&
        'abilityComponentCategoryID' in obj &&
        'abilityBarKind' in obj &&
        'requirements' in obj;
      if (!isCorrectType || !Array.isArray(obj.requirements)) {
        console.error(`Found invalid AbilityComponent object`, obj);
        return false;
      } else {
        for (const requirement of obj.requirements) {
          const requirementCorrectType =
            Object.keys(requirement).length === 3 &&
            'raceID' in requirement &&
            'requireTag' in requirement &&
            'excludeTag' in requirement &&
            'requireComponentID' in requirement &&
            'excludeComponentID' in requirement;
          if (!requirementCorrectType) {
            console.error(`Found invalid AbilityComponent requirements object`, requirement);
            return false;
          }
        }
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Class version ${version}`);
      return false;
  }
}
