/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';
import { ObjectiveDetailMessageState } from '../../_baseGame/types/Objective';
import { EntityDirection } from './types/EntityDirection';
import {
  BaseEntityStateModel,
  UpdatableBaseEntityStateModel,
  UpdatablePlayerEntityStateModel
} from './GameClientModels/EntityState';
import { ScenarioRoundState } from '../webAPI/definitions';
import { UpdatableSelfPlayerStateModel } from './GameClientModels/PlayerState';
import { ConsumableItemsState } from './GameClientModels/ConsumableItemsState';
import { ControllerButton } from '../../_baseGame/types/Gamepad';
import { ListenerHandle } from '../../_baseGame/listenerHandle';

/**
 * GameInterface is the interface of the provided global game object from Coherent - it is deprecated and
 * is slowly being removed as functionality is moved into the clientAPI instead.
 */
export interface GameInterface {
  /**
   * Subscribe to EntityDirection updates
   * @param {(entityDirections: EntityDirection[]) => any} callback function to be executed with a EntityDirection update
   */
  onEntityDirectionUpdate: (callback: (entityDirections: EntityDirection[]) => any) => ListenerHandle;

  /**
   * Subscribe to EntityState updates
   * * @param {(entityState: BaseEntityStateModel) => any} callback function to be executed with an Entity State update
   */
  onEntityUpdated: (callback: (entityState: BaseEntityStateModel) => any) => ListenerHandle;

  /**
   * Subscribe to EntityState removes
   * * @param {(entityID: string) => any} callback function to be executed with an Entity State remove
   */
  onEntityRemoved: (callback: (entityID: string) => any) => ListenerHandle;

  /**
   * Subscribes a function to be executed when a scenario round ends.
   * @param {((scenarioID: string, roundID: string, didEnd: boolean, didWin: boolean) => any} callback
   * function to be executed when the scenario round ends
   */
  onScenarioRoundEnded: (
    callback: (
      scenarioID: string,
      roundID: string,
      didEnd: boolean,
      didWin: boolean,
      roundResultMessage: string,
      scenarioResultMessage: string
    ) => any
  ) => ListenerHandle;

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

  /* -------------------------------------------------- */
  /* GAME CLIENT MODELS                                 */
  /* -------------------------------------------------- */

  /**
   * Player's current state. Includes name and basic character data
   */
  selfPlayerState: UpdatableSelfPlayerStateModel;

  /**
   * Player's current state. Includes name and basic character data
   */
  selfPlayerEntityState: UpdatablePlayerEntityStateModel;

  /**
   * Map of entities that the UI knows about by EntityID
   */
  entities: { [entityID: string]: UpdatableBaseEntityStateModel };

  /**
   * Current state of the consumable items
   */
  consumableItemsState: ConsumableItemsState;
}

export type DevGameInterface = InternalGameInterfaceExt;
