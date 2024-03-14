/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { championInfoQuery, ChampionInfoQueryResult } from './championInfoNetworkingConstants';
import { InitTopic } from '../redux/initializationSlice';
import { updateServerTimeDelta } from '../redux/clockSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { ChampionInfo } from '@csegames/library/dist/hordetest/graphql/schema';
import { updateChampionInfo } from '../redux/championInfoSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

export class ChampionInfoService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<ChampionInfoQueryResult>(
        { query: championInfoQuery },
        this.handleChampionInfo.bind(this),
        InitTopic.ChampionInfo
      )
    ];
  }

  private handleChampionInfo(result: ChampionInfoQueryResult): void {
    if (!result.championCostumes || !result.champions || !result.serverTimestamp) {
      console.error('Missing data, championCostumes, or champions from ChampionInfoContextQuery query');
      return;
    }

    const champions = result.champions;
    const championCostumes = result.championCostumes;
    const championIDToChampion: Dictionary<ChampionInfo> = {};
    champions.forEach((champion) => {
      championIDToChampion[champion.id] = champion;
    });

    this.dispatch(updateServerTimeDelta(result.serverTimestamp));
    this.dispatch(updateChampionInfo({ champions, championCostumes, championIDToChampion }));
  }
}
