/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PerformanceWarningsModel } from '@csegames/library/dist/_baseGame/types/PerformanceWarnings';
import { updateActivePerformanceWarnings } from '../redux/performanceWarningsSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import ExternalDataSource from '../redux/externalDataSource';
import { RootState } from '../redux/store';
import { Dispatch } from 'redux';

export class PerformanceWarningsDataService extends ExternalDataSource {
  public bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindPerformanceWarningsListener(this.handlePerformanceWarningsUpdate.bind(this))
    ]);
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    const previousPerformanceWarningIDs: string[] =
      this.reduxState?.performanceWarnings?.activePerformanceWarningIDs ?? [];
    super.onReduxUpdate(reduxState, dispatch);
    const performanceWarningIDs: string[] = this.reduxState?.performanceWarnings?.activePerformanceWarningIDs ?? [];

    // If newKeys has it but previous state doesn't, report ADDED.
    performanceWarningIDs.forEach((icon) => {
      if (!previousPerformanceWarningIDs.includes(icon)) {
        console.log(`PerfIcons: ${icon} added.`);
      }
    });

    // If previous state has it but newIcons doesn't, report REMOVED.
    previousPerformanceWarningIDs.forEach((icon) => {
      if (!performanceWarningIDs.includes(icon)) {
        console.log(`PerfIcons: ${icon} removed.`);
      }
    });
  }

  private handlePerformanceWarningsUpdate(stats: PerformanceWarningsModel) {
    this.dispatch(updateActivePerformanceWarnings(stats));
  }
}
