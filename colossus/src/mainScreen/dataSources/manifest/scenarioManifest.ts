/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateScenarioDefs } from '../../redux/scenariosSlice';

export const scenarioManifestID = 'scenarios';

export interface ScenarioDef {
  id: string;
  name: string;
  description: string;
  applyChampionUpgrades: boolean;
  loadingBackgroundImage: string;
  loadingScreenAudioEventID: number;
  showLeaderboardTab: boolean;
  showPlayerProgressionTab: boolean;
  showScoreAsRank: boolean;
  summaryBackgroundImage: string;
}

export function processScenarios(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isScenarioData)) {
    console.error('Invalid Scenario manifest file');
    return;
  }

  var scenarios: Dictionary<ScenarioDef> = {};

  for (const scenario of json.defs) {
    switch (version) {
      case 1:
        scenarios[scenario.id] = {
          id: scenario.id,
          name: scenario.name,
          description: scenario.description,
          applyChampionUpgrades: scenario.applyChampionUpgrades,
          loadingBackgroundImage: scenario.loadingBackgroundImage,
          loadingScreenAudioEventID: Number(scenario.loadingScreenAudioEventID),
          showLeaderboardTab: scenario.showLeaderboardTab,
          showPlayerProgressionTab: scenario.showPlayerProgressionTab,
          showScoreAsRank: scenario.showScoreAsRank,
          summaryBackgroundImage: scenario.summaryBackgroundImage
        };
        break;
    }
  }

  dispatch(updateScenarioDefs(scenarios));
}

function isScenarioData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 10 &&
        'id' in obj &&
        'name' in obj &&
        'description' in obj &&
        'applyChampionUpgrades' in obj &&
        'loadingBackgroundImage' in obj &&
        'loadingScreenAudioEventID' in obj &&
        'showLeaderboardTab' in obj &&
        'showPlayerProgressionTab' in obj &&
        'showScoreAsRank' in obj &&
        'summaryBackgroundImage' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Scenario object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Scenario version ${version}`);
      return false;
  }
}
