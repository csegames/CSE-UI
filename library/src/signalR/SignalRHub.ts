/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-12 16:17:30
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-12 16:43:50
 */
import events from '../events';
import client from '../core/client';
import {eventMapper, EventMap} from '../util/eventMapper';

function signalRToEvents(recieve: string, send: string, hub: any, hubName: string, debug: boolean) {
  if (!hub) return;
  hub.on(recieve, (...params:any[]) => {
    if (debug && console) {
      console.group(`SIGNALR | ${hubName} : ${recieve}`);
      console.log('params', params);
      console.groupEnd();
    }
    events.fire(send, ...params);
  });
}

export interface SignalRHubOptions {
  debug?: boolean;
  reconnectOnDisconnect?: boolean;
}


export class SignalRHub {
  
  private hubName: string;
  private eventMaps: EventMap[];
  private hub: any;
  private debug: boolean;
  private conn: any;
  private reconnectOnDisconnect: boolean = true;
  private wantStop: boolean = false;
  private tryingToReconnect: boolean = false;

  public onConnected: (hub: SignalRHub) => void;

  constructor(hubName: string, eventMaps: EventMap[], options?: SignalRHubOptions) {
    this.hubName = hubName;
    this.eventMaps = eventMaps;

    if (options) {
      this.debug = options.debug || false;
      this.reconnectOnDisconnect = options.reconnectOnDisconnect || true;
    }
  }

  public start(onConnected?: (hub: SignalRHub) => void) {
    this.conn = ($ as any).hubConnection();
    this.conn.url = client.signalRHost;
    this.hub = this.conn.createHubProxy(this.hubName);
    
    this.conn.connectionSlow(this.onConnectionSlow);
    this.conn.reconnecting(this.onReconnecting);
    this.conn.reconnected(this.onReconnected);
    this.conn.disconnected(this.onDisconnected);

    this.registerEvents();

    this.conn.start().done(() => {
      if (this.onConnected) this.onConnected(this);
      if (onConnected) onConnected(this);
    });
  }

  public stop() {
    this.conn.stop();
  }

  public invoke(method: string, ...params: any[]): {done: (...params: any[]) => void} {
    return this.hub.invoke(method, ...params);
  }

  private onDisconnected() {
    if (this.debug) {
      console.error(`SignalR Hub Disconnected | ${this.hubName} : ${this.hub.lastError}`)
    }
    // try to reconnect again in 5 seconds.
    if (this.reconnectOnDisconnect && this.tryingToReconnect) {
      setTimeout(() => {
        this.conn.start();
      }, 5000);
    }
  }

  private onConnectionSlow() {
    if (this.debug) {
      console.debug(`SignalR Hub Connection Slow | ${this.hubName}`);
    }
  }

  private onReconnecting() {
    if (this.debug) {
      console.debug(`SignalR Hub Reconnecting | ${this.hubName}`);
    }
    this.tryingToReconnect = true;
  }

  private onReconnected() {
    if (this.debug) {
      console.debug(`SignalR Hub Reconnected | ${this.hubName}`)
    }
    this.tryingToReconnect = false;
  }

  private registerEvents() {
    eventMapper(this.eventMaps, signalRToEvents, this.hub, this.hubName, this.debug);
  }

  private unregisterEvents() {
    if (this.hub) {
      this.eventMaps.map((evt: EventMap) => {
        this.hub.off(evt.recieve);
        events.off(evt.send);
      });
    } else {
      this.eventMaps.map((evt: EventMap) => {
        events.off(evt.send);
      });
    }
  }
}
