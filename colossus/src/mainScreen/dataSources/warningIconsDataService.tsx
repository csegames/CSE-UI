/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { WarningIconsModel } from '@csegames/library/dist/_baseGame/types/WarningIcons';
import { updateWarningIcons } from '../redux/warningIconsSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import ExternalDataSource from '../redux/externalDataSource';
import { RootState } from '../redux/store';
import { Dispatch } from 'redux';

export class WarningIconsDataService extends ExternalDataSource {
  public bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindWarningIconsListener(this.handleWarningIconsUpdate.bind(this))]);
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    let oldIcons: string[] = this.reduxState?.warningIcons?.icons ?? [];
    super.onReduxUpdate(reduxState, dispatch);
    let icons: string[] = this.reduxState?.warningIcons?.icons ?? [];

    // If newKeys has it but previous state doesn't, report ADDED.
    oldIcons.forEach((icon) => {
      if (!icons.includes(icon)) {
        console.log(`PerfIcons: ${icon} added.`);
      }
    });

    // If previous state has it but newIcons doesn't, report REMOVED.
    icons.forEach((icon) => {
      if (!oldIcons.includes(icon)) {
        console.log(`PerfIcons: ${icon} removed.`);
      }
    });
  }

  private handleWarningIconsUpdate(stats: WarningIconsModel) {
    this.dispatch(updateWarningIcons(stats));
  }
}
