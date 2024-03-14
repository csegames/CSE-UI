/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI/definitions';
// import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';
// import { KeyActions } from './GameClientModels/KeyActions';
import { OfflineZoneSelectState } from './GameClientModels/OfflineZoneSelectState';
import { Euler3f, Vec3f } from '../webAPI/definitions';
import { ItemActionsMessage } from '../game/types/ItemActions';

import { GameOption } from '../../_baseGame/types/Options';
import { Keybind } from '../../_baseGame/types/Keybind';
import { BuildingMode } from '../../_baseGame/types/Building';
import { BaseEntityStateModel } from './GameClientModels/EntityState';
import { ListenerHandle } from '../../_baseGame/listenerHandle';

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
 * GameInterface is an extension of the GameModel adding additional features to the provided global game object in order
 * to maintain a single primary interface for all interactions with the game client itself.
 */
export interface GameInterface extends GameModel {
  webAPI: typeof webAPI;

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
   * Subscribe to EntityState removes
   * * @param {(entityID: string) => any} callback function to be executed with an Entity State remove
   */
  onEntityRemoved: (callback: (entityID: string) => any) => ListenerHandle;

  /**
   * Client requests UI navigation for a specific target.
   *
   * Expected behavior: UI toggles element requested by the navigation trigger.
   * eg. navigation request is to 'inventory.open', the UI will open the inventory if it is not open.
   *
   * @param {String} target Navigation target
   */
  onNavigate: (callback: (target: string) => any) => ListenerHandle;

  onCycleTeam: (callback: () => any) => ListenerHandle;

  /**
   * Called when an option is changed.
   */
  onOptionChanged: (callback: (option: GameOption) => any) => ListenerHandle;

  onBuildingModeChanged: (callback: (mode: BuildingMode) => any) => ListenerHandle;

  /**
   * Called when the Item Placement Mode has changed.
   */
  onItemPlacementModeChanged: (callback: (isActive: boolean) => any) => ListenerHandle;

  /**
   * Called when the UI should send an API request to the server to commit the item being placed.
   */
  onSendItemPlacementCommitRequest: (
    callback: (itemInstanceID: string, position: Vec3f, rotation: Euler3f, actionID: string | null) => any
  ) => ListenerHandle;

  /**
   * Called when the active plot is changed.
   */
  onActivePlotChanged: (callback: (plotID: string, canEdit: boolean) => any) => ListenerHandle;

  onSelectedBlockChanged: (callback: (id: number) => any) => ListenerHandle;
  onSelectedMaterialChanged: (callback: (id: number) => any) => ListenerHandle;
  onSelectedBlueprintChanged: (callback: (id: number) => any) => ListenerHandle;

  /**
   * Called when the client keybind for "Toggle Build Selection Interface" is registered.
   */
  onToggleBuildSelector: (callback: () => any) => ListenerHandle;

  /**
   * Called when the client keybind for "Create Blueprint From Selection" is registered.
   */
  onWantCreateBlueprintFromSelection: (callback: () => any) => ListenerHandle;

  /**
   * Called when the client keybind for "Replace Materal" is registered.
   */
  onWantReplaceMaterial: (callback: () => any) => ListenerHandle;

  getKeybindSafe: (id: number) => Keybind;

  onShowItemActions: (
    callback: (message: ItemActionsMessage, entityState: BaseEntityStateModel) => void
  ) => ListenerHandle;

  /* -------------------------------------------------- */
  /* GAME CLIENT MODELS                                 */
  /* -------------------------------------------------- */

  /**
   * State data for running offline cube, includes available zones to build on
   */
  offlineZoneSelectState: OfflineZoneSelectState;
}
