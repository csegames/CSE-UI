/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { setConnectionStatus, setLoadingPhase } from '../redux/loadingSlice';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';

export class LoadingService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindLoadingPhaseListener(this.onLoadingPhaseChanged.bind(this)),
      clientAPI.bindConnectionStatusListener(this.onConnectionStatusChanged.bind(this))
    ]);
  }

  private onLoadingPhaseChanged(phaseName: string | null): void {
    this.dispatch(setLoadingPhase(phaseName));
  }

  private onConnectionStatusChanged(status: ConnectionStatus, zoneID: string): void {
    this.dispatch(setConnectionStatus({ status, zoneID }));
  }
}
