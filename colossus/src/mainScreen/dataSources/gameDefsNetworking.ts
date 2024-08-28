/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { InitTopic } from '../redux/initializationSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StatDefinitionGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { gameDefsQuery, GameDefsQueryResult } from './gameDefsNetworkingConstants';
import { updateStatDefs } from '../redux/gameSlice';

export class GameDefsService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<GameDefsQueryResult>(
        { query: gameDefsQuery },
        this.handleGameDefs.bind(this),
        InitTopic.GameDefs
      )
    ];
  }

  private handleGameDefs(result: GameDefsQueryResult): void {
    if (!result.game || !result.game.stats) {
      console.error('Missing data from GameDefs query');
      return;
    }

    const stats = result.game.stats;
    const statDefs: Dictionary<StatDefinitionGQL> = {};
    stats.forEach((sd) => {
      statDefs[sd.id] = sd;
    });

    this.dispatch(updateStatDefs(statDefs));
  }
}
