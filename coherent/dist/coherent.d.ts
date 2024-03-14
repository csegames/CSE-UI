/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export declare interface ListenerHandle {
  clear(): void;
}

export declare interface Engine {

  /// @var engine.isAttached
  /// Indicates whether the script is currently running inside Coherent GT
  readonly isAttached: boolean;

  /// @var engine.forceEnableMocking
  /// Indicates whether mocking should be enabled despite running inside Coherent GT
  readonly forceEnableMocking: boolean;

  /// @function engine.on
  /// Register handler for and event
  /// @param {string} name name of the event
  /// @param {Function} callback callback function to be executed when the event has been triggered
  /// @param {any} context *this* context for the function, by default the engine object
  on(name: string, callback: Function, context?: any): ListenerHandle;

  /// @function engine.off
  /// Remove handler for an event
  /// @param {string} name name of the event, by default removes all events
  /// @param {Function} callback the callback function to be removed, by default removes all callbacks for a given event
  /// @param {any} context *this* context for the function, by default all removes all callbacks, regardless of context
  /// @warning Removing all handlers for `engine` will remove some *Coherent UI* internal events, breaking some functionality.
  off(name: string, callback?: Function, context?: any): void;

  /// @function engine.trigger
  /// Trigger an event
  /// This function will trigger any C++ handler registered for this event with `Coherent::UI::View::RegisterForEvent`
  /// @param {string} name name of the event
  /// @param ... any extra arguments to be passed to the event handlers
  trigger(name: string, ...extra: any[]): void;

	/**
   *  Call asynchronously a C++ handler and retrieve the result
	 * The C++ handler must have been registered with `Coherent::UI::View::BindCall`
	 * @param {String} name name of the C++ handler to be called
	 * @param {...any[]} extra parameters to be passed to the C++ handler
	 * @return {Deferred} deferred object whose promise is resolved with the result of the C++ handler
   */
  call(name: string, ...extra: any[]): Promise<any>;

  /// @function engine.translate
  /// Translates the given text by invoking the system's localization manager if one exists.
  /// @param {text} text The text to translate.
  /// @return {String} undefined if no localization manager is set or no translation exists, else returns the translated string
  translate(text: string): string | undefined;

  /// @function engine.reloadLocalization
  /// Updates the text on all elements with the data-l10n-id attribute by calling engine.translate
  reloadLocalization(): void;

  /// @function engine.beginEventRecording
  /// Begins recording all events triggered using View::TriggerEvent from the game
  beginEventRecording(): void;

  /// @function engine.endEventRecording
  /// Ends event recording
  endEventRecording(): void;

  /// @function engine.saveEventRecord
  /// Saves the events recorded in between the last calls to engine.beginEventRecording and engine.endEventRecording to a file
  /// @param {string?} path The path to the file where to save the recorded events. Optional. Defaults to "eventRecord.json"
  saveEventRecord(path?: string): void;

  /// @function engine.replayEvents
  /// Replays the events previously recorded and stored in path. If you need to be notified when all events
  /// are replayed, assign a callback to engine.onEventsReplayed
  /// @param {number} timeScale The speed at which to replay the events (e.g. pass 2 to double the speed). Optional. Defaults to 1.
  /// @param {string?} path The path to the file the recorded events are stored. Optional. Defaults to "eventRecord.json"
  replayEvents(timeScale?: number, path?: string): void;
  onEventsReplayed: (() => void) | null;

  /// @function engine.mock
  /// Mocks a C++ function call with the specified function.
  /// Will also work in Coherent GT only if *engineForceEnableMocking* is set to *true*.
  /// @param {String} name name of the event
  /// @param {Function} mock a function to be called in-place of your native binding
  /// @param {boolean} isEvent whether you are mocking an event or function call
  mock(name: string, mock: Function, isEvent: boolean): void;

  /**
   * Shows the debugging overlay in the browser.
   * Will also work in Coherent GT only if *engineForceEnableMocking* is set to *true*.
   */
  showOverlay(): void;

  /**
   * Hides the debugging overlay in the browser.
   * Will also work in Coherent GT only if *engineForceEnableMocking* is set to *true*.
   */
  hideOverlay(): void;
}

// declaration because the value is injected by coherent
declare const engine: Engine;
export default engine;
