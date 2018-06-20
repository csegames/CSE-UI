/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let internalId = 0;
interface Listener {
  id: number;
  topic: string;
  once: boolean;
  callback: (...params: any[]) => void;
  fired: number;
  last: number;
}

export interface EventEmitter {
  addListener: (topic: string, once: boolean, callback: (...params: any[]) => void) => number;
  on: (topic: string, callback: (...params: any[]) => void) => number;
  listenOnce: (topic: string, callback: (...params: any[]) => void) => number;
  removeListener: (handle: number) => void;
  emit: (topic: string, ...params: any[]) => void;
  diagnostics: () => void;
}

interface InternalEmitter extends EventEmitter {
  _events: {[key: string]: Listener[]};
  _listenersById: {[key: number]: Listener};
}

function createListener(topic: string, once: boolean, callback: (...params: any[]) => void) {
  return {
    topic,
    once,
    callback,
    id: ++internalId,
    fired: 0,
    last: 0,
  };
}

function addListener(em: InternalEmitter, topic: string, once: boolean = false, callback: (...params: any[]) => void) {
  const listeners: Listener[] = em._events[topic] = em._events[topic] || [];
  const listener: Listener = createListener(topic, once, callback);
  const i: number = listeners.indexOf(null);
  if (i === -1) {
    em._listenersById[listener.id] = listener;
    listeners.push(listener);
  } else {
    em._listenersById[listener.id] = listener;
    listeners[i] = listener;
  }
  return listener.id;
}

function listenOnce(em: InternalEmitter, topic: string, callback: (...params: any[]) => void) {
  return addListener(em, topic, true, callback);
}

function removeListener(em: InternalEmitter, handle: number) {
  const listener = em._listenersById[handle];
  if (!listener) return;

  const listeners: Listener[] = em._events[listener.topic];
  if (listeners && listeners.length) {
    for (let i = 0; i < listeners.length; i++) {
      const _listener = listeners[i];
      if (_listener && _listener.id === listener.id) {
        listeners[i] = null;
        break;
      }
    }

    em._events[listener.topic] = listeners;
  }
}

function emit(em: InternalEmitter, topic: string, ...params: any[]) {
  const listeners: Listener[] = em._events[topic];
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
            + ' topic ' + listener.topic
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
  emitter.addListener = (topic, once, callback) => addListener(emitter, topic, once, callback),
  emitter.on = (topic, callback) => addListener(emitter, topic, false, callback),
  emitter.listenOnce = (topic, callback) => listenOnce(emitter, topic, callback);
  emitter.removeListener = handle => removeListener(emitter, handle);
  emitter.emit = (topic, ...params) => emit(emitter, topic, ...params);
  emitter.diagnostics = () => diagnostics(emitter);
  return emitter as EventEmitter;
}

// Ensure there is only 1 default emitter no matter how this file is included
const w = window as any;
if (!w.cse_defaultEventEmitter) {
  (window as any).cse_defaultEventEmitter = createEventEmitter();
}
export const emitter = (window as any).cse_defaultEventEmitter as EventEmitter;
