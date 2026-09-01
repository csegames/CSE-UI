// GENERATED FILE -- DO NOT EDIT

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Camelot Unchained REST interface

import { RequestConfig, RequestResult, xhrRequest } from './prerequisites';

export type AccountID = string;
export type CharacterID = string;
export type EntityID = string;
export type ScenarioInstanceID = string;
export type ShardID = number;
export type TradeID = string;
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

export enum PlayTime {
  None = 0,
  EST = 1,
  PST = 2,
  EET = 8,
  WET = 16,
  Asia = 32,
  All = 4294967295,
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

export interface CharacterCreationInput {
  classID: string;
  stats: { [key: string]: number; };
  factionID: Faction;
  bodyTypeID: string;
  name: string;
  raceID: string;
}

export const CharactersAPI = {
  CreateCharacterV3: function(config: RequestConfig, character: CharacterCreationInput): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v3/characters/create`,
      {},
      character,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SelectCharacter: function(config: RequestConfig, data: SelectCharacterParams): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/characters/token`,
      {},
      data,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CSECreateCharacterV2: function(config: RequestConfig, accountID: AccountID, character: CharacterCreationInput): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v3/characters/csecreate`,
      { accountID },
      character,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  DeleteCharacterV2: function(config: RequestConfig, characterID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v2/characters/delete`,
      { characterID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ChatServerRecord {
  address: string;
  transport: string;
}

export const DisplayNameAPI = {
  SetDisplayName: function(config: RequestConfig, wantName: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v1/displayname/set`,
      { wantName },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Euler3f {
  roll: number;
  pitch: number;
  yaw: number;
  x: number;
  y: number;
  z: number;
}

export const GuildsAPI = {
  CreateInvitationV1: function(config: RequestConfig, targetID?: AccountID, name?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (name !== undefined) parameters["name"] = name;
    return xhrRequest(
      'post',
      `${conf.url}v1/guild/invitation`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptInvitationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/invitation`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectInvitationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/invitation`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateApplicationV1: function(config: RequestConfig, targetID?: AccountID, name?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (name !== undefined) parameters["name"] = name;
    return xhrRequest(
      'post',
      `${conf.url}v1/guild/application`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptApplicationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/application`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectApplicationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/application`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetRankV1: function(config: RequestConfig, targetID: AccountID, targetRank: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/member`,
      { targetID, targetRank },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  KickV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/member`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateRankV1: function(config: RequestConfig, name: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v1/guild/rank`,
      { name },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  DeleteRankV1: function(config: RequestConfig, name: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/rank`,
      { name },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RenameRankV1: function(config: RequestConfig, currentName: string, newName: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/rank`,
      { currentName, newName },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  EnablePermissionV1: function(config: RequestConfig, rank: string, permission: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/rank/permission`,
      { rank, permission },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  DisablePermissionV1: function(config: RequestConfig, rank: string, permission: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/rank/permission`,
      { rank, permission },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ShiftRankV1: function(config: RequestConfig, name: string, delta: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v1/guild/rank/shift`,
      { name, delta },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetNameV1: function(config: RequestConfig, name: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/name`,
      { name },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetMOTDV1: function(config: RequestConfig, motd: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/motd`,
      { motd },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  LeaveV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectAllOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/offers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  BlockOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/guild/offers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AllowOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/guild/offers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export const ModerationAPI = {
  AppealWord: function(config: RequestConfig, word: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v1/appeal/word`,
      { word },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface NormalizedString {
  Normalized: string;
  Entered: string;
}

export const PresenceAPI = {
  GetStartingServer: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/startingServer`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetBestServer: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/bestServer`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetChatServer: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/chatServer`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetProxyByZone: function(config: RequestConfig, zoneInstanceID: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/proxyByZone/${zoneInstanceID}`,
      { zoneInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetProxyByServerAddress: function(config: RequestConfig, serverAddress: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/proxyByServerAddress/${serverAddress}`,
      { serverAddress },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetServers: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/servers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetPlayers: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/presence/players`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RestartZone: function(config: RequestConfig, name?: string, zoneInstanceID?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (name !== undefined) parameters["name"] = name;
    if (zoneInstanceID !== undefined) parameters["zoneInstanceID"] = zoneInstanceID;
    return xhrRequest(
      'post',
      `${conf.url}v1/presence/restartzone`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RestartAllZones: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v1/presence/restartallzones`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface SelectCharacterParams {
  accessToken: string;
  refreshToken: string;
  characterID: string;
}

export interface ServerPresence {
  name: string;
  address: string;
  zoneResourceID: number;
  zoneInstanceID: number;
  shardID: ShardID;
  zoneBoundsMax: Vec2f;
  zoneBoundsMin: Vec2f;
  restrictToFaction: Faction;
  isStartingZone: boolean;
  visibleZoneNames: string[];
  isMainInstance: boolean;
  isShuttingDown: boolean;
  isFull: boolean;
}

export const ServersAPI = {
  GetAvailableZones: function(config: RequestConfig, shard?: ShardID | null): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (shard !== undefined) parameters["shard"] = shard;
    return xhrRequest(
      'get',
      `${conf.url}v1/availableZones`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetZoneInfo: function(config: RequestConfig, shard: ShardID, zoneID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      `${conf.url}v1/getZoneInfo`,
      { shard, zoneID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
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

export const WarbandsAPI = {
  CreateInvitationV1: function(config: RequestConfig, targetID?: CharacterID, name?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (name !== undefined) parameters["name"] = name;
    return xhrRequest(
      'post',
      `${conf.url}v1/warband/invitation`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptInvitationV1: function(config: RequestConfig, targetID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/warband/invitation`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectInvitationV1: function(config: RequestConfig, targetID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/warband/invitation`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateApplicationV1: function(config: RequestConfig, targetID?: CharacterID, name?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (name !== undefined) parameters["name"] = name;
    return xhrRequest(
      'post',
      `${conf.url}v1/warband/application`,
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptApplicationV1: function(config: RequestConfig, targetID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/warband/application`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectApplicationV1: function(config: RequestConfig, targetID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/warband/application`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetRankV1: function(config: RequestConfig, targetID: CharacterID, targetRank: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/warband/member`,
      { targetID, targetRank },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  KickV1: function(config: RequestConfig, targetID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/warband/member`,
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetSubgroupV1: function(config: RequestConfig, targetID: CharacterID, targetSubgroup: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/warband/subgroup`,
      { targetID, targetSubgroup },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SwapSubgroupsV1: function(config: RequestConfig, targetID0: CharacterID, targetID1: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      `${conf.url}v1/warband/subgroup`,
      { targetID0, targetID1 },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  LeaveV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/warband`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  UpgradeV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/warband`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectAllOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/warband/offers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  BlockOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      `${conf.url}v1/warband/offers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AllowOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      `${conf.url}v1/warband/offers`,
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ZoneInfo {
  ID: string;
  Name: string;
  Address: string;
  Bounds: string;
  RestrictToFaction: Faction;
}


