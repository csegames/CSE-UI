/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';

/**
 * GameModel interface defines the structure and functionality of the global game object as presented by the game
 * client.
 *
 * If game is not defined, then the page has not yet been initialized by the game engine or we are not running in the
 * context of the game client.
 *
 * In the case that game is not defined, replacement methods are in place to mock Coherent engine support for functions
 * provided through this global api object.
 */

export interface GameModel {
}

/**
 * GameInterface is an extension of the GameModel adding additional features to the provided global game object in order
 * to maintain a single primary interface for all interactions with the game client itself.
 */
export interface GameInterface extends GameModel {

  /**
   * Subscribe to PlayerDirection updates
   * @param {(playerDirections: PlayerDirection[]) => any} callback function to be executed with a PlayerDirection update
   */
  onPlayerDirectionUpdate: (callback: (playerDirections: PlayerDirection[]) => any) => EventHandle;

  /**
   * Subscribe to Objective updates
   * @param {(activeObjectives: ActiveObjectives[]) => any} callback function to be executed with an Active Objectives update
   */
  onObjectivesUpdate: (callback: (objectives: ObjectiveEntityState[]) => any) => EventHandle;

  /**
   * Subscribe to EntityState updates
   * * @param {(entityState: AnyEntityStateModel) => any} callback function to be executed with an Entity State update
   */
  onEntityStateUpdate: (callback: (entityState: AnyEntityStateModel) => any) => EventHandle;

  /**
   * Subscribe to EntityState removes
   * * @param {(entityID: string) => any} callback function to be executed with an Entity State remove
   */
  onEntityStateRemoved: (callback: (entityID: string) => any) => EventHandle;

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
      scenarioResultMessage: string,
    ) => any,
  ) => EventHandle;

  /**
   * Subscribes a function to be executed when the state of the scenario changes
   */
  onScenarioRoundUpdate: (callback: (state: ScenarioRoundState, stateStartTime: number, stateEndTime: number) => any) => EventHandle;

  /**
   * Subscribe to Kill Streak updates
   */
  onKillStreakUpdate: (callback: (newCount: number, newTimerStart: number, newTimerDuration: number) => any) => EventHandle;

  /**
   * Subscribe to Collected Runes updates
   */
  onCollectedRunesUpdate: (
    callback: (
      runes: { [rune: number]: number },
      runeBonuses: { [rune: number]: number },
      maxRunesAllowed: { [rune: number]: number },
    ) => any
  ) => EventHandle;

  /* -------------------------------------------------- */
  /* GAME CLIENT MODELS                                 */
  /* -------------------------------------------------- */

  /**
   * Player's current state. Includes health, name, and basic character data
   */
  selfPlayerState: SelfPlayerState;

  /**
   * Map of entities that the UI knows about by EntityID
   */
  entities: { [entityID: string]: AnyEntityState };

    /**
   * Map of ability states that the UI knows about by ability id
   */
  abilityStates: { [id: string]: AbilityState };

  /**
   * Current state of the abilitybar, temp - this defines the exact ability bar layout for now
   */
  abilityBarState: AbilityBarState;

  /**
   * List of class defs - champions
   */
  classes: CharacterClassDef[];

  /**
   * List of race defs - costumes
   */
  races: CharacterRaceDef[];

  /**
   * Current state of the consumable items
   */
  consumableItemsState: ConsumableItemsState;

  /**
   * Status definition information
   */
  statuses: StatusDef[];
}

export type DevGameInterface = InternalGameInterfaceExt;
