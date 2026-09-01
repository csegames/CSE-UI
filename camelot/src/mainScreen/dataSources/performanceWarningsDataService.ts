/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PerformanceWarningsModel } from '@csegames/library/dist/_baseGame/types/PerformanceWarnings';
import { updateActivePerformanceWarnings } from '../redux/performanceWarningsSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ExternalDataSource } from '../redux/externalDataSource';

export class PerformanceWarningsDataService extends ExternalDataSource {
  private prevIDs: string[] = [];

  public bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindPerformanceWarningsListener(this.handlePerformanceWarningsUpdate.bind(this))
    ]);
  }

  private handlePerformanceWarningsUpdate(stats: PerformanceWarningsModel) {
    // If newKeys has it but previous state doesn't, report ADDED.
    for (const id of stats.ids) {
      if (!this.prevIDs.includes(id)) {
        console.log(`PerfIcons: ${id} added.`);
      }
    }

    // If previous state has it but newIcons doesn't, report REMOVED.
    for (const id of this.prevIDs) {
      if (!stats.ids.includes(id)) {
        console.log(`PerfIcons: ${id} removed.`);
      }
    }
    this.prevIDs = stats.ids.slice();
    this.dispatch(updateActivePerformanceWarnings(stats));
  }
}
