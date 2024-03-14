/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseDevGameInterface } from './BaseGameInterface';
import { ListenerHandle } from './listenerHandle';
import { engine, EngineHandle } from './engine';

// *** DEPRECATED : DO NOT EXPAND ***

export const regMap: { [key: string]: string } = {};

export const EE_BeginChat = 'beginChat';
regMap[EE_BeginChat] = 'onBeginChat';

export const EE_ConsoleText = 'consoleText';
regMap[EE_ConsoleText] = 'onConsoleText';

export const EE_CombatEvent = 'combatEvent';
regMap[EE_CombatEvent] = 'onCombatEvent';

export const EE_OnKeybindChanged = 'keybindChanged';
regMap[EE_OnKeybindChanged] = 'onKeybindChanged';

export const EE_OnGameOptionChanged = 'gameOptionChanged';
regMap[EE_OnGameOptionChanged] = 'onGameOptionChanged';

export const EE_OnControllerSelect = 'select';
regMap[EE_OnControllerSelect] = 'onControllerSelect';

export const EE_OnNetworkFailure = 'networkFailure';
regMap[EE_OnNetworkFailure] = 'onNetworkFailure';

/**
 * Called when a Steam purchase transaction closes.
 */
export const EE_OnSteamPurchaseComplete = 'steamPurchaseComplete';
regMap[EE_OnSteamPurchaseComplete] = 'onSteamPurchaseComplete';

export const EE_OnAnchorVisibilityChanged = 'anchorVisibilityChanged';
regMap[EE_OnAnchorVisibilityChanged] = 'onAnchorVisibilityChanged';

/**
 * Initialize engine event forwarding
 */
const engineEventHandleMap: { [key: string]: EngineHandle } = {};
export default function (_devGame: BaseDevGameInterface) {
  for (const key in regMap) {
    createForwardingMethod(_devGame, key, regMap[key]); // uses our ListenerHandle interface
    if (engine) {
      if (engineEventHandleMap[key]) {
        engineEventHandleMap[key].clear();
      }

      const handle = engine.on(key, (...args: any[]) => _devGame.trigger(key, ...args));
      engineEventHandleMap[key] = handle;
    }
  }
}

function createForwardingMethod(_devGame: BaseDevGameInterface, engineEvent: string, methodName: string) {
  const methodOverride = {
    [methodName]: function (callback: (...args: any[]) => any): ListenerHandle {
      const innerHandle = engine.on(engineEvent, callback);
      return { close: () => innerHandle.clear() };
    }
  };
  Object.assign(_devGame, methodOverride);
}
