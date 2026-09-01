/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';
import { ExternalDataSource } from '../redux/externalDataSource';
import { showConditionalWidget } from '../redux/hudSlice';
import { WIDGET_ID_GAME_INFO } from '../components/GameInfo';

// Shows the GameInfo popup the first time the client connects to a game server each session,
// unless the player has unchecked "Show At Startup" in a prior session.
export class GameInfoService extends ExternalDataSource {
  private hasShown = false;

  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindConnectionStatusListener(this.onConnectionStatusChanged.bind(this))]);
  }

  private onConnectionStatusChanged(status: ConnectionStatus, _zoneID: string): void {
    if (status === ConnectionStatus.Connected && !this.hasShown && clientAPI.getShowGameInfoAtStartup()) {
      this.hasShown = true;
      this.dispatch(showConditionalWidget(WIDGET_ID_GAME_INFO));
    }
  }
}
