/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI';
import { TaskHandle } from './clientTasks';
import { SignalR } from '../signalR';
import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';

import * as engineEvents from './engineEvents';

import { query, QueryOptions } from '../graphql/query';
import { subscribe } from '../graphql/subscription';


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

  /**
   * The Patch resource channel identification number.
   */
  patchResourceChannel: number;

  /**
   * The current access token used to identify the user in requests to CSE services.
   */
  accessToken: string;

  /**
   * The host address for the Web Api server the UI should make requests to.
   */
  webAPIHost: string;

  /**
   * The host address for the specific game server that this client is connected to.
   * *Note:* some API requests will be made directly to the game server itself, those use this address.
   */
  serverHost: string;

  /**
   * Identifying number for the server shard this client is currently logged in to.
   */
  shardID: number;

  /**
   * Unique Network Identifier (I think??)
   * TODO: Should we remove this?
   */
  pktHash: string;

  /**
   * Time according to the game server, use for start / end times of abilities and other effects dictated by
   * the game server.
   */
  worldTime: number;

  /**
   * Forces the client to reload the entire UI.
   */
  reloadUI: () => void;

  /**
   * Quit the game!
   */
  quit: () => void;

  /**
   * Triggers a client Key action using the id of that KeyBind. Essentially, acts as if the client keybind was pressed.
   * @param {Number} id Matches id in KeyBind for any action
   * @return {Success | Failure}
   */
  triggerKeyAction: (id: Number) => Success | Failure;

  /**
   * Sends a slash command to the game client.
   * @param {String} command the command to send, does not include a preceding slash
   */
  sendSlashCommand: (command: string) => void;

  /**
   * Player a sound through the game audio engine
   * @param {Number} soundID ID of the sound to play
   */
  playGameSound: (soundID: number) => void;

  /* -------------------------------------------------- */
  /* OPTIONS                                            */
  /* -------------------------------------------------- */

  /**
   * All Keybinds from the client
   */
  keybinds: ArrayMap<Keybind>;

  /**
   * Set a keybind
   * @param {Number} id Identifier of the Keybinding to be bound
   * @param {Number} index Index of binds to set / replace with the new binding
   * @param {NUmber} value Binding value to set
   * @returns {Success | Failure} Result whether the keybind was set
   */
  setKeybind: (id: number, index: number, value: number) => Success | Failure;

  /**
   * Request that the client clear a particular key bind
   * @param {Number} id Identifier of the Keybinding to be cleared
   * @param {Number} index Index of bind to clear
   */
  clearKeybind: (id: number, index: number) => void;

  /**
   * Restores all keybinds to their default values
   */
  resetKeybinds: () => void;

  /**
   * All options from the client
   */
  options: ArrayMap<GameOption>;

  /**
   * Restores options to their default values based on category
   * @param {OptionCategory} The category of options to reset
   */
  resetOptions: (category: OptionCategory) => void;

  /* -------------------------------------------------- */
  /* ITEM PLACEMENT API                                 */
  /* -------------------------------------------------- */

  /**
   * Action used to begin deployment of a deployable item
   * @param {Number} itemDefID Item Definition ID of the deployable
   * @param {String} itemInstanceID Instance ID of the deployable item
   * @param {String} actionID ID of the item action
   * @return {Boolean} whether or not placement actually started in the client.
   */
  startItemPlacement: (itemDefID: number, itemInstanceID: string, actionID: string) => boolean;

  /**
   * Commit active placed item with its current position & orientation
   * *IMPORTANT* This item placement is client-side only! The UI must make a move item request with the returned
   * positional data from this call to actually move the item to position on th e game server.
   * @return
   * {
   *   success: true | false - whether or not the commit was successful
   *   position?: {Vec3f} - where the item was placed
   *   rotation?: {Euler3f} - orientation of the placed item
   *   actionID?: {String} - ID used in creating a move request
   * }
   */
  commitItemPlacement: () => Failure | Success & {
    itemDefID: number;
    itemInstanceID: string;
    position: Vec3f;
    rotation: Euler3f,
    actionID: string
  };

  /**
   * Reset active placed item's position and orientation
   */
  resetItemPlacement: () => void;

  /**
   * Cancel active placed item's placement
   * @return {Boolean} whether or not the placement was cancelled
   */
  cancelItemPlacement: () => boolean;

  /**
   * Change item placement mode to inputted mode
   * @param {Number} itemPlacementTransformMode The id of placement mode
   */
  changeItemPlacementMode: (itemPlacementTransformMode: ItemPlacementTransformMode) => void;

  /* -------------------------------------------------- */
  /* BUILDING API                                       */
  /* -------------------------------------------------- */

  building: BuildingAPIModel;

  /**
   * Drop light api
   */
  dropLight: {
    drop: (brightness: number, radius: number, red: number, green: number, blue: number) => void;
    removeLast: () => void;
    clearAll: () => void;
  };

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

interface BuildingAPIModel {
  mode: BuildingMode;
  activePlotID: string;
  canEditActivePlot: boolean;
  activeBlockID: number;
  activeMaterialID: number;
  activeBlueprintID: number;
  activePotentialItemID: number;
  blueprints: ArrayMap<Blueprint>;
  materials: ArrayMap<Material>;
  potentialItems: ArrayMap<PotentialItem>;
}

interface BuildingAPI extends BuildingAPIModel {
  setModeAsync: (mode: BuildingMode) => CancellablePromise<Success | Failure>;

  selectBlockAsync: (blockID: number) => CancellablePromise<Success | Failure>;
  selectBlueprintAsync: (blueprintID: number) => CancellablePromise<Success | Failure>;
  selectPotentialItemAsync: (potentialItemID: number) => CancellablePromise<Success | Failure>;

  deleteBlueprintAsync: (blueprintID: number) => CancellablePromise<Success | Failure>;
  createBlueprintFromSelectionAsync: (name: string) => CancellablePromise<(Success & { blueprint: Blueprint}) | Failure>;

  replaceMaterialsAsync: (selectedID: number, replacementID: number, inSelection: boolean) =>
    CancellablePromise<Success | Failure>;
  replaceShapesAsync: (selectedID: number, replacementID: number, inSelection: boolean) =>
    CancellablePromise<Success | Failure>;
}

interface BuildingAPIModelTasks {
  _cse_dev_setMode: (mode: BuildingMode) => TaskHandle;

  _cse_dev_selectBlock: (blockID: number) => TaskHandle;
  _cse_dev_selectBlueprint: (blueprintID: number) => TaskHandle;
  _cse_dev_selectPotentialItem: (potentialItemID: number) => TaskHandle;

  _cse_dev_deleteBlueprint: (blueprintID: number) => TaskHandle;
  _cse_dev_createBlueprintFromSelection: (name: string) => TaskHandle;

  _cse_dev_replaceMaterials: (selectedID: number, replacementID: number, inSelection: boolean) => TaskHandle;
  _cse_dev_replaceShapes: (selectedID: number, replacementID: number, inSelection: boolean) => TaskHandle;
}

/**
 * The GameModelTasks interface defines methods that require proxy definitions for use in the UI. These are methods
 * that return client tasks which are proxied by the library into promises.
 *
 * These are in a separate interface and prefixed with '_cse_dev_' to hide the from the TypeScript API.
 */
interface GameModelTasks {
  /**
   * Request that the client listen for a key combination to bind a key value to.
   * @param {Number} id Identifier of the Keybinding to be bound
   * @param {Number} index Index of binds to set / replace with the new binding
   * @returns {Binding} The newly bound key information
   */
  _cse_dev_listenForKeyBindingTask: () => TaskHandle;

  /**
   * Batch set of all passed in options
   * @param {GameOption[]} options The options to set
   * @return Whether or not the options all saved correctly
   */
  _cse_dev_setOptions: (options: GameOption[]) =>
   TaskHandle;

  /**
   * Test a single option without saving it, this allows preview of changes without saving them immediately
   * When called, this method should change the setting on the client without saving it to file or the server
   * @param {GameOption} option The option to test
   * @return Whether or not the option was valid to test
   */
  _cse_dev_testOption: (option: GameOption) => TaskHandle;

  /**
   * Take a screenshot
   * @return {Screenshot} Image & Path to screenshot
   */
  _cse_dev_takeScreenshot: () => TaskHandle;

  building: BuildingAPI & BuildingAPIModelTasks;
}

/**
 * GameInterface is an extension of the GameModel adding additional features to the provided global game object in order
 * to maintain a single primary interface for all interactions with the game client itself.
 */
export interface GameInterface extends GameModel {

  /**
   * Indicates whether the game interface has been initialized.
   */
  ready: boolean;

  /**
   * Indicates whether the game client is attached to the UI.
   */
  isClientAttached: boolean;

  /**
   * Subscribes a function to be executed when the game client interface has been initialized.
   * @param {() => any} callback callback function to be executed when the game client interface is initialized.
   */
  onReady: (callback: () => any) => EventHandle;

  /**
   * Indicates whether to run the ui in debug mode with debug logging enabled.
   */
  debug: boolean;

  /**
   * Version of WebAPI requests to use with this version of the library.
   */
  apiVersion: number;

  webAPI: typeof webAPI;
  graphQL: {
    query: typeof query;
    subscribe: typeof subscribe;
    defaultOptions(): Partial<QueryOptions>;
    host(): string;
  };
  signalR: SignalR;

  store: GameDataStore;

  /**
   * Get the signalR host
   * game.webAPIHost + '/signalr'
   */
  signalRHost: () => string;

  /**
   * Subscribes a function to be executed when the game client wishes to begin writing a chat message.
   * (this usually means the user pressed 'Enter' when not focusing the chat interface itself)
   * @param {(message: string) => any} callback callback function to be executed when the game client wished to being
   * chat.
   */
  onBeginChat: (callback: (message: string) => any) => EventHandle;

  /**
   * Subscribes a function to be executed when the game client wishes to print a system message to the system log.
   * @param {(message: string) => any} callback callback function to be executed when the game client sends a system
   * message to the ui.
   */
  onSystemMessage: (callback: (message: string) => any) => EventHandle;

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
   * Subscribe to console text messages
   * @param {(text: string) => any} callback function to be executed when a console text message is received
   */
  onConsoleText: (callback: (text: string) => any) => EventHandle;

  /**
   * Subscribe to DevUI updates
   * @param {(id: string, rootPage: string) => any} callback function to be executed with a DevUI update
   */
  onUpdateDevUI: (callback: (id: string, rootPage: string) => any) => EventHandle;

  /**
   * Subscribe to Announcements
   * @param {(message: string) => any} callback function to be executed when an announcement is received
   */
  onAnnouncement: (callback: (message: string) => any) => EventHandle;

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
   * Called when the active plot is changed.
   */
  onActivePlotChanged: (callback: (plotID: string, canEdit: boolean) => any) => EventHandle;

  onSelectedBlockChanged: (callback: (id: number) => any) => EventHandle;
  onSelectedMaterialChanged: (callback: (id: number) => any) => EventHandle;
  onSelectedBlueprintChanged: (callback: (id: number) => any) => EventHandle;


  onKeybindChanged: (callback: (keybind: Keybind) => any) => EventHandle;

  /**
   * Called when the client keybind for "Toggle Build Selection Interface" is registered.
   */
  onToggleBuildSelector: (callback: () => any) => EventHandle;

  /**
   * Called when the client keybind for "Create Blueprint From Selection" is registered.
   */
  onWantCreateBlueprintFromSelection: (callback: () => any) => EventHandle;

  onPerfHUDUpdate: (callback: (json: string) => any) => EventHandle;

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

  /* -------------------------------------------------- */
  /* BUILDING API                                       */
  /* -------------------------------------------------- */

  building: BuildingAPI;

  /* -------------------------------------------------- */
  /* TASKS                                              */
  /* -------------------------------------------------- */

  /**
   * Request that the client listen for a key combination to bind a key value to.
   * @param {Number} id Identifier of the Keybinding to be bound
   * @param {Number} index Index of binds to set / replace with the new binding
   * @returns {Binding} The newly bound key information
   */
  listenForKeyBindingAsync: () => CancellablePromise<Binding>;


  /**
   * Batch set of all passed in options
   * @param {GameOption[]} options The options to set
   * @return Whether or not the options all saved correctly
   */
  setOptionsAsync: (options: GameOption[]) =>
   CancellablePromise<Success | Failure & { failures: ArrayMap<{ option: GameOption, reason: string }> }>;

  /**
   * Test a single option without saving it, this allows preview of changes without saving them immediately
   * When called, this method should change the setting on the client without saving it to file or the server
   * @param {GameOption} option The option to test
   * @return Whether or not the option was valid to test
   */
  testOptionAsync: (option: GameOption) => CancellablePromise<Success | Failure>;

  /**
   * Take a screenshot
   * @return {Screenshot} Image & Path to screenshot
   */
  takeScreenshotAsync: () => CancellablePromise<Screenshot>;


  /* -------------------------------------------------- */
  /* EVENTS                                             */
  /* -------------------------------------------------- */

  /**
   * Subscribes a function to be called when an event with the given name is triggered.
   * @param {String} name The event name
   * @param {Callback} callback The function to be called when the event is triggered.
   * @return {EventHandle} Handle to unsubscribe the callback from the event.
   */
  on: (name: string, callback: Callback) => EventHandle;

  /**
   * Subscribes a function to be called only once when an event with the given name is triggered.
   * @param {String} name The event name
   * @param {Callback} callback The function to be called once when the event is triggered.
   * @return {EventHandle} Handle to unsubscribe the callback from the event.
   */
  once: (name: string, callback: Callback) => EventHandle;

  /**
   * Trigger an event of the given name.
   * @param {String} name The event name
   * @param {...any[]} args The parameters to pass into callbacks subscribed to this event.
   */
  trigger: (name: string, ...args: any[]) => void;

  /**
   * Unsubscribe from an event
   * @param {number | EventHandle} handle Either the EventHandle or ID of an event to unsubscribe
   */
  off: (handle: number | EventHandle) => void;

  engineEvents: typeof engineEvents;
}

export type DevGameInterface = InternalGameInterfaceExt & GameModelTasks;
