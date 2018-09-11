/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EventEmitter from './EventEmitter';

// Global event emitter
const emitter: EventEmitter = new EventEmitter();

// Register for events

/**
 * Register a callback for specified topic.
 * @method on
 * @param topic {string}      The topic name of the event
 * @param callback {function} The handler to be called when the event is triggered.
 *                            Passed the event data as the first argumnt
 * @return {any} an event handler id (can be used to stop listening for the event)
 */

function on(topic: string, callback: (info: any) => void): any {
  return emitter.addListener(topic, false, callback);
}

/**
 * Register a callback for specified topic, once only.  Automatically unregisters
 * from the event one triggered.
 * @method once
 * @param topic {string}      The topic name of the event
 * @param callback {function} The handler to be called when the event is triggered.
 *                            Passed the event data as the first argument
 * @return {any} an event handler id (can be used to stop listening for the event)
 */

function once(topic: string, callback: (info: any) => void): any {
  return emitter.addListener(topic, true, callback);
}

// Unregister from events

/**
 * Register a callback for specified topic, once only.  Automatically unregisters
 * from the event one triggered.
 * @method off
 * @param listener {any}      ID returned from a call to on() once() or addEventListener()
 */

function off(listener: any): void {
  emitter.removeListener(listener);
}

// Fire events

/**
 * Trigger an event for a topic, passing the event data (by reference) to any registered
 * handlers.  If passing by reference is an issue, the caller is responsible for cloning.
 * @method fire
 * @param topic {string}  The topic name of the event
 * @param data {any}      Data to be passed to registered handlers
 */

function fire(topic: string, data: any): void {
  emitter.emit(topic, data);
}

function diagnostics(): void {
  emitter.diagnostics();
}

// Export interface

export {
  on,
  once,
  off,
  fire,
  diagnostics,
};
