/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TaskHandle } from './clientTasks';
import { BaseInternalGameInterfaceExt } from './InternalGameInterfaceExt';
import * as engineEvents from './engineEvents';
import { query, QueryOptions } from './graphql/query';
import { subscribe } from './graphql/subscription';

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
export interface BaseGameModel {
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
   * The hose address for the specific game server that this client is connected to.
   * *Note:* some API requests will be made directly to the game server itself, those use this address.
  */
  serverHost: string;

  /**
   * Identifying number for the server shard this client is currently logged in to.
  */
  shardID: number;

  /**
   * Unique network Identifier (I think??)
   * TODO: Should we remove this?
   */
  pktHash: string;

  /**
   * Time according to the game server.
   */
  worldTime: number;

  /**
   * Forces the client to reload the entire UI
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
  triggerKeyAction: (id: number) => Success | Failure;

  /**
   * Sends a slash command to the game client
   * @param {String} command the command to send, does not include a preceding slash.
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
   * @param {Number} value Binding value to set
   * @returns {Success | Failure} Result whether the keybind was set
   */
  setKeybind: (id: number, index: number, value: number) => Success | Failure;

  /**
   * Request that the client clear a particular key bind
   * @param {Number} id Identifier of the Keybinding to be cleard
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
   * @param {OptionCateogry} category The category of options to reset
   */
  resetOptions: (category: OptionCategory) => void;
}

/**
 * The GameModelTasks interface defines methods that require proxy definitions for use in the UI. These are methods
 * that return client tasks which are proxied by the library into promises.
 *
 * These are in a separate interface and prefixed with '_cse_dev_' to hide the from the TypeScript API.
 */
export interface BaseGameModelTasks {
  /**
   * Request that the client listen for a key combination to bind a key value to.
   * @param {Number} id Identifier of the Keybinding to be bound
   * @param {Number} index Index of binds to set / replace with the new binding
   * @returns {Binding} The newly bound key information
   */
    _cse_dev_listenForKeybindingTask: () => TaskHandle;

  /**
  * Batch set of all passed in options
  * @param {GameOption[]} options The options to set
  * @return Whether or not the options all saved correcly
  */
  _cse_dev_setOptions: (options: GameOption[]) => TaskHandle;

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
}

/**
 * GameInterface is an extension of the GameModel adding additional features to the provided global game object in order
 * to maintain a single primary interface for all interactions with the game client itself.
 */
export interface BaseGameInterface extends BaseGameModel {
  /**
   * Indicates whether the game interface has been initialized.
  */
  ready: boolean;

  /**
   * Indicated whether the game client is attached to the UI
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
   * Version of webAPI requests to use with this version of the library
   */
  apiVersion: number;

  /**
   * Subscribes a function to be executed when the game client wished to begin writing a chat message.
   * (this usually means the user pressed 'Enter' when not focusing the chate interface itself)
   * @param {(message: string) => any} callback callback function to be executed when the game client wishes to begin chat.
  */
  onBeginChat: (callback: (message: string) => any) => EventHandle;

  /**
   * Subscribes a function to be executed when the game client wishes to print a system message to the system log.
   * @param {(message: string) => any} callback callback function to be executed when the game client sends a
   * system message to the ui.
   */
  onSystemMessage: (callback: (message: string) => any) => EventHandle;
  sendSystemMessage: (message: string) => void;

  /**
   * Subscribe to the console text messages
   * @param {(text: string) => any} callback function to be executed when a console text message is received
  */
  onConsoleText: (callback: (text: string) => any) => EventHandle;

  /**
   * Subscribe to DevUI updates
   * @param {(id: string, rootPage: string) => any} callback function to be executed with a DevUI update
   */
  onUpdateDevUI: (callback: (id: string, rootPage: string) => any) => EventHandle;

  /**
   * Subscribe to kebind changes.
   * @param {(keybind: Keybind) => any} callback function to be executed when a keybind has been changed.
   */
  onKeybindChanged: (callback: (keybind: Keybind) => any) => EventHandle;

  /**
   * Subscribe to PerfHUD updates
   * @param {(json: string) => any} callback function to be executed with a PerfHUD update
   */
  onPerfHUDUpdate:(callback: (json: string) => any) => EventHandle;

  /**
   * TODO: Write something about this. I have no idea what this is -AJ
   */
  getKeybindSafe: (id: number) => Keybind;

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
  graphQL: {
    query: typeof query;
    subscribe: typeof subscribe;
    defaultOptions(): Partial<QueryOptions>;
    host(): string;
  };
}

export type BaseDevGameInterface = BaseInternalGameInterfaceExt & BaseGameModelTasks;
