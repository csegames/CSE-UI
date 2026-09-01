// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import './generated/uce-chat-v3';
import {
  ConnectedResponse,
  EmbedRecord,
  ErroredResponse,
  ErrorReturn,
  IChatResponse,
  JoinedResponse,
  LeftResponse,
  ListingResponse,
  MessageTypes,
  PingMessage,
  PongMessage,
  ReceivedResponse,
  RoomRecord
} from './generated/uce-chat-v3';

type JsonValue = string | number | boolean | null | JsonValue[] | JsonRecord;
type JsonRecord = { [key: string]: JsonValue };

function isConnectedResponse(obj: unknown): obj is ConnectedResponse {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === MessageTypes.Connected &&
    isArrayOf(json['supportedScopes'], isString) &&
    isArrayOf(json['supportedTags'], isString) &&
    typeof json['keepAliveSeconds'] === 'number' &&
    typeof json['serverTime'] === 'number'
  );
}

function isListingResponse(obj: unknown): obj is ListingResponse {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === MessageTypes.Listing &&
    isArrayOf(json['joinedRooms'], isRoomRecord)
  );
}

function isErroredResponse(obj: unknown): obj is ErroredResponse {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === MessageTypes.Errored &&
    typeof json['messageID'] === 'number' &&
    isErrorReturn(json['error'])
  );
}

function isJoinedResponse(obj: unknown): obj is JoinedResponse {
  var json = obj as JsonValue;
  return (
    json !== null && typeof json === 'object' && json['type'] === MessageTypes.Joined && isRoomRecord(json['room'])
  );
}

function isLeftResponse(obj: unknown): obj is LeftResponse {
  var json = obj as JsonValue;
  return json !== null && typeof json === 'object' && json['type'] === MessageTypes.Left && isRoomRecord(json['room']);
}

function isReceivedResponse(obj: unknown): obj is ReceivedResponse {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    json['type'] === MessageTypes.Received &&
    typeof json['sentAt'] === 'number' &&
    typeof json['senderID'] === 'string' &&
    typeof json['senderName'] === 'string' &&
    typeof json['senderFaction'] === 'number' &&
    isRoomRecord(json['room']) &&
    typeof json['content'] === 'string' &&
    isArrayOf(json['embeds'], isEmbedRecord)
  );
}

function isArrayOf<T>(obj: unknown, func: (x: unknown) => x is T): obj is T[] {
  var json = obj as JsonValue;
  return Array.isArray(json) && json.every(func);
}

function isRecordOf<T>(obj: unknown, func: (x: unknown) => x is T): obj is Record<string, T> {
  var json = obj as JsonValue;
  return json !== null && typeof json === 'object' && Object.values(json).every(func);
}

function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}

function isErrorReturn(obj: unknown): obj is ErrorReturn {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    typeof json['system'] === 'string' &&
    typeof json['type'] === 'string' &&
    isRecordOf(json['fields'], isString)
  );
}

function isPingMessage(obj: unknown): obj is PingMessage {
  var json = obj as JsonValue;
  return (
    json !== null && typeof json === 'object' && json['type'] === MessageTypes.Ping && typeof json['id'] === 'number'
  );
}

function isPongMessage(obj: unknown): obj is PongMessage {
  var json = obj as JsonValue;
  return (
    json !== null && typeof json === 'object' && json['type'] === MessageTypes.Pong && typeof json['id'] === 'number'
  );
}

function isRoomRecord(obj: unknown): obj is RoomRecord {
  var json = obj as JsonValue;
  return (
    json !== null && typeof json === 'object' && typeof json['id'] === 'string' && typeof json['scope'] === 'string'
  );
}

function isEmbedRecord(obj: unknown): obj is EmbedRecord {
  var json = obj as JsonValue;
  return (
    json !== null &&
    typeof json === 'object' &&
    typeof json['offset'] === 'number' &&
    typeof json['handler'] === 'string' &&
    isRecordOf(json['data'], isString)
  );
}

export function parseResponse(data: string): IChatResponse {
  const json = JSON.parse(data);
  if (
    isReceivedResponse(json) ||
    isJoinedResponse(json) ||
    isLeftResponse(json) ||
    isErroredResponse(json) ||
    isConnectedResponse(json) ||
    isListingResponse(json) ||
    isPingMessage(json) ||
    isPongMessage(json)
  ) {
    return json;
  }
  throw Error(`Unknown response type \"${json['type']}\"`);
}
