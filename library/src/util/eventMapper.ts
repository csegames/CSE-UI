/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-12 16:18:46
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-12 16:44:54
 */
import events from '../events';

export interface EventMap {
  receive: string;
  send: string;
}

export function eventToEvent(receive: string, send: string) {
  events.on(receive, (...params: any[]) => events.fire(send, ...params));
}

export function eventMapper(evtMap: EventMap[], fn: (...params: any[]) => void, ...params: any[]) {
  evtMap.map((evt: EventMap) => fn(evt.receive, evt.send, ...params));
}
