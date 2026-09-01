/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { CombatEvent } from '../../_baseGame/types/CombatEvent';

export type CombatEventListener = (events: CombatEvent[]) => void;

export interface CombatFunctions {
  bindCombatEventListener(listener: CombatEventListener): ListenerHandle;
}

export interface CombatMocks {}

abstract class CombatFunctionsBase implements CombatFunctions, CombatMocks {
  abstract bindCombatEventListener(listener: CombatEventListener): ListenerHandle;
}

class CoherentCombatFunctions extends CombatFunctionsBase {
  bindCombatEventListener(listener: CombatEventListener): ListenerHandle {
    const innerHandle = engine.on('combatEvent', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
}

class BrowserCombatFunctions extends CombatFunctionsBase {
  bindCombatEventListener(listener: CombatEventListener): ListenerHandle {
    return { close() {} };
  }
}

export const impl: CombatFunctions & CombatMocks = engine.isAttached
  ? new CoherentCombatFunctions()
  : new BrowserCombatFunctions();
