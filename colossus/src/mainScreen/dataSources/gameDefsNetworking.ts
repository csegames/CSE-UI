/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import {
  gameDefsQuery,
  GameDefsQueryResult,
  manifestUpdateSubscription,
  ManifestUpdateSubscriptionResult
} from './gameDefsNetworkingConstants';
import { setGameDefsLoaded, setUseClientResourceManifests } from '../redux/gameSlice';
import { processManifest } from './manifest/manifestDefService';

export class GameDefsService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<GameDefsQueryResult>(
        { query: gameDefsQuery },
        this.handleGameDefs.bind(this)
      ),
      await this.subscribe<ManifestUpdateSubscriptionResult>(
        { query: manifestUpdateSubscription },
        this.handleMySubscriptionUpdate.bind(this)
      )
    ];
  }

  private handleGameDefs(result: GameDefsQueryResult): void {
    if (!result.game || !result.game.manifests) {
      console.error('Missing data from GameDefs query');
      return;
    }

    // manifests - manfiest list will only be filled with entries if the server is running its gameplayDefs
    // off of the disk instead of from the DB.  If we get any manifest from this query, we want to use them
    // instead of the ones from the client resource.
    if (result.game.manifests.length > 0) {
      this.dispatch(setUseClientResourceManifests(false));
      for (const manifest of result.game.manifests) {
        processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion, this.reduxState);
      }

      this.dispatch(setGameDefsLoaded());
    }
  }

  private handleMySubscriptionUpdate(manifestUpdateResult: ManifestUpdateSubscriptionResult): void {
    const result = manifestUpdateResult?.manifestUpdates?.manifests;
    if (!result) {
      console.warn('Got invalid response from ManifestUpdate subscription.', result);
      return;
    }

    for (const manifest of manifestUpdateResult.manifestUpdates.manifests) {
      processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion, this.reduxState);
    }
  }
}
