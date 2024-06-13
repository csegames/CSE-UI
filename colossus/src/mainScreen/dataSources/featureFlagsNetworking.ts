/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { featureFlagQuery, FeatureFlagQueryResult } from './featureFlagsNetworkingConstants';
import { updateFeatureFlags } from '../redux/featureFlagsSlice';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

export class FeatureFlagsService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<FeatureFlagQueryResult>(
        { query: featureFlagQuery },
        this.handleFeatureFlags.bind(this),
        InitTopic.Features
      )
    ];
  }

  private async handleFeatureFlags(result: FeatureFlagQueryResult): Promise<void> {
    var clientBuild = await clientAPI.getBuildNumber();
    this.dispatch(
      updateFeatureFlags({ clientBuild, serverBuild: result.serverBuildNumber, flags: result.featureFlags })
    );
  }
}
