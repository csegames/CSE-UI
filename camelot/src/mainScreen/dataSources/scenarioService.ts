/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { scenarioQueueQuery, ScenarioQueryResult } from './scenarioNetworkingConstants';
import { setShouldScenarioRefresh, updateScenarioQueue } from '../redux/scenarioSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';

export class ScenarioService extends ExternalDataSource {
  private pendingRefreshes: number = 0;
  private refreshHandle: ListenerHandle = null;

  protected async bind(): Promise<ListenerHandle[]> {
    // TODO: Convert the GraphQL query to a subscription in order to eliminate this setInterval
    window.setInterval(() => {
      this.dispatch(setShouldScenarioRefresh(true));
    }, 2000);
    return [];
  }

  private handleScenario(result: ScenarioQueryResult): void {
    if (this.pendingRefreshes > 0) {
      this.pendingRefreshes--;
    }
    if (this.pendingRefreshes === 0) {
      this.dispatch(updateScenarioQueue(result.myScenarioQueue));
      this.refreshHandle?.close();
      this.refreshHandle = null;
    }
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    if (reduxState.scenario.shouldScenarioRefresh) {
      this.refresh();
    }
  }

  private async refresh(): Promise<void> {
    this.pendingRefreshes++;
    this.dispatch(setShouldScenarioRefresh(false));
    this.refreshHandle?.close();
    this.refreshHandle = await this.query<ScenarioQueryResult>(
      { query: scenarioQueueQuery },
      this.handleScenario.bind(this)
    );
  }
}
