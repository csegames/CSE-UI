/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from './ListenerHandle';

export type Callback = (...args: any[]) => any;

class Listener {
  private static internalId = 0;

  public readonly id: number;
  public readonly callback: Callback;
  public fired: number = 0;
  public last: number = 0;
  constructor(callback: Callback) {
    this.callback = callback;
    this.id = ++Listener.internalId;
  }
}

export type LoggingFunction = (...data: any[]) => void;
function emptyLog(..._: any[]): void {}

class Event {
  readonly topic: string;
  readonly repeat: Map<number, Listener> = new Map();
  readonly once: Map<number, Listener> = new Map();

  constructor(topic: string) {
    this.topic = topic;
  }

  public add(listener: Listener, once: boolean): ListenerHandle {
    if (once) {
      this.once.set(listener.id, listener);
    } else {
      this.repeat.set(listener.id, listener);
    }
    const ev = this;
    return {
      close() {
        ev.remove(listener.id);
      }
    };
  }

  public remove(id: number): void {
    this.once.delete(id);
    this.repeat.delete(id);
  }

  public fire(...params: any[]): void {
    for (const [_, listener] of this.once) {
      listener.callback(...params);
    }
    this.once.clear();
    for (const [_, listener] of this.repeat) {
      listener.last = Date.now();
      listener.fired++;
      listener.callback(...params);
    }
  }

  public printDiagnostics(): string {
    let value = `Event: ${this.topic}`;
    for (const [_, listener] of this.once) {
      value += `\n  ${listener.id}: ${typeof listener.callback} [once]`;
    }
    for (const [_, listener] of this.repeat) {
      value += `\n  ${listener.id}: ${typeof listener.callback} [repeat (${listener.fired})] last = ${listener.last}`;
    }
    return value;
  }
}

export class EventEmitter {
  readonly log: LoggingFunction;
  readonly events: Map<string, Event> = new Map();
  readonly eventLookup: Map<number, Event> = new Map();

  constructor(log?: LoggingFunction) {
    this.log = log ?? emptyLog;
  }

  public on(topic: string, callback: Callback): ListenerHandle {
    return this.addListener(topic, false, callback);
  }

  public listenOnce(topic: string, callback: Callback): ListenerHandle {
    return this.addListener(topic, true, callback);
  }

  public trigger(topic: string, ...params: any[]) {
    this.log(topic, ...params);
    this.events.get(topic)?.fire(...params);
  }

  public off(handle: number | ListenerHandle): void {
    if (typeof handle !== 'number') {
      handle.close();
      return;
    }
    this.eventLookup.get(handle)?.remove(handle);
    this.eventLookup.delete(handle);
  }

  public hasEvent(topic: string) {
    return this.events.has(topic);
  }

  public printDiagnostics(): string {
    let value = '';
    for (const [_, event] of this.events) {
      value += event.printDiagnostics();
    }
    return value;
  }

  private addListener(topic: string, once: boolean, callback: Callback): ListenerHandle {
    const listener = new Listener(callback);
    let event = this.events.get(topic);
    if (!event) {
      event = new Event(topic);
      this.events.set(topic, event);
    }
    this.eventLookup.set(listener.id, event);
    return event.add(listener, once);
  }
}

export const globalEvents: EventEmitter = new EventEmitter();
