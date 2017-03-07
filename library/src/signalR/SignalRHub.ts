/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-12 16:17:30
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-02 15:05:21
 */
import events from '../events';
import client from '../core/client';
import {eventMapper, EventMap} from '../util/eventMapper';

function signalRToEvents(recieve: string, send: string, hub: any, hubName: string, debug: boolean) {
  if (!hub) return;
  hub.on(recieve, (...params:any[]) => {
    events.fire(send, ...params);
  });
}

export interface SignalRHubOptions {
  debug?: boolean;
  reconnectOnDisconnect?: boolean;
}

export enum ConnectionState {
  Connecting = 0,
  Connected = 1,
  Reconnecting = 2,
  Disconnected = 4,
}

export class SignalRHub {
  
  private hubName: string;
  private eventMaps: EventMap[];
  private hub: any;
  private debug: boolean;
  private conn: any;
  public reconnectOnDisconnect: boolean = true;
  private wantStop: boolean = false;
  private tryingToReconnect: boolean = false;
  
  public connectionState: ConnectionState = ConnectionState.Disconnected;

  ////////////////////////////////////
  // lifetime events
  ////////////////////////////////////

  // Raised when the connection is connected
  public onConnected: (hub: SignalRHub) => void;

  // Raised before any data is sent over the connection
  public onStarting: (hub: SignalRHub) => void;
  
  // Raised when any data is received on the connection. Provides the received data
  public onReceived: (hub: SignalRHub, data: any) => void;

  // Raised when the client detecs a slow or frequently dropping connection
  public onConnectionSlow: (hub: SignalRHub) => void;

  // Raised when the underlying transport begins reconnecting
  public onReconnecting: (hub: SignalRHub) => void;

  // Raised when the underlying transport has reconnected
  public onReconnected: (hub: SignalRHub) => void;
  
  // Raised when the connection state changes. Provides the old state and the new state (Connecting, Connected, Reconnecting, or Disconnect)
  public onStateChanged: (hub: SignalRHub, state: {oldState: ConnectionState, newState: ConnectionState}) => void;

  // Raised when the connection has disconnected
  public onDisconnected: (hub: SignalRHub) => void;

  public onError: (hub: SignalRHub, error: string) => void;

  constructor(hubName: string, eventMaps: EventMap[], options?: SignalRHubOptions) {
    this.hubName = hubName;
    this.eventMaps = eventMaps;

    if (options) {
      this.debug = options.debug || false;
      this.reconnectOnDisconnect = options.reconnectOnDisconnect || true;
    }
  }

  public start(onStart?: (hub: SignalRHub) => void) {
    this.conn = ($ as any).hubConnection();
    this.conn.url = client.signalRHost;
    this.hub = this.conn.createHubProxy(this.hubName);
    

    // hook up lifetime events 
    this.conn.starting(this.internalOnStarting);
    this.conn.received(this.internalOnReceived);
    this.conn.connectionSlow(this.internalOnConnectionSlow);
    this.conn.reconnecting(this.internalOnReconnecting);
    this.conn.reconnected(this.internalOnReconnected);
    this.conn.stateChanged(this.internalOnStateChanged);
    this.conn.disconnected(this.internalOnDisconnected);

    // hoook up error handler
    this.conn.error(this.internalOnError);

    if (client.debug) {
      this.conn.logging = true;
    }

    this.registerEvents();

    this.conn.start().done(() => {
      if (onStart) onStart(this);
    });
  }

  public stop() {
    this.conn.stop();
  }

  public invoke(method: string, ...params: any[]): {done: (...params: any[]) => void} {
    return this.hub.invoke(method, ...params);
  }

  ////////////////////////////////////
  // lifetime events
  ////////////////////////////////////

  // Raised before any data is sent over the connection
  private internalOnStarting = () => {
    if (this.onStarting) this.onStarting(this);
  }

  // Raised when any data is received on the connection. Provides the received data
  private internalOnReceived = (data: any) => {
    if (this.onReceived) this.onReceived(this, data);
  }

  // Raised when the client detecs a slow or frequently dropping connection
  private internalOnConnectionSlow = () => {
    if (this.onConnectionSlow) this.onConnectionSlow(this)
  }

  // Raised when the underlying transport begins reconnecting
  private internalOnReconnecting = () => {
    if (this.onReconnecting) this.onReconnecting(this);
  }

  // Raised when the underlying transport has reconnected
  private internalOnReconnected = () => {
    if (this.onReconnected) this.onReconnected(this);
  }

  // Raised when the connection state changes. Provides the old state and the new state (Connecting, Connected, Reconnecting, or Disconnect)
  private internalOnStateChanged = (state: {oldState: ConnectionState, newState: ConnectionState}) => {
    this.connectionState = state.newState;
    if (state.newState == ConnectionState.Connected) {
      if (this.onConnected) this.onConnected(this);
    }
    if (this.onStateChanged) this.onStateChanged(this, state);
  }

  // Raised when the connection has disconnected
  private internalOnDisconnected = () => {
    // try to reconnect again in 5 seconds.
    if (this.reconnectOnDisconnect) {
      setTimeout(() => {
        this.start();
      }, 5000);
    }
    if (this.onDisconnected) this.onDisconnected(this);
  }

  ////////////////////////////////////
  // error handling
  ////////////////////////////////////

  private internalOnError = (error: string) => {
    if (this.onError) this.onError(this, error);
  }

  ////////////////////////////////////
  // map to event emitters
  ////////////////////////////////////

  private registerEvents() {
    eventMapper(this.eventMaps, signalRToEvents, this.hub, this.hubName, this.debug);
  }

  private unregisterEvents() {
    if (this.hub) {
      this.eventMaps.map((evt: EventMap) => {
        this.hub.off(evt.receive);
        events.off(evt.send);
      });
    } else {
      this.eventMaps.map((evt: EventMap) => {
        events.off(evt.send);
      });
    }
  }
}
