/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { KeyActionsModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/KeyActions';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { updateKeyActions } from '../redux/keyActionsSlice';

export class KeyActionsService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindKeyActionsUpdateListener(this.handleKeyActionsUpdated.bind(this))]);
  }

  private handleKeyActionsUpdated(keyActions: KeyActionsModel) {
    this.dispatch(updateKeyActions(keyActions));
  }
}
