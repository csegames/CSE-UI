// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ExecutionResult, GraphQLError, DocumentNode } from 'graphql';

export { DocumentNode };

// https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md

export interface ConnectionInitMessage {
  type: 'connection_init';
  payload?: Record<string, unknown> | null;
}

export interface ConnectionAckMessage {
  type: 'connection_ack';
  payload?: Record<string, unknown> | null;
}

export interface PingMessage {
  type: 'ping';
  payload?: Record<string, unknown> | null;
}

export interface PongMessage {
  type: 'pong';
  payload?: Record<string, unknown> | null;
}

export interface SubscribePayload {
  operationName?: string | null;
  query: string;
  variables?: Record<string, unknown> | null;
  extensions?: Record<string, unknown> | null;
}

export interface SubscribeMessage {
  id: string;
  type: 'subscribe';
  payload: SubscribePayload;
}

export interface NextMessage {
  id: string;
  type: 'next';
  payload: ExecutionResult;
}

export interface ErrorMessage {
  id: string;
  type: 'error';
  payload: GraphQLError[];
}

export interface CompleteMessage {
  id: string;
  type: 'complete';
}

export type ClientMessage = ConnectionInitMessage | SubscribeMessage | PingMessage | PongMessage | CompleteMessage;

export type ServerMessage =
  | ConnectionAckMessage
  | PingMessage
  | PongMessage
  | NextMessage
  | ErrorMessage
  | CompleteMessage;

type JsonValue = string | number | boolean | null | JsonValue[] | JsonRecord;
type JsonRecord = { [key: string]: JsonValue };

function isConnectionAck(obj: unknown): obj is ConnectionAckMessage {
  return (
    isJsonRecord(obj) &&
    obj['type'] === 'connection_ack' &&
    (obj['payload'] === undefined ||
      obj['payload'] === null ||
      isRecordOf(obj['payload'], (value): value is unknown => true))
  );
}

function isPing(obj: unknown): obj is PingMessage {
  return (
    isJsonRecord(obj) &&
    obj['type'] === 'ping' &&
    (obj['payload'] === undefined ||
      obj['payload'] === null ||
      isRecordOf(obj['payload'], (value): value is unknown => true))
  );
}

function isPong(obj: unknown): obj is PongMessage {
  return (
    isJsonRecord(obj) &&
    obj['type'] === 'pong' &&
    (obj['payload'] === undefined || isRecordOf(obj['payload'], (value): value is unknown => true))
  );
}

export function isSubscribeMessage(obj: unknown): obj is SubscribeMessage {
  const isSubscribePayload = (obj: unknown): obj is SubscribePayload => {
    return (
      isJsonRecord(obj) &&
      (obj['operationName'] === undefined ||
        obj['operationName'] === null ||
        typeof obj['operationName'] === 'string') &&
      typeof obj['query'] === 'string' &&
      (obj['variables'] === undefined ||
        obj['variables'] === null ||
        isRecordOf(obj['variables'], (value): value is unknown => true)) &&
      (obj['extensions'] === undefined ||
        obj['extensions'] === null ||
        isRecordOf(obj['extensions'], (value): value is unknown => true))
    );
  };

  return (
    isJsonRecord(obj) &&
    obj['type'] === 'subscribe' &&
    typeof obj['id'] === 'string' &&
    isSubscribePayload(obj['payload'])
  );
}

function isGraphQLError(obj: unknown): obj is GraphQLError {
  return isJsonRecord(obj) && typeof obj['message'] === 'string';
}

function isNext(obj: unknown): obj is NextMessage {
  const isExecutionResult = (inner: unknown): inner is ExecutionResult => {
    return (
      isJsonRecord(inner) &&
      (inner['error'] === null || typeof inner['error'] === 'undefined' || isArrayOf(inner['error'], isGraphQLError))
    );
  };

  return (
    isJsonRecord(obj) && obj['type'] === 'next' && typeof obj['id'] === 'string' && isExecutionResult(obj['payload'])
  );
}

function isError(obj: unknown): obj is ErrorMessage {
  return (
    isJsonRecord(obj) &&
    obj['type'] === 'error' &&
    typeof obj['id'] === 'string' &&
    isArrayOf(obj['payload'], isGraphQLError)
  );
}

function isComplete(obj: unknown): obj is ErrorMessage {
  return isJsonRecord(obj) && obj['type'] === 'complete';
}

function isArrayOf<T>(obj: unknown, func: (x: unknown) => x is T): obj is T[] {
  var json = obj as JsonValue;
  return Array.isArray(json) && json.every(func);
}

function isJsonRecord(obj: unknown): obj is JsonRecord {
  return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}

function isRecordOf<T>(obj: unknown, func: (x: unknown) => x is T): obj is Record<string, T> {
  return isJsonRecord(obj) && Object.values(obj).every(func);
}

export function parseServerMessage(data: string): ServerMessage {
  const json = JSON.parse(data);
  if (isConnectionAck(json) || isPing(json) || isPong(json) || isNext(json) || isError(json) || isComplete(json)) {
    return json;
  }
  throw Error(`Unknown response type \"${json['type']}\"`);
}
