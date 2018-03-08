/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as _ from 'lodash';
import { withDefaults } from '../utils/withDefaults';
import { ReconnectingWebSocket, WebSocketOptions } from '../utils/ReconnectingWebSocket';


export interface Options<DataType> extends WebSocketOptions {
  // Data to send to the server on connection init
  initPayload: any;
  onDataReceived: (data: DataType) => void;
  onError: (error: Error) => void;
  onClosed: () => void;
}

export const defaultSubscriptionOpts: Options<any> = {
  url: '/graphql',
  protocols: 'graphql-ws',
  reconnectInterval: 1000,
  connectTimeout: 2000,
  onDataReceived: data => console.log(data),
  onError: e => console.error(e),
  onClosed: () => null,
};

export interface Result {
  id: string;
  isOpen: boolean;
  close: () => void;
}

// Follow Apollo GraphQL Protocol -- https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md

// Client => Server
const GQL_CONNECTION_INIT = 'connection_init';
const GQL_START = 'start';

// Server => Client
const GQL_ACK = 'connection_ack';
const GQL_DATA = 'data';

export interface OperationMessage {
  type: string;
  id: string;
  payload: any;
}

// GLOBAL SINGLE INSTANCES
let socket: ReconnectingWebSocket = null;
let idCounter = 0;

function startMessage(query: string, variables?: any, operationName?: string): OperationMessage {
  const subscriptionID = idCounter++ + '';
  return {
    type: GQL_START,
    id: subscriptionID,
    payload: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  };
}

export function subscribe<DataType>(subscription: string, options?: Partial<Options<DataType>>): Result {

  if (!(window as any).WebSocket) {
    throw new Error('WebSockets not supported by this browser');
  }

  const start = startMessage(subscription);

  if (socket === null) {
    socket = new ReconnectingWebSocket(options);

    socket.onopen = function() {
      // send GQL_CONNECTION_INIT
      socket.send(JSON.stringify({
        payload: options.initPayload,
      }));
    };
  
    socket.onerror = function(e: ErrorEvent) {
      console.log(e);
    };
  
    socket.onmessage = function(e: MessageEvent) {
      const message = JSON.parse(e.data);
      switch (message.type) {
        case GQL_ACK:
          socket.send(JSON.stringify({
            type: GQL_START,
            id: subscriptionID,
            payload: JSON.,
          }));
          break;
        case GQL_DATA:
  
          break;
      }
    };
  }


  

  return {
    id: start.id,
    ...socket,
  };
}

