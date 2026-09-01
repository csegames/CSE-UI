/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
  gameDefsQuery,
  GameDefsQueryResult,
  ManifestUpdateSubscriptionResult,
  manifestUpdateSubscription
} from './gameDefsNetworkingConstants';
import { setUseClientResourceManifests } from '../redux/gameDefsSlice';
import { ExternalDataSource } from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { processManifest } from './manifest/manifestDefService';
import { setGameDefsLoaded } from '../redux/loadingSlice';
import { WithWebInterface } from '../redux/withWebInterface';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AGameDefsService extends WithWebInterface(ExternalDataSource<Props>) {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<GameDefsQueryResult>({ query: gameDefsQuery }, this.handleGameDefsQueryResult.bind(this)),
      await this.subscribe<ManifestUpdateSubscriptionResult>(
        { query: manifestUpdateSubscription },
        this.handleMySubscriptionUpdate.bind(this)
      )
    ];
  }

  private async handleGameDefsQueryResult(result: GameDefsQueryResult): Promise<boolean> {
    // Validate the result.
    if (!result.game || !result.game.manifests) {
      console.warn('Received invalid response from GameDefs fetch.');
      return false;
    }

    // manifests - manfiest list will only be filled with entries if the server is running its gameplayDefs
    // off of the disk instead of from the DB.  If we get any manifest from this query, we want to use them
    // instead of the ones from the client resource.
    if (result.game.manifests.length > 0) {
      this.dispatch(setUseClientResourceManifests(false));
      for (const manifest of result.game.manifests) {
        processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion);
      }
      this.dispatch(setGameDefsLoaded());
    }

    return true;
  }

  private handleMySubscriptionUpdate(manifestUpdateResult: ManifestUpdateSubscriptionResult): void {
    const result = manifestUpdateResult?.manifestUpdates?.manifests;
    if (!result) {
      console.warn('Got invalid response from ManifestUpdate subscription.', result);
      return;
    }
    this.dispatch(setUseClientResourceManifests(false)); // do not stomp our new values from disk
    for (const manifest of manifestUpdateResult.manifestUpdates.manifests) {
      processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const GameDefsService = connect(mapStateToProps)(AGameDefsService);
