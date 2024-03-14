/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { Dispatch } from '@reduxjs/toolkit';
import ExternalDataSource from '../redux/externalDataSource';
import { setKeybinds } from '../redux/keybindsSlice';

export function refetchKeybinds(dispatch: Dispatch) {
  dispatch(setKeybinds(game.keybinds));
}

export class KeybindsService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    refetchKeybinds(this.dispatch);

    // While the client does provide a "keybindChanged" event, that event is fairly worthless
    // to us, as the UI is already the one triggering all keybind changes.

    return Promise.resolve([]);
  }
}
