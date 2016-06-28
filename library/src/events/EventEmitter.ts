/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let internalId = 0;

class Listener {
  id: number;
  topic: string;
  once: boolean;
  callback: (data: any) => void;
  fired: number = 0;
  last: number = 0;
  constructor(topic: string, once: boolean, callback: (data: any) => void) {
    this.topic = topic;
    this.once = once;
    this.callback = callback;
    this.id = ++internalId;
  }
}

class EventEmitter {
  events: any;
  constructor() {
    this.events = {};
  }

  /**
   * addListener() is called to register a listener for a topic.
   *
   * @param topic {string}         Topic name
   * @param once {boolean}         Fire event only once (auto-unregister) [optional]
   * @param callback {function}    Handler to call when topic is fired
   */
  addListener(topic: string, once: boolean = false, callback: (data: any) => void): any {
    const listeners: Listener[] = this.events[topic] = this.events[topic] || [];
    const listener: Listener = new Listener(topic, once, callback);
    let i: number = listeners.indexOf(null);
    if (i === -1) {
      listeners.push(listener);
    } else {
      listeners[i] = listener;
    }
    return listener;
  }

  /**
   * on() is called to register a listener for a topic.
   *
   * @param topic {string}         Topic name
   * @param callback {function}    Handler to call when topic is fired
   */
  on(topic: string, callback: (data: any) => void): any {
    return this.addListener(topic, false, callback);
  }


  /**
   * listenOnce() is called to register a listener for a topic that will
   * fire only once before being auto-removed.
   *
   * @param topic {string}         Topic name
   * @param callback {function}    Handler to call when topic is fired
   */
  listenOnce(topic: string, callback: (data: any) => void): any {
    return this.addListener(topic, true, callback);
  }

  /**
   * removeListener() is called to deregister an existing listener
   *
   * @param listener {any}   Handle returned by previous call to addListener()
   */
  removeListener(listener: any): void {
    const listeners: Listener[] = this.events[listener.topic];
    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i] && listeners[i].id === listener.id) {
          listeners[i] = null;
          return;
        }
      }
    }
  }

  /**
   * emit() is called to pass the supplied data to the registered handlers for the topic
   *
   * @param topic {string}         Topic name
   * @param data {any}  The data being passed (depends on topic)
   */
  emit(topic: string, data?: any): void {
    const listeners: Listener[] = this.events[topic];
    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i]) {
          const listener: Listener = listeners[i];
          if (listener.once) {
            listeners[i] = null;
          }
          listener.last = Date.now();
          listener.fired ++;
          listener.callback(data);
        }
      }
    }
  }

  /**
   * diagnostics() - dump data to console.log
   */  
  diagnostics = () : void => {
    for (let key in this.events) {
      if (this.events.hasOwnProperty(key)) {
        const listeners : Listener[] = this.events[key];
        listeners.forEach((listener: Listener, index: number) : void => {
          if (listener) {
            console.log(
              'Event:'
              + ' topic ' + listener.topic
              + ' index ' + index
              + ' ID ' + listener.id
              + ' once ' + listener.once
              + ' callback ' + typeof(listener.callback)
              + ' fired ' + listener.fired
              + ' last ' + (new Date(listener.last)).toISOString()
            );
          } else {
            console.log('Event: Index ' + index + ' is free (null)');
          }
        });
      }
    } 
  }
}

export default EventEmitter;
