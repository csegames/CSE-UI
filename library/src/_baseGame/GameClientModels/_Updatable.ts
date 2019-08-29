/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare global {
  type Callback = (...args: any[]) => any;
}

export interface Updatable {
  /**
   * Indicates whether the game client has initialized this object
   */
  isReady: boolean;

  /**
   * Event name of the updatable
   */
  updateEventName: string;

  /**
   * Add a function to be executed any time this model is updated by the game client.
   */
  onUpdated: (callback: Callback) => EventHandle;

  /**
   * Add a function to be executed once when this model is initialized by the game client.
   */
  onReady: (callback: Callback) => EventHandle;
}

/**
 * Creates the default onUpdated functions for Updatable objects.
 * @param name the event name to call when the object is updated by the game client
 */
export function createDefaultOnUpdated(name: string) {
  return function(cb: Callback) {
    return game.on(name, cb);
  };
}

/**
 * Creates the default onReady functions for Updatable objects.
 * @param name the event name to call when the object is updated by the game client
 */
export function createDefaultOnReady(name: string) {
  return function(cb: Callback) {
    return game.once(name, cb);
  };
}

function noOp(...params: any[]) {}

export function initUpdatable(context: Updatable) {
  context.isReady = true;
  context.onUpdated = (cb: Callback) => {
    return game.on(context.updateEventName, cb);
  };
  context.onReady = (cb: Callback) => {
    // is already ready, call this callback on the next frame
    setTimeout(cb(context), 0);
    return {
      name: context.updateEventName,
      id: -1,
      clear: noOp,
    };
  };
}

export function executeUpdateCallbacks(context: Updatable) {
  game.trigger(context.updateEventName, context);
}
