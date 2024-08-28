/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import {
  gameSettingsQuery,
  GameSettingsQueryResult,
  manifestUpdateSubscription,
  ManifestUpdateSubscriptionResult
} from './gameSettingsNetworkingConstants';
import { updateGameSettings } from '../redux/gameSettingsSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { InitTopic } from '../redux/initializationSlice';
import { processManifest } from './manifest/manifestDefService';
import { setUseClientResourceManifests } from '../redux/gameSlice';

export class GameSettingsNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<GameSettingsQueryResult>(
        { query: gameSettingsQuery },
        this.handleGameSettings.bind(this),
        InitTopic.GameSettings
      ),
      await this.subscribe<ManifestUpdateSubscriptionResult>(
        { query: manifestUpdateSubscription },
        this.handleMySubscriptionUpdate.bind(this)
      )
    ];
  }

  private handleGameSettings(result: GameSettingsQueryResult): void {
    // Validate the result.
    if (!result?.game?.settings || !result?.game?.manifests) {
      console.warn('Received invalid response from GameSettings fetch.');
      return;
    }
    this.dispatch(updateGameSettings(result.game.settings));

    // manifests - manfiest list will only be filled with entries if the server is running its gameplayDefs
    // off of the disk instead of from the DB.  If we get any manifest from this query, we want to use them
    // instead of the ones from the client resource.
    if (result.game.manifests.length > 0) {
      this.dispatch(setUseClientResourceManifests(false));
      for (const manifest of result.game.manifests) {
        processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion);
      }
    }
  }

  private handleMySubscriptionUpdate(manifestUpdateResult: ManifestUpdateSubscriptionResult): void {
    const result = manifestUpdateResult?.manifestUpdates?.manifests;
    if (!result) {
      console.warn('Got invalid response from ManifestUpdate subscription.', result);
      return;
    }

    for (const manifest of manifestUpdateResult.manifestUpdates.manifests) {
      processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion);
    }
  }
}
