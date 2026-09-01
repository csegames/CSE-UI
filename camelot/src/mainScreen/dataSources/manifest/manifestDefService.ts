/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ManifestDef } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { Dispatch } from '@reduxjs/toolkit';
import { ExternalDataSource } from '../../redux/externalDataSource';
import { setGameDefsLoaded } from '../../redux/loadingSlice';
import { abilityBookTabsManifestID, processAbilityBookTabs } from './abilityBookTabManifest';
import {
  abilityComponentCategoriesManifestID,
  processAbilityComponentCategories
} from './abilityComponentCategoryManifest';
import { abilityComponentsManifestID, processAbilityComponents } from './abilityComponentManifest';
import { abilityDisplayManifestID, processAbilityDisplays } from './abilityDisplayManifest';
import { abilityNetworksManifestID, processAbilityNetworks } from './abilityNetworkManifest';
import { armorCategoryManifestID, processArmorCategories } from './armorCategoryManifest';
import { bodyTypesManifestID, processBodyTypes } from './bodyTypeManifest';
import { classesManifestID, processClasses } from './classManifest';
import { craftingJobManifestID, processCraftingJobs } from './craftingJobManifest';
import { damageTypesManifestID, processDamageTypes } from './damageTypeManifest';
import { entityResourcesManifestID, processEntityResources } from './entityResourceManifest';
import { factionManifestID, processFactions } from './factionManifest';
import { gameSettingsManifestID, processGameSettings } from './gameSettingsManifest';
import { gearSlotsManifestID, processGearSlots } from './gearSlotManifest';
import { ingredientEffectManifestID, processIngredientEffects } from './ingredientEffectManifest';
import { itemsManifestID, processItems } from './itemManifest';
import { itemModSetManifestID, processItemModSets } from './itemModSetManifest';
import { itemRecipeManifestID, processItemRecipes } from './itemRecipeManifest';
import { itemTooltipCategoriesManifestID, processItemTooltipCategories } from './itemTooltipCategoryManifest';
import { performanceWarningManifestID, processPerformanceWarning } from './performanceWarningManifest';
import { progressionTrackManifestID, processProgressionTracks } from './progressionTrackManifest';
import { processRaces, racesManifestID } from './raceManifest';
import { processRequirements, requirementManifestID } from './requirementManifest';
import { processStatLoadouts, statLoadoutManifestID } from './statLoadoutManifest';
import { processStats, statsManifestID } from './statManifest';
import { processStatuses, statusManifestID } from './statusManifest';
import { processStringTable, stringTableManifestID } from './stringTableManifest';
import { processTags, tagsManifestID } from './tagManifest';
import { processWeaponCategories, weaponCategoryManifestID } from './weaponCategoryManifest';
import { processWeaponClasses, weaponClassManifestID } from './weaponClassManifest';
import { processWeaponTypes, weaponTypeManifestID } from './weaponTypeManifest';
import { processQuestDefs, questDefManifestID } from './questDefManifest';

export class ManifestDefService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([clientAPI.bindManifestDefsListener(this.handleManifestDefsChanged.bind(this))]);

    return handles;
  }

  private handleManifestDefsChanged(defs: ManifestDef[]) {
    if (this.reduxState.gameDefs.useClientResourceManifests) {
      defs.forEach((manifest: ManifestDef) => {
        processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion);
      });
      this.dispatch(setGameDefsLoaded());
    }
  }
}

export function processManifest(dispatch: Dispatch, id: string, contents: string, version: number): void {
  const json = JSON.parse(contents);
  switch (id) {
    case abilityBookTabsManifestID: {
      processAbilityBookTabs(dispatch, json, version);
      break;
    }
    case abilityComponentCategoriesManifestID: {
      processAbilityComponentCategories(dispatch, json, version);
      break;
    }
    case abilityComponentsManifestID: {
      processAbilityComponents(dispatch, json, version);
      break;
    }
    case abilityDisplayManifestID: {
      processAbilityDisplays(dispatch, json, version);
      break;
    }
    case abilityNetworksManifestID: {
      processAbilityNetworks(dispatch, json, version);
      break;
    }
    case armorCategoryManifestID: {
      processArmorCategories(dispatch, json, version);
      break;
    }
    case bodyTypesManifestID: {
      processBodyTypes(dispatch, json, version);
      break;
    }
    case classesManifestID: {
      processClasses(dispatch, json, version);
      break;
    }
    case craftingJobManifestID: {
      processCraftingJobs(dispatch, json, version);
      break;
    }
    case damageTypesManifestID: {
      processDamageTypes(dispatch, json, version);
      break;
    }
    case entityResourcesManifestID: {
      processEntityResources(dispatch, json, version);
      break;
    }
    case factionManifestID: {
      processFactions(dispatch, json, version);
      break;
    }
    case gameSettingsManifestID: {
      processGameSettings(dispatch, json, version);
      break;
    }
    case gearSlotsManifestID: {
      processGearSlots(dispatch, json, version);
      break;
    }
    case ingredientEffectManifestID: {
      processIngredientEffects(dispatch, json, version);
      break;
    }
    case itemsManifestID: {
      processItems(dispatch, json, version);
      break;
    }
    case itemModSetManifestID: {
      processItemModSets(dispatch, json, version);
      break;
    }
    case itemRecipeManifestID: {
      processItemRecipes(dispatch, json, version);
      break;
    }
    case itemTooltipCategoriesManifestID: {
      processItemTooltipCategories(dispatch, json, version);
      break;
    }
    case performanceWarningManifestID: {
      processPerformanceWarning(dispatch, json, version);
      break;
    }
    case progressionTrackManifestID: {
      processProgressionTracks(dispatch, json, version);
      break;
    }
    case questDefManifestID: {
      processQuestDefs(dispatch, json, version);
      break;
    }
    case racesManifestID: {
      processRaces(dispatch, json, version);
      break;
    }
    case requirementManifestID: {
      processRequirements(dispatch, json, version);
      break;
    }
    case statLoadoutManifestID: {
      processStatLoadouts(dispatch, json, version);
      break;
    }
    case statusManifestID: {
      processStatuses(dispatch, json, version);
      break;
    }
    case statsManifestID: {
      processStats(dispatch, json, version);
      break;
    }
    case stringTableManifestID: {
      processStringTable(dispatch, json, version);
      break;
    }
    case tagsManifestID: {
      processTags(dispatch, json, version);
      break;
    }
    case weaponCategoryManifestID: {
      processWeaponCategories(dispatch, json, version);
      break;
    }
    case weaponClassManifestID: {
      processWeaponClasses(dispatch, json, version);
      break;
    }
    case weaponTypeManifestID: {
      processWeaponTypes(dispatch, json, version);
      break;
    }
    default: {
      console.error('Unexpected manifest ' + id);
      break;
    }
  }
}

export function isDataArray(obj: any, version: number, process: (obj: object, version: number) => boolean): boolean {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    return (
      obj.find((arrayEntry) => {
        return !process(arrayEntry, version);
      }) === undefined
    );
  }
}
