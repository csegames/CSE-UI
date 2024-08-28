/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../../redux/externalDataSource';
import { ManifestDef } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dispatch } from '@reduxjs/toolkit';
import { factionManifestID, processFactions } from './factionManifest';
import { processStatuses, statusManifestID } from './statusManifest';

export class ManifestDefService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([clientAPI.bindManifestDefsListener(this.handleManifestDefsChanged.bind(this))]);

    return handles;
  }

  private handleManifestDefsChanged(defs: ManifestDef[]) {
    if (this.reduxState.gameDefs.useClientResourceManifests) {
      defs.forEach((manifest: ManifestDef) => {
        processManifest(this.dispatch, manifest.id, manifest.contents, manifest.schemaVersion);
      });
    }
  }
}

export function processManifest(dispatch: Dispatch, id: string, contents: string, version: number): void {
  const json = JSON.parse(contents);
  switch (id) {
    case factionManifestID: {
      processFactions(dispatch, json, version);
      break;
    }
    case statusManifestID: {
      processStatuses(dispatch, json, version);
      break;
    }
    default: {
      console.error('Unexpected manifest ' + id);
      break;
    }
  }
}
