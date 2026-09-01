/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ExternalDataSource } from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { setWarband } from '../redux/warbandSlice';

export class WarbandService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindWarbandListener(this.handleWarbandUpdate.bind(this))]);
  }

  private handleWarbandUpdate(result: WarbandSnapshot): void {
    this.dispatch(setWarband(result));
  }
}
