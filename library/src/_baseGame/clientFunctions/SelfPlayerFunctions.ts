/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SelfPlayerStateModel } from '../GameClientModels/SelfPlayerState';
import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../listenerHandle';

export type SelfPlayerStateListener = (state: SelfPlayerStateModel) => void;

export interface SelfPlayerFunctions {
  bindSelfPlayerStateListener(listener: SelfPlayerStateListener): ListenerHandle;
}

class CoherentPlayerFunctions implements SelfPlayerFunctions {
  bindSelfPlayerStateListener(listener: SelfPlayerStateListener): ListenerHandle {
    const innerHandle = engine.on('selfPlayerState.update', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
}

class BrowserPlayerFunctions implements SelfPlayerFunctions {
  bindSelfPlayerStateListener(listener: SelfPlayerStateListener): ListenerHandle {
    return { close() {} };
  }
}

export const impl: SelfPlayerFunctions = engine.isAttached
  ? new CoherentPlayerFunctions()
  : new BrowserPlayerFunctions();
