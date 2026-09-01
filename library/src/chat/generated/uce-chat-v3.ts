// GENERATED FILE -- DO NOT EDIT
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Unchained Entertainment websocket chat subprocotol

import { RequestConfig, RequestResult, xhrRequest } from './prerequisites';

export const SUBPROTOCOL = 'uce-chat-v3';
export type IChatRequest = AuthRequest | ListRoomsRequest | SendRequest | PingMessage | PongMessage;
export type IChatResponse = ConnectedResponse | ErroredResponse | JoinedResponse | LeftResponse | ListingResponse | ReceivedResponse | PingMessage | PongMessage;

export type AccountID = string;
export type CharacterID = string;
export type EntityID = string;
export type ProfileID = string;
export type ScenarioInstanceID = string;
export type ShardID = number;
export type TradeID = string;
export enum AnnouncementType {
  Text = 1,
  PopUp = 2,
  Worldspace = 4,
  PassiveAlert = 8,
  Victory = 16,
  Defeat = 32,
  Dialogue = 64,
  ObjectiveSuccess = 128,
  ObjectiveFail = 256,
  ALL = -1,
}

export enum BackerLevel {
  none = 0,
  builder = 10,
  founder = 20,
}

export enum Faction {
  Factionless = 0,
  TDD = 1,
  Viking = 2,
  Arthurian = 3,
}

export const MessageTypes = {
  Auth: 'auth',
  Send: 'send',
  ListRooms: 'list_rooms',
  Ping: 'ping',
  Pong: 'pong',
  Received: 'received',
  Joined: 'joined',
  Left: 'left',
  Listing: 'listing',
  Connected: 'connected',
  Errored: 'errored',
} as const;
type MessageTypes = (typeof MessageTypes)[keyof typeof MessageTypes];

export enum MoveItemRequestLocationType {
  Invalid = 0,
  Container = 1,
  Equipment = 2,
  Ground = 3,
  Inventory = 4,
  AccountBank = 5,
  Trash = 6,
}

export enum ObjectiveState {
  Unstarted = 0,
  Active = 1,
  Complete = 2,
  Canceled = 3,
}

export enum OptInType {
  Scope = 1,
  WhatWeCollect = 2,
  HowWeCollect = 3,
  WhyWeCollect = 4,
  YourRights = 5,
  LegalComplianceAndSecurity = 6,
  DataRetention = 7,
  Children = 8,
  DataChoices = 9,
  DataProtection = 10,
  Changes = 11,
  ReadAndAck = 12,
}

export enum PerkType {
  Invalid = 0,
  Currency = 1,
  Costume = 2,
  Key = 3,
  Portrait = 4,
  Weapon = 5,
  CurrentBattlePassXP = 6,
  Emote = 7,
  RuneMod = 8,
  QuestXP = 9,
  SprintFX = 10,
  RuneModTierKey = 11,
  StatusMod = 12,
  StatMod = 13,
}

export enum PlayTime {
  None = 0,
  EST = 1,
  PST = 2,
  EET = 8,
  WET = 16,
  Asia = 32,
  All = 4294967295,
}

export enum RuneType {
  Weapon = 0,
  Protection = 1,
  Health = 2,
  CharacterMod = 3,
  Count = 4,
}

export enum ScenarioRoundState {
  Uninitialized = 0,
  Initializing = 1,
  Backfill = 2,
  BackfillLocked = 3,
  WaitingForConnections = 4,
  Countdown = 5,
  Running = 6,
  Epilogue = 7,
  Ended = 8,
  COUNT = 9,
}

export enum StatType {
  None = 0,
  Primary = 1,
  Secondary = 2,
  Derived = 3,
  Hidden = 4,
}

export enum TransactionType {
  Paypal = 1,
  Kickstarter = 2,
  Child = 3,
  Stripe = 4,
  CSE = 5,
}

export interface AuthRequest {
  id: number;
  token: string;
  type: 'auth';
}

export interface ConnectedResponse {
  supportedScopes: string[];
  supportedTags: string[];
  keepAliveSeconds: number;
  serverTime: number;
  type: 'connected';
}

export interface EmbedRecord {
  offset: number;
  handler: string;
  data: { [key: string]: string; };
}

export interface ErroredResponse {
  messageID: number;
  error: ErrorReturn;
  type: 'errored';
}

export interface ErrorReturn {
  system: string;
  type: string;
  fields: { [key: string]: string; };
}

export interface Euler3f {
  roll: number;
  pitch: number;
  yaw: number;
  x: number;
  y: number;
  z: number;
}

export interface JoinedResponse {
  room: RoomRecord;
  type: 'joined';
}

export interface LeftResponse {
  room: RoomRecord;
  type: 'left';
}

export interface ListingResponse {
  joinedRooms: RoomRecord[];
  type: 'listing';
}

export interface ListRoomsRequest {
  id: number;
  type: 'list_rooms';
}

export interface NormalizedString {
  Normalized: string;
  Entered: string;
}

export const PermissionsAPI = {
  BlockUser: function(config: RequestConfig, targetID: CharacterID, note?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["targetID"] = targetID;
    if (note !== undefined) parameters["note"] = note;
    return xhrRequest(
      'post',
      `${conf.url}user/block`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  UnblockUser: function(config: RequestConfig, targetID: CharacterID, note?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["targetID"] = targetID;
    if (note !== undefined) parameters["note"] = note;
    return xhrRequest(
      'delete',
      `${conf.url}user/block`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface PingMessage {
  id: number;
  type: 'ping';
}

export interface PongMessage {
  id: number;
  type: 'pong';
}

export interface ReceivedResponse {
  sentAt: number;
  senderID: CharacterID;
  senderName: string;
  senderFaction: Faction;
  room: RoomRecord;
  content: string;
  embeds: EmbedRecord[];
  type: 'received';
}

export interface RoomRecord {
  scope: string;
  id: string;
  canSend: boolean;
}

export interface SendRequest {
  id: number;
  scope: string;
  target: string;
  text: string;
  type: 'send';
}

export interface Vec2f {
  x: number;
  y: number;
}

export interface Vec3f {
  x: number;
  y: number;
  z: number;
}


