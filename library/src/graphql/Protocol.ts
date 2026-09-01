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
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === 'connection_ack' &&
    (json['payload'] === undefined ||
      json['payload'] === null ||
      isRecordOf(json['payload'], (value): value is unknown => true))
  );
}

function isPing(obj: unknown): obj is PingMessage {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === 'ping' &&
    (json['payload'] === undefined ||
      json['payload'] === null ||
      isRecordOf(json['payload'], (value): value is unknown => true))
  );
}

function isPong(obj: unknown): obj is PongMessage {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === 'pong' &&
    (json['payload'] === undefined || isRecordOf(json['payload'], (value): value is unknown => true))
  );
}

export function isSubscribeMessage(obj: unknown): obj is SubscribeMessage {
  var json = obj as JsonValue;

  const isSubscribePayload = (obj: unknown): obj is SubscribePayload => {
    var json = obj as JsonValue;
    return (
      json !== null &&
      typeof json === 'object' &&
      (json['operationName'] === undefined ||
        json['operationName'] === null ||
        typeof json['operationName'] === 'string') &&
      typeof json['query'] === 'string' &&
      (json['variables'] === undefined ||
        json['variables'] === null ||
        isRecordOf(json['variables'], (value): value is unknown => true)) &&
      (json['extensions'] === undefined ||
        json['extensions'] === null ||
        isRecordOf(json['extensions'], (value): value is unknown => true))
    );
  };

  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === 'subscribe' &&
    typeof json['id'] === 'string' &&
    isSubscribePayload(json['payload'])
  );
}

function isGraphQLError(obj: unknown): obj is GraphQLError {
  var json = obj as JsonValue;
  return json !== null && typeof json === 'object' && typeof json['message'] === 'string';
}

function isNext(obj: unknown): obj is NextMessage {
  var json = obj as JsonValue;

  const isExecutionResult = (inner: unknown): inner is ExecutionResult => {
    var innerJson = inner as JsonValue;

    return (
      innerJson !== null &&
      typeof innerJson === 'object' &&
      (innerJson['error'] === null ||
        typeof innerJson['error'] === 'undefined' ||
        isArrayOf(innerJson['error'], isGraphQLError))
    );
  };

  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === 'next' &&
    typeof json['id'] === 'string' &&
    isExecutionResult(json['payload'])
  );
}

function isError(obj: unknown): obj is ErrorMessage {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === 'error' &&
    typeof json['id'] === 'string' &&
    isArrayOf(json['payload'], isGraphQLError)
  );
}

function isComplete(obj: unknown): obj is ErrorMessage {
  var json = obj as JsonValue;
  return json !== null && typeof json === 'object' && json['type'] === 'complete';
}

function isArrayOf<T>(obj: unknown, func: (x: unknown) => x is T): obj is T[] {
  var json = obj as JsonValue;
  return Array.isArray(json) && json.every(func);
}

function isRecordOf<T>(obj: unknown, func: (x: unknown) => x is T): obj is Record<string, T> {
  var json = obj as JsonValue;
  return json !== null && typeof json === 'object' && Object.values(json).every(func);
}

export function parseServerMessage(data: string): ServerMessage {
  const json = JSON.parse(data);
  if (isConnectionAck(json) || isPing(json) || isPong(json) || isNext(json) || isError(json) || isComplete(json)) {
    return json;
  }
  throw Error(`Unknown response type \"${json['type']}\"`);
}
