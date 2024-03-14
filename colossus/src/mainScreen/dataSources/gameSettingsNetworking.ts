/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { gameSettingsQuery, GameSettingsQueryResult } from './gameSettingsNetworkingConstants';
import { updateGameSettings } from '../redux/gameSettingsSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { InitTopic } from '../redux/initializationSlice';

export class GameSettingsNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<GameSettingsQueryResult>(
        { query: gameSettingsQuery },
        this.handleGameSettings.bind(this),
        InitTopic.GameSettings
      )
    ];
  }

  private handleGameSettings(result: GameSettingsQueryResult): void {
    // Validate the result.
    if (!result?.game?.settings) {
      console.warn('Received invalid response from GameSettings fetch.');
      return;
    }
    this.dispatch(updateGameSettings(result.game.settings));
  }
}
