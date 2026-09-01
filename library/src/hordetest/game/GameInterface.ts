/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';
import { ObjectiveDetailMessageState } from '../../_baseGame/types/Objective';
import { ScenarioRoundState } from '../webAPI/definitions';
import { ControllerButton } from '../../_baseGame/types/Gamepad';
import { ListenerHandle } from '../../_baseGame/listenerHandle';

/**
 * GameInterface is the interface of the provided global game object from Coherent - it is deprecated and
 * is slowly being removed as functionality is moved into the clientAPI instead.
 */
export interface GameInterface {
  /**
   * Subscribes a function to be executed when a scenario round ends.
   * @param {((scenarioID: string, roundID: string, didEnd: boolean, didWin: boolean) => any} callback
   * function to be executed when the scenario round ends
   */
  onScenarioRoundEnded: (callback: (scenarioID: string, roundID: string, didEnd: boolean) => any) => ListenerHandle;

  /**
   * Subscribes a function to be executed when the state of the scenario changes
   */
  onScenarioRoundUpdate: (
    callback: (state: ScenarioRoundState, stateStartTime: number, stateEndTime: number) => any
  ) => ListenerHandle;

  /**
   * Subscribes a function to be executed when the state of the scenario changes
   */
  onObjectiveDetailsUpdate: (
    callback: (objectiveDetailMessages: ObjectiveDetailMessageState[]) => any
  ) => ListenerHandle;

  /**
   * Subscribe to Kill Streak updates
   */
  onKillStreakUpdate: (
    callback: (newCount: number, newTimerStart: number, newTimerDuration: number) => any
  ) => ListenerHandle;

  /**
   * Subscribe to Collected Runes updates
   */
  onCollectedRunesUpdate: (
    callback: (
      runes: { [rune: number]: number },
      runeBonuses: { [rune: number]: number },
      maxRunesAllowed: { [rune: number]: number }
    ) => any
  ) => ListenerHandle;

  onMenuControllerEvent: (callback: (button: ControllerButton) => any) => ListenerHandle;
  onMenuControllerAxisEvent: (callback: (x: number, y: number) => any) => ListenerHandle;
}

export type DevGameInterface = InternalGameInterfaceExt;
