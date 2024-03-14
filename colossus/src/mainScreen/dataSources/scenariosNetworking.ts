/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { scenariosQuery, ScenariosQueryResult } from './scenariosNetworkingConstants';
import { updateScenarioDefs } from '../redux/scenariosSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ScenarioDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { InitTopic } from '../redux/initializationSlice';

export class ScenariosNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<ScenariosQueryResult>(
        { query: scenariosQuery },
        this.handleScenarioDefs.bind(this),
        InitTopic.Scenarios
      )
    ];
  }

  private handleScenarioDefs(result: ScenariosQueryResult): void {
    // Validate the result.
    if (!result?.game?.scenarios) {
      console.warn('Received invalid response from Scenarios fetch.');
      return;
    }

    const entriesByID: Dictionary<ScenarioDefGQL> = {};
    for (const entry of result.game.scenarios) {
      entriesByID[entry.id] = entry;
    }

    this.dispatch(updateScenarioDefs(entriesByID));
  }
}
