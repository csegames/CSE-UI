/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { updateClockMinuteTicker } from '../redux/clockSlice';

export class ClockDataSource extends ExternalDataSource {
  private minuteTimer: NodeJS.Timer;
  protected async bind(): Promise<ListenerHandle[]> {
    this.minuteTimer = setInterval(() => {
      this.dispatch(updateClockMinuteTicker());
    }, 60000);
    return [
      {
        close: () => {
          clearInterval(this.minuteTimer);
          this.minuteTimer = null;
        }
      }
    ];
  }
}
