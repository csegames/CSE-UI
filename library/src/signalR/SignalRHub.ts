/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as events  from '../events';
import client from '../core/client';
import { eventMapper, EventMap } from '../utils/eventMapper';
import * as Raven from 'raven-js';

declare const $: any;

function signalRToEvents(receive: string, send: string, hub: any, hubName: string, debug: boolean) {
  if (!hub) return;
  hub.on(receive, (...params: any[]) => {
    events.fire(send, ...params);
  });
}

export interface SignalRHubOptions {
  debug?: boolean;
}

export enum ConnectionState {
  Connecting = 0,
  Connected = 1,
  Reconnecting = 2,
  Disconnected = 4,
}

export type SignalRHubEvents = 'connected' | 'starting';

export interface DeferredObjectInfo {
  done: (...params: any[]) => DeferredObjectInfo;
  fail: (...params: any[]) => DeferredObjectInfo;
  isRejected: (...params: any[]) => DeferredObjectInfo;
  isResolved: (...params: any[]) => DeferredObjectInfo;
  reject: (...params: any[]) => DeferredObjectInfo;
  rejectWith: (...params: any[]) => DeferredObjectInfo;
  resolve: (...params: any[]) => DeferredObjectInfo;
  resolveWith: (...params: any[]) => DeferredObjectInfo;
  then: (...params: any[]) => DeferredObjectInfo;
}

type hubEvents = 'connected' | 'starting' | 'connectionslow' | 'reconnecting' | 'reconnected' | 'disconnected' |
'error' | 'received' | 'statechanged';

export class SignalRHub {

  private hubName: string;
  private eventMaps: EventMap[];
  private hub: any;
  private signalRHost: string;
  private debug: boolean;
  private conn: any = null;
  private wantStop: boolean = false;
  private tryingToReconnect: boolean = false;
  private eventHandlers: {
    [event: string]: {
      id: number;
      callback: ((...params: any[]) => void);
    }[];
  } = {};
  private handlerIDMap: { [id: number]: hubEvents; } = {};

  private handlerIdGen = 0;

  public connectionState: ConnectionState = ConnectionState.Disconnected;

  ////////////////////////////////////
  // lifetime events
  ////////////////////////////////////

  public set onStateChanged(
    callback: (hub: SignalRHub, state: { oldState: ConnectionState, newState: ConnectionState }) => void) {
      this.addEventHandler('statechanged', callback);
    }

  public set onReceived(callback: (hub: SignalRHub, data: any) => void) {
    this.addEventHandler('received', callback);
  }

  public set onError(callback: (hub: SignalRHub, error: string) => void) {
    this.addEventHandler('error', callback);
  }

  public set onConnected(callback: (hub: SignalRHub) => void) {
    this.addEventHandler('connected', callback);
  }

  public set onStarting(callback: (hub: SignalRHub) => void) {
    this.addEventHandler('starting', callback);
  }

  public set onConnectionSlow(callback: (hub: SignalRHub) => void) {
    this.addEventHandler('connectionslow', callback);
  }

  public set onReconnecting(callback: (hub: SignalRHub) => void) {
    this.addEventHandler('reconnecting', callback);
  }

  public set onReconnected(callback: (hub: SignalRHub) => void) {
    this.addEventHandler('reconnected', callback);
  }

  public set onDisconnected(callback: (hub: SignalRHub) => void) {
    this.addEventHandler('disconnected', callback);
  }



  constructor(
    hubName: string,
    eventMaps: EventMap[],
    options?: SignalRHubOptions,
    signalRHost: string = client.signalRHost,
  ) {
    this.hubName = hubName;
    this.eventMaps = eventMaps;
    this.signalRHost = signalRHost;

    if (options) {
      this.debug = options.debug || false;
    }

    this.addEventHandler = this.addEventHandler.bind(this);
  }


  public addEventHandler(
    event: 'statechanged',
    callback: (hub: SignalRHub, state: { oldState: ConnectionState, newState: ConnectionState }) => void);
  public addEventHandler(
      event: 'received',
      callback: (hub: SignalRHub, data: any) => void);
  public addEventHandler(
        event: 'error',
        callback: (hub: SignalRHub, error: string) => void);
  public addEventHandler(
    event: 'connected' | 'starting' | 'connectionslow' | 'reconnecting' | 'reconnected' | 'disconnected',
    callback: (hub: SignalRHub) => void);
  public addEventHandler(
    event: 'connected' | 'starting' | 'connectionslow' | 'reconnecting' | 'reconnected' | 'disconnected' |
            'error' | 'received' | 'statechanged',
    callback: ((hub: SignalRHub, state: { oldState: ConnectionState, newState: ConnectionState }) => void) |
              ((hub: SignalRHub, data: any) => void) |
              ((hub: SignalRHub, error: string) => void) |
              ((hub: SignalRHub) => void)) {

    if (this.debug) console.log(`SignalRHub [${this.hubName}] | addEventHandler(event: '${event}')`);

    const handler = {
      callback,
      id: ++this.handlerIdGen,
    };
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].push(handler);
    } else {
      this.eventHandlers[event] = [handler];
    }
    this.handlerIDMap[handler.id] = event;

    // handle event registration after an event has occurred, ie: registering for connected when we're already connected
    // in this case, we register, but also fire off the event now.
    if (event === 'connected' && this.connectionState === ConnectionState.Connected) {
      (callback as any)(this);
    }

    return handler.id;
  }

  public removeEventHandler = (id: number) => {
    const event = this.handlerIDMap[id];
    if (this.debug) console.log(`SignalRHub [${this.hubName}] | removeEventHandler(id: '${id}') [${event}]`);
    if (!event) return;
    const handlers = this.eventHandlers[event];
    this.eventHandlers[event] = handlers.filter(h => h.id !== id);
    delete this.handlerIDMap[id];
  }

  public start = (shouldReconnect: boolean = true, options?: { host: string; }) => {
    return new Promise((resolve) => {
      if (this.conn !== null) {
        resolve(this);
        return;
      }

      if (options) {
        if (options.host) {
          this.signalRHost = options.host;
        }
      }
      this.conn = ($ as any).hubConnection();
      this.conn.url = this.signalRHost;
      this.hub = this.conn.createHubProxy(this.hubName);

      // hook up lifetime events
      this.conn.starting(this.internalOnStarting);
      this.conn.received(this.internalOnReceived);
      this.conn.connectionSlow(this.internalOnConnectionSlow);
      this.conn.reconnecting(this.internalOnReconnecting);
      this.conn.reconnected(this.internalOnReconnected);
      this.conn.stateChanged(this.internalOnStateChanged);
      this.conn.disconnected(() => this.internalOnDisconnected(resolve, shouldReconnect));

      // hoook up error handler
      this.conn.error(this.internalOnError);

      if (client.debug) {
        this.conn.logging = true;
      }

      this.registerEvents();
      this.conn.start().done(() => {
        resolve(this);
      });
    });
  }

  public stop = () => {
    this.conn.stop();
  }

  public invoke = (method: string, ...params: any[]): DeferredObjectInfo => {
    return this.hub.invoke(method, ...params);
  }

  ////////////////////////////////////
  // lifetime events
  ////////////////////////////////////

  private fireEvent = (event: hubEvents, ...params: any[]) => {
    if (this.debug) console.log(`SignalRHub [${this.hubName}] | fireEvent(event: '${event}')`);
    const handlers = this.eventHandlers[event];
    if (handlers) {
      handlers.forEach(h => h.callback(this, ...params));
    }
  }

  // Raised before any data is sent over the connection
  private internalOnStarting = () => {
    this.fireEvent('starting');
  }

  // Raised when any data is received on the connection. Provides the received data
  private internalOnReceived = (data: any) => {
    this.fireEvent('received', data);
  }

  // Raised when the client detecs a slow or frequently dropping connection
  private internalOnConnectionSlow = () => {
    this.fireEvent('connectionslow');
  }

  // Raised when the underlying transport begins reconnecting
  private internalOnReconnecting = () => {
    this.fireEvent('reconnecting');
  }

  // Raised when the underlying transport has reconnected
  private internalOnReconnected = () => {
    this.fireEvent('reconnected');
  }

  // Raised when the connection state changes. Provides the old state and the new state
  // (Connecting, Connected, Reconnecting, or Disconnect)
  private internalOnStateChanged = (state: { oldState: ConnectionState, newState: ConnectionState }) => {
    this.connectionState = state.newState;
    if (state.newState === ConnectionState.Connected) {
      this.fireEvent('connected');
    }
    this.fireEvent('statechanged', state);
  }

  // Raised when the connection has disconnected
  private internalOnDisconnected = (resolve: any, shouldReconnect: boolean) => {
    this.conn = null;
    resolve(null);
    // try to reconnect again in 15 seconds.
    if (shouldReconnect) {
      setTimeout(() => {
        this.start();
      }, 15000);
    }
    this.fireEvent('disconnected');
  }

  ////////////////////////////////////
  // error handling
  ////////////////////////////////////

  private internalOnError = (error: string) => {
    Raven.captureMessage(`Signalr Error: ${error}`);
    this.fireEvent('error', error);
  }

  ////////////////////////////////////
  // map to event emitters
  ////////////////////////////////////

  private registerEvents = () => {
    eventMapper(this.eventMaps, signalRToEvents, this.hub, this.hubName, this.debug);
  }

  private unregisterEvents = () => {
    if (this.hub) {
      this.eventMaps.map((evt) => {
        this.hub.off(evt.receive);
      });
    }
  }
}
