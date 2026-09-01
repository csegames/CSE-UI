/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../../redux/externalDataSource';
import { Dispatch } from '@reduxjs/toolkit';
import { ManifestDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { RootState } from '../../redux/store';
import { setGameDefsLoaded } from '../../redux/gameSlice';
import { abilityDisplayManifestID, processAbilityDisplays } from './abilityDisplayManifest';
import { championManifestID, processChampions } from './championManifest';
import { costumeManifestID, processCostumes } from './costumeManifest';
import { gameModeManifestID, processGameModes } from './gameModeManifest';
import { gameSettingsManifestID, processGameSettings } from './gameSettingsManifest';
import { itemsManifestID, processItems } from './itemManifest';
import { killStreakManifestID, processKillStreaks } from './killStreakManifest';
import { performanceWarningManifestID, processPerformanceWarning } from './performanceWarningManifest';
import { perkManifestID, processPerks } from './perkManifest';
import { processProgressionNodes, progressionNodeManifestID } from './progressionNodeManifest';
import { processQuests, questManifestID } from './questManifest';
import { processScenarios, scenarioManifestID } from './scenarioManifest';
import { processStats, statsManifestID } from './statManifest';
import { processStatuses, statusManifestID } from './statusManifest';
import { processStringTable, stringTableManifestID } from './stringTableManifest';

export class ManifestDefService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([clientAPI.bindManifestDefsListener(this.handleManifestDefsChanged.bind(this))]);

    return handles;
  }

  private handleManifestDefsChanged(defs: ManifestDef[]) {
    if (this.reduxState.game.useClientResourceManifests) {
      defs.forEach((manifest: ManifestDef) => {
        processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion, this.reduxState);
      });

      this.dispatch(setGameDefsLoaded());
    }
  }
}

export function processManifest(
  dispatch: Dispatch,
  id: string,
  contents: string,
  version: number,
  reduxState: RootState
): void {
  const json = JSON.parse(contents);
  switch (id) {
    case abilityDisplayManifestID: {
      processAbilityDisplays(dispatch, json, version);
      break;
    }
    case championManifestID: {
      processChampions(dispatch, json, version);
      break;
    }
    case costumeManifestID: {
      processCostumes(dispatch, json, version);
      break;
    }
    case gameModeManifestID: {
      processGameModes(dispatch, json, version);
      break;
    }
    case gameSettingsManifestID: {
      processGameSettings(dispatch, json, version);
      break;
    }
    case itemsManifestID: {
      processItems(dispatch, json, version);
      break;
    }
    case killStreakManifestID: {
      processKillStreaks(dispatch, json, version);
      break;
    }
    case perkManifestID: {
      processPerks(dispatch, json, version, reduxState);
      break;
    }
    case performanceWarningManifestID: {
      processPerformanceWarning(dispatch, json, version);
      break;
    }
    case progressionNodeManifestID: {
      processProgressionNodes(dispatch, json, version);
      break;
    }
    case questManifestID: {
      processQuests(dispatch, json, version);
      break;
    }
    case scenarioManifestID: {
      processScenarios(dispatch, json, version);
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
