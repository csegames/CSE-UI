/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { ConnectionStatus } from '../types/ConnectionStatus';
import { EventEmitter } from '../types/EventEmitter';
import { NetworkFailure } from '../types/NetworkFailure';

export type ConnectionStatusListener = (status: ConnectionStatus, zoneID: string) => void;
export type ConnectionTargetsListener = (shardApiUrl: string, gameServerUrls: string) => void;
export type LoadingPhaseListener = (phaseName: string | null) => void;
export type NetworkFailureListener = (type: NetworkFailure, isAuth: boolean, isFatal: boolean) => void;

export interface NetworkEventMocks {
  triggerConnectionStatus(status: ConnectionStatus, zoneID: string): void;
  triggerConnectionTargets(shardApiUrl: string, gameServrUrls: string): void;
  triggerLoadingPhase(phaseName: string | null): void;
  triggerNetworkFailure(type: NetworkFailure, isAuth: boolean, isFatal: boolean): void;
}

export interface NetworkFunctions {
  bindConnectionStatusListener(listener: ConnectionStatusListener): ListenerHandle;
  bindConnectionTargetsListener(listener: ConnectionTargetsListener): ListenerHandle;
  bindLoadingPhaseListener(listener: LoadingPhaseListener): ListenerHandle;
  bindNetworkFailureListener(listener: NetworkFailureListener): ListenerHandle;

  isOfflineMode(): Promise<boolean>;
  connect(server?: string, port?: number): void;
  disconnect(): void;
}

// UI -> client (see UIViewListener.cpp)
const connectCallbackName = 'network.Connect';
const disconnectCallbackName = 'network.Disconnect';
const isOfflineModeName = 'network.IsOfflineMode';
// client -> UI (see UIEvents.h)
const connectionStatusEventName = 'network.connectionStatus';
const connectionTargetsEventName = 'network.connectionTargets';
const loadingPhaseEventName = 'network.loadingPhase';
const networkFailureEventName = 'network.failure';

abstract class NetworkFunctionsBase implements NetworkFunctions, NetworkEventMocks {
  private readonly events = new EventEmitter();

  bindConnectionStatusListener(listener: ConnectionStatusListener): ListenerHandle {
    return this.events.on(connectionStatusEventName, listener);
  }

  bindConnectionTargetsListener(listener: ConnectionTargetsListener): ListenerHandle {
    return this.events.on(connectionTargetsEventName, listener);
  }

  bindLoadingPhaseListener(listener: LoadingPhaseListener): ListenerHandle {
    return this.events.on(loadingPhaseEventName, listener);
  }

  bindNetworkFailureListener(listener: NetworkFailureListener): ListenerHandle {
    return this.events.on(networkFailureEventName, listener);
  }

  abstract isOfflineMode(): Promise<boolean>;
  abstract connect(server?: string, port?: number): void;
  abstract disconnect(): void;

  triggerConnectionStatus(status: ConnectionStatus): void {
    this.events.trigger(connectionStatusEventName, status);
  }

  triggerConnectionTargets(shardApiUrl: string, gameServrUrls: string): void {
    this.events.trigger(connectionTargetsEventName, shardApiUrl, gameServrUrls);
  }

  triggerLoadingPhase(phaseName: string | null): void {
    this.events.trigger(loadingPhaseEventName, phaseName);
  }

  triggerNetworkFailure(type: NetworkFailure, isAuth: boolean, isFatal: boolean): void {
    this.events.trigger(networkFailureEventName, type, isAuth, isFatal);
  }
}

class CoherentNetworkFunctions extends NetworkFunctionsBase {
  override isOfflineMode(): Promise<boolean> {
    return engine.call(isOfflineModeName);
  }

  override bindConnectionStatusListener(listener: ConnectionStatusListener): ListenerHandle {
    const jsHandle = super.bindConnectionStatusListener(listener);
    const engineHandle = engine.on(connectionStatusEventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }

  override bindConnectionTargetsListener(listener: ConnectionTargetsListener): ListenerHandle {
    const jsHandle = super.bindConnectionTargetsListener(listener);
    const engineHandle = engine.on(connectionTargetsEventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }

  override bindLoadingPhaseListener(listener: LoadingPhaseListener): ListenerHandle {
    const jsHandle = super.bindLoadingPhaseListener(listener);
    const engineHandle = engine.on(loadingPhaseEventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }

  override bindNetworkFailureListener(listener: NetworkFailureListener): ListenerHandle {
    const jsHandle = super.bindNetworkFailureListener(listener);
    const engineHandle = engine.on(networkFailureEventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }

  override connect(server?: string, port?: number): void {
    if (server === undefined) {
      engine.trigger(connectCallbackName); // by character
      return;
    }
    if (port === undefined) {
      engine.trigger(connectCallbackName, server); // by game server
      return;
    }
    engine.trigger(connectCallbackName, server, port); // direct to proxy
  }

  override disconnect(): void {
    engine.trigger(disconnectCallbackName);
  }
}

class BrowserNetworkFunctions extends NetworkFunctionsBase {
  private status = ConnectionStatus.Unknown;

  override isOfflineMode(): Promise<boolean> {
    return Promise.resolve(false);
  }

  override connect(server?: string, port?: number): void {
    switch (this.status) {
      case ConnectionStatus.Unknown:
      case ConnectionStatus.Disconnected:
      case ConnectionStatus.Disconnecting:
        this.status = ConnectionStatus.Connected;
        this.triggerConnectionStatus(ConnectionStatus.Connecting);
        window.setTimeout(() => this.triggerConnectionStatus(ConnectionStatus.Connected), 500);
        break;
    }
  }

  override disconnect(): void {
    switch (this.status) {
      case ConnectionStatus.Connected:
      case ConnectionStatus.Connecting:
        this.status = ConnectionStatus.Disconnected;
        this.triggerConnectionStatus(ConnectionStatus.Disconnecting);
        window.setTimeout(() => this.triggerConnectionStatus(ConnectionStatus.Disconnected), 500);
        break;
    }
  }
}

export const impl: NetworkFunctions & NetworkEventMocks = engine.isAttached
  ? new CoherentNetworkFunctions()
  : new BrowserNetworkFunctions();
