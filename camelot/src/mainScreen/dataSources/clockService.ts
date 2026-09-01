/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ExternalDataSource } from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { updateServerTimeDelta } from '../redux/clockSlice';
import { clockQuery, ClockQueryResult } from './clockGraphQLConstants';
import { WithWebInterface } from '../redux/withWebInterface';

const CLOCK_REFRESH_DELAY_MS = 60000;

export class ClockService extends WithWebInterface(ExternalDataSource) {
  private refetchInterval: number = 0;
  private refetchHandle: ListenerHandle | null = null;

  protected async bind(): Promise<ListenerHandle[]> {
    // Polled fetch.
    this.refetchInterval = window.setInterval(async () => {
      // If a polled fetch got stuck in the gears, clear it out.
      if (this.refetchHandle) {
        this.refetchHandle.close();
        this.refetchHandle = null;
      }
      // Queue up another fetch.
      this.refetchHandle = await this.refetchClockQuery();
    }, CLOCK_REFRESH_DELAY_MS);

    // Initial fetch is immediate.
    const handles = Promise.resolve([
      await this.refetchClockQuery(),
      {
        close: () => {
          if (this.refetchHandle) {
            this.refetchHandle.close();
            this.refetchHandle = null;
          }
          if (this.refetchInterval) {
            window.clearInterval(this.refetchInterval);
            this.refetchInterval = 0;
          }
        }
      }
    ]);

    return handles;
  }

  private async refetchClockQuery(): Promise<ListenerHandle> {
    return await this.query<ClockQueryResult>({ query: clockQuery }, this.handleClockQuery.bind(this));
  }

  private handleClockQuery(result: ClockQueryResult): void {
    this.dispatch(updateServerTimeDelta(result.serverTimestamp!));
  }
}
