/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// *** DEPRECATED, DO NOT EXTEND ***

import { BaseDevGameInterface } from '../../_baseGame/BaseGameInterface';
import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';

const regMap: { [key: string]: string } = {};

export const EE_CombatEvent = 'combatEvent';
regMap[EE_CombatEvent] = 'onCombatEvent';

export const EE_OnCycleTeam = 'cycleTeam';
regMap[EE_OnCycleTeam] = 'onCycleTeam';

export const EE_OnSkipEpilogue = 'skipEpilogue';
regMap[EE_OnSkipEpilogue] = 'onSkipEpilogue';

export const EE_OnOptionChanged = 'optionChanged';
regMap[EE_OnOptionChanged] = 'onOptionChanged';

export const EE_OnEntityDirectionUpdate = 'entityDirections.update';
regMap[EE_OnEntityDirectionUpdate] = 'onEntityDirectionUpdate';

export const EE_OnScenarioRoundEnd = 'scenarioRoundEnd';
regMap[EE_OnScenarioRoundEnd] = 'onScenarioRoundEnded';

export const EE_OnEntityUpdated = 'entity.updated';
regMap[EE_OnEntityUpdated] = 'onEntityUpdated';

export const EE_OnEntityRemoved = 'entity.removed';
regMap[EE_OnEntityRemoved] = 'onEntityRemoved';

export const EE_OnKillStreakUpdate = 'killStreak.update';
regMap[EE_OnKillStreakUpdate] = 'onKillStreakUpdate';

export const EE_OnCollectedRunesUpdate = 'collectedRunes.update';
regMap[EE_OnCollectedRunesUpdate] = 'onCollectedRunesUpdate';

export const EE_OnScenarioRoundUpdate = 'scenarioRound.update';
regMap[EE_OnScenarioRoundUpdate] = 'onScenarioRoundUpdate';

export const EE_OnObjectiveDetailsUpdate = 'objectiveDetails.update';
regMap[EE_OnObjectiveDetailsUpdate] = 'onObjectiveDetailsUpdate';

export const EE_OnMenuControllerEvent = 'menuController';
regMap[EE_OnMenuControllerEvent] = 'onMenuControllerEvent';

export const EE_OnMenuControllerAxisEvent = 'menuControllerAxis';
regMap[EE_OnMenuControllerAxisEvent] = 'onMenuControllerAxisEvent';

export function initEventForwarding(hordeGame: any, _devGame: BaseDevGameInterface) {
  for (const key in regMap) {
    createForwardingMethod(hordeGame, key, regMap[key]);
    engine.on(key, (...args: any[]) => _devGame.trigger(key, ...args));
  }
}

function createForwardingMethod(hordeGame: any, engineEvent: string, methodName: string) {
  hordeGame[methodName] = function (callback: (...args: any[]) => any): ListenerHandle {
    const innerHandle = engine.on(engineEvent, callback);
    return {
      close() {
        innerHandle.clear();
      }
    };
  };
}
