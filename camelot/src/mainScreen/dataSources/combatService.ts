/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { game } from '@csegames/library/dist/_baseGame';
import { CombatEvent } from '@csegames/library/dist/_baseGame/types/CombatEvent';
import { updateEvents } from '../redux/combatSlice';

export class CombatService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([game.onCombatEvent(this.handleCombatEvent.bind(this))]);

    return handles;
  }

  private handleCombatEvent(events: CombatEvent[]) {
    this.dispatch(updateEvents(events));
  }
}
