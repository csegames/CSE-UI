interface CoherentCallbackFn {
  (...args: any[]): void;
}

interface CoherentEventHandle {
  /**
   * Unsubscribe the associated callback from the event
   */
  readonly clear: () => void;
}

interface Deferred extends Promise<any> {
  /**
  * Resolve the promise with the specified value. All success handlers will be called with value
  * @param value the success value of the promise
  */
  resolve(value: any): void;

  /**
  * Reject the promise with the specified value. All failure handlers will be called with value
  * @param value the failure value of the promise
  */
  reject(value: any): void;
}

export interface Engine {

  /**
   * Indicates whether the script is currently running inside Coherent GT
   */
  readonly isAttached: boolean;

  /**
   * Callback function to be called when events are replayed. Defaults to null, set this before calling
   * engine.replayEvents
   */
  onEventsReplayed: CoherentCallbackFn;

  /**
   * Indicates whether mocking should be enabled despite running inside Coherent GT, Defaults to false
   */
  forceEnableMocking: boolean;

  /**
   * Subscribe callback for an event
   * @param {String} name name of the event
   * @param {CoherentCallbackFn} callback callback function to be executed when the event has been triggered
   * @param {any} context *this* context for the function, by default the engine object
   * @return handle to unsubscribe this callback from the event
   */
  on(name: string, callback: CoherentCallbackFn, context?: any): CoherentEventHandle;

  /**
   * Unsubscribe callback for an event
   * @param name name of the event
   * @param callback callback the callback function to be removed, by default removes all callbacks for a given event
   * @param context *this* context for the function, by default the engine object
   * @warning Removing all handlers for `engine` will remove some *Coherent UI* internal events, breaking some functionality.
   */
  off(name: string, callback?: CoherentCallbackFn, context?: any): void;

  /**
   * Trigger an event
   * This function will trigger any C++ handler registered for this event with `Coherent::UI::View::RegisterForEvent`
   * @param {String} name name of the event
   * @param {...any[]} extra arguments to be passed to the event handlers
   */
  trigger(name: string, ...extra: any[]): void;

	/**
   *  Call asynchronously a C++ handler and retrieve the result
	 * The C++ handler must have been registered with `Coherent::UI::View::BindCall`
	 * @param {String} name name of the C++ handler to be called
	 * @param {...any[]} extra parameters to be passed to the C++ handler
	 * @return {Deferred} deferred object whose promise is resolved with the result of the C++ handler
   */
  call(name: string, ...extra: any[]): Deferred;

  /**
   * Create a new deferred object.
   * Use this to create deferred / promises that can be used together with `engine.call`.
   * @return {Deferred} a new deferred object
   */
  createDeferred(): Deferred;

  /**
   * LOCALIZATION
   */

  /**
   * Translates the given text by invoking the system's localization manager if one exists.
   * @param {text} text The text to translate.
   * @return {String} undefined if no localization manager is set or no translation exists,
   * else returns the translated string
   */
  translate(text: string): string | undefined;

  /**
   * Updates the text on all elements with the data-l10n-id attribute by calling engine.translate
   */
  reloadLocalization(): void;

  /**
   * Begins recording all events triggered using View::TriggerEvent from the game
   */
  beginEventRecording(): void;

  /**
   * Ends event recording
   */
  endEventRecording(): void;

  /**
   * Saves the events recorded in between the last calls to engine.beginEventRecording and engine.endEventRecording to a file
   * @param {String} path The path to the file where to save the recorded events. Optional. Defaults to "eventRecord.json"
   */
  saveEventRecord(path?: string): void;

  /**
   * Replays the events previously recorded and stored in path. If you need to be notified when all events
   * are replayed, assign a callback to engine.onEventsReplayed
   * @param {Number} timeScale The speed at which to replay the events (e.g. pass 2 to double the speed).
   *  Optional. Defaults to 1.
   * @param {String} path The path to the file the recorded events are stored. Optional. Defaults to "eventRecord.json"
   */
  replayEvents(timeScale?: number, path?: string): void;

  /**
   * Mocks a C++ function call with the specified function.
   * Will also work in Coherent GT only if *engineForceEnableMocking* is set to *true*.
   * @param {String} name name of the event
   * @param {Function} mock a function to be called in-place of your native binding
   * @param {Boolean} isEvent whether you are mocking an event or function call
   */
  mock(name: string, mock: CoherentCallbackFn, isEvent: boolean): void;

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
