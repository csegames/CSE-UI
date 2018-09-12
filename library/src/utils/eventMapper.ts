/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface EventMap {
  receive: string;
  send: string;
}

export function eventToEvent(receive: string, send: string) {
  game.on(receive, (...params: any[]) => game.trigger(send, ...params));
}

export function eventMapper(evtMap: EventMap[], fn: (...params: any[]) => void, ...params: any[]) {
  evtMap.map((evt: EventMap) => fn(evt.receive, evt.send, ...params));
}
