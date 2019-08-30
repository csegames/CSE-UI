/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI';
import { TaskHandle } from '../../_baseGame/clientTasks';
import { SignalR } from '../signalR';
import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';

import * as engineEvents from './engineEvents';

import { query, QueryOptions } from '../../_baseGame/graphql/query';
import { subscribe } from '../../_baseGame/graphql/subscription';
import { BaseGameModelTasks } from '../../_baseGame/BaseGameInterface';


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
  /* -------------------------------------------------- */
  /* DEV COMMANDS - HATCHERY ONLY                       */
  /* -------------------------------------------------- */

  /**
   * Start looping key trigger at a set interval
   * @param {Number} id The key ID to trigger
   * @param {Number} intervalMS The interval at which to trigger the key in milliseconds
   */
  _cse_dev_beginTriggerKeyActionLoop: (id: number, intervalMS: number) => void;

  /**
   * Stops the currently active key trigger loop
   */
  _cse_dev_endTriggerKeyActionLoop: () => void;
}

/**
 * The GameModelTasks interface defines methods that require proxy definitions for use in the UI. These are methods
 * that return client tasks which are proxied by the library into promises.
 *
 * These are in a separate interface and prefixed with '_cse_dev_' to hide the from the TypeScript API.
 */
interface GameModelTasks extends BaseGameModelTasks {
}

/**
 * GameInterface is an extension of the GameModel adding additional features to the provided global game object in order
 * to maintain a single primary interface for all interactions with the game client itself.
 */
export interface GameInterface extends GameModel {
  webAPI: typeof webAPI;
  signalR: SignalR;

  store: GameDataStore;

  /**
   * Get the signalR host
   * camelotunchained.game.webAPIHost + '/signalr'
   */
  signalRHost: () => string;

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
   * Subscribe to client combat event messages
   * @param {((events: CombatEvent[]) => any)} callback function to be executed when a combat event is received
   */
  onCombatEvent: (callback: (events: CombatEvent[]) => any) => EventHandle;

  /**
   * Subscribe to Announcements
   * @param {(message: string) => any} callback function to be executed when an announcement is received
   */
  onAnnouncement: (callback: (type: AnnouncementType, message: string) => any) => EventHandle;

  /**
   * Client requests UI navigation for a specific target.
   *
   * Expected behavior: UI toggles element requested by the navigation trigger.
   * eg. navigation request is to 'inventory.open', the UI will open the inventory if it is not open.
   *
   * @param {String} target Navigation target
   */
  onNavigate: (callback: (target: string) => any) => EventHandle;

  /**
   * Called when an option is changed.
   */
  onOptionChanged: (callback: (option: GameOption) => any) => EventHandle;

  onBuildingModeChanged: (callback: (mode: BuildingMode) => any) => EventHandle;

  /**
   * Called when the Item Placement Mode has changed.
  */
  onItemPlacementModeChanged: (callback: (isActive: boolean) => any) => EventHandle;

  /**
   * Called when the UI should send an API request to the server to commit the item being placed.
   */
  onSendItemPlacementCommitRequest: (callback: (
    itemInstanceID: string,
    position: Vec3f,
    rotation: Euler3f,
    actionID: string | null,
  ) => any) => EventHandle;

  /**
   * Called when the active plot is changed.
   */
  onActivePlotChanged: (callback: (plotID: string, canEdit: boolean) => any) => EventHandle;

  onSelectedBlockChanged: (callback: (id: number) => any) => EventHandle;
  onSelectedMaterialChanged: (callback: (id: number) => any) => EventHandle;
  onSelectedBlueprintChanged: (callback: (id: number) => any) => EventHandle;

  /**
   * Called when the client keybind for "Toggle Build Selection Interface" is registered.
   */
  onToggleBuildSelector: (callback: () => any) => EventHandle;

  /**
   * Called when the client keybind for "Create Blueprint From Selection" is registered.
   */
  onWantCreateBlueprintFromSelection: (callback: () => any) => EventHandle;

  /**
   * Called when the client keybind for "Replace Materal" is registered.
   */
  onWantReplaceMaterial: (callback: () => any) => EventHandle;

  /**
   * Called to display a passive alert message.
   */
  onPassiveAlert: (callback: (message: string) => any) => EventHandle;
  sendPassiveAlert: (message: string) => void;

  getKeybindSafe: (id: number) => Keybind;

  /* -------------------------------------------------- */
  /* GAME CLIENT MODELS                                 */
  /* -------------------------------------------------- */

  /**
   * Player's current state. Includes health, name, and basic character data
   */
  selfPlayerState: SelfPlayerState;

  /**
   * The state of the player's current enemy target. Includes health, name, and basic character data
   * If undefined the player does not have an enemy target selected.
   */
  enemyTargetState: EnemyTargetState;

  /**
   * The state of the player's current friendly target. Includes health, name, and basic character data
   * If undefined the player does not have a friendly target selected.
   */
  friendlyTargetState: FriendlyTargetState;

  /**
   * The loading state for the client.
   */
  loadingState: LoadingState;

  /**
   * KeyActions are a mapping of key actions to key action id numbers
   */
  keyActions: KeyActions;

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
   * State data for running offline cube, includes available zones to build on
   */
  offlineZoneSelectState: OfflineZoneSelectState;

  engineEvents: typeof engineEvents;
}

export type DevGameInterface = InternalGameInterfaceExt & GameModelTasks;
