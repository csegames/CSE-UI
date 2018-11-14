/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare global {
  /**
   * Handle to an event used to unsubscribe the associated callback from an event
   */
  interface EventHandle {
    /**
     * Removes the associated callback from the event queue
     */
    readonly clear: () => void;

    /**
     * Name of the event.
     */
    readonly name: string;

    /**
     * ID of the event.
     */
    readonly id: number;
  }
}

let internalId = 0;
interface Listener {
  id: number;
  name: string;
  once: boolean;
  callback: Callback;
  fired: number;
  last: number;
}

interface Callback {
  (...args: any[]): any;
}

export interface EventEmitter {
  addListener: (name: string, once: boolean, callback: Callback) => EventHandle;
  on: (name: string, callback: Callback) => EventHandle;
  listenOnce: (name: string, callback: Callback) => EventHandle;
  removeListener: (handle: number) => void;
  emit: (name: string, ...params: any[]) => void;
  diagnostics: () => void;
}

interface InternalEmitter extends EventEmitter {
  _events: {[key: string]: Listener[]};
  _listenersById: {[key: number]: Listener};
}

function createListener(name: string, once: boolean, callback: Callback) {
  return {
    name,
    once,
    callback,
    id: ++internalId,
    fired: 0,
    last: 0,
  };
}

function addListener(em: InternalEmitter, name: string, once: boolean = false, callback: Callback) {
  if (game.debug) {
    console.log(`EventEmitter | addListener : ${name}  (once? ${once})`);
  }
  const listeners: Listener[] = em._events[name] = em._events[name] || [];
  const listener: Listener = createListener(name, once, callback);
  const i: number = listeners.indexOf(null);
  if (i === -1) {
    em._listenersById[listener.id] = listener;
    listeners.push(listener);
  } else {
    em._listenersById[listener.id] = listener;
    listeners[i] = listener;
  }
  return {
    name,
    id: listener.id,
    clear: () => removeListener(em, listener.id),
  };
}

function listenOnce(em: InternalEmitter, name: string, callback: Callback) {
  return addListener(em, name, true, callback);
}

function removeListener(em: InternalEmitter, id: number) {
  if (game.debug) console.log(`removeListener | addListener : ${name} :: id ${id})`);
  const listener = em._listenersById[id];
  if (!listener) return;

  const listeners: Listener[] = em._events[listener.name];
  if (listeners && listeners.length) {
    for (let i = 0; i < listeners.length; i++) {
      const _listener = listeners[i];
      if (_listener && _listener.id === listener.id) {
        listeners[i] = null;
        break;
      }
    }

    em._events[listener.name] = listeners;
  }
}

function emit(em: InternalEmitter, name: string, ...params: any[]) {
  if (game.debug) {
    console.groupCollapsed(`EventEmitter | emit : ${name}`);
    console.log(JSON.stringify(params));
    console.groupEnd();
  }
  const listeners: Listener[] = em._events[name];
  if (listeners && listeners.length) {
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i]) {
        const listener: Listener = listeners[i];
        if (listener.once) {
          listeners[i] = null;
        }
        listener.last = Date.now();
        listener.fired++;
        listener.callback(...params);
      }
    }
  }
}

function diagnostics(em: InternalEmitter) {
  for (const key in em._events) {
    if (em._events.hasOwnProperty(key)) {
      const listeners: Listener[] = em._events[key];
      listeners.forEach((listener: Listener, index: number) => {
        if (listener) {
          console.log(
            'Event:'
            + ' name ' + listener.name
            + ' index ' + index
            + ' ID ' + listener.id
            + ' once ' + listener.once
            + ' callback ' + typeof(listener.callback)
            + ' fired ' + listener.fired
            + ' last ' + (new Date(listener.last)).toISOString(),
          );
        } else {
          console.log('Event: Index ' + index + ' is free (null)');
        }
      });
    }
  }
}


export function createEventEmitter(): EventEmitter {
  const emitter = {
    _events: {},
    _listenersById: {},
  } as any;
  emitter.addListener = (name, once, callback) => addListener(emitter, name, once, callback),
  emitter.on = (name, callback) => addListener(emitter, name, false, callback),
  emitter.listenOnce = (name, callback) => listenOnce(emitter, name, callback);
  emitter.removeListener = handle => removeListener(emitter, handle);
  emitter.emit = (name, ...params) => emit(emitter, name, ...params);
  emitter.diagnostics = () => diagnostics(emitter);
  return emitter as EventEmitter;
}
