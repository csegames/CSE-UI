/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ServersAPI, ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { updateZones } from '../redux/zonesSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';

export class ZonesService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [await this.call(ServersAPI.GetAvailableZones, this.handleZoneData.bind(this), InitTopic.Zones)];
  }

  private async handleZoneData(queryResult: RequestResult): Promise<boolean> {
    try {
      const data: ZoneInfo[] = JSON.parse(queryResult?.data) ?? [];
      const zones: Dictionary<ZoneInfo> = {};
      for (let i = 0; i < data.length; ++i) {
        zones[data[i].ID] = data[i];
      }
      this.dispatch(updateZones(zones));
      return data.length > 0;
    } catch (e) {
      console.error('Unable to parse zones', e);
      return false;
    }
  }
}
