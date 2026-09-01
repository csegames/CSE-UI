/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharacterKind } from '../types/CharacterKind';
import { Binding } from '../../../_baseGame/types/Keybind';
import { ObjectiveUIVisibility } from '../../../_baseGame/types/Objective';
import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { BuildingPlotMapUISettings, AttackingFactions } from '../types/BuildingPlot';
import { Faction, ObjectiveState, Vec3f } from '../../webAPI/definitions';
import { Item } from '../types/Items';
import { StatusState } from './StatusState';

// This should map to UI::ObjectiveSnapshot
export interface ObjectiveStateModel {
  visibility: ObjectiveUIVisibility;
  state: ObjectiveState;
  footprintRadius: number;
  indicator: number;
  indicatorLabel: string;
}

// This should map to UI::EntityTracker::Snapshot
export interface BaseEntityStateModel {
  entityID: string;
  type: string;
  faction: Faction;
  name: string;
  isAlive: boolean;
  statuses: ArrayMap<StatusState>;
  objective: ObjectiveStateModel | null;
  resources: ArrayMap<EntityResource>;
  // This is dumb because the keys are essentially array indices, but this is a map instead of an array.
  tags: Record<number, TagState>;
  flags: SnapshotFlags;
}

export enum SnapshotFlags {
  None = 0,
  LocallyControlled = 1,
  Targeted = 2,
  Near = 4,
  InParty = 8,
  Hovered = 16
}

// This should map to NumericItemDefID in ItemDataEnums.h on the client side.
export enum NumericItemDefID {
  None = 0
}

// This should map to UI::EntityTracker::ItemSnapshot
export interface ItemEntityStateModel extends BaseEntityStateModel {
  itemDefID: NumericItemDefID;
  iconClass: string;
  iconClassColor: number;
}

export interface EntityPositionMapModel {
  [entityID: string]: Vec3f;
}

export function isItem(entity: BaseEntityStateModel): entity is ItemEntityStateModel {
  return entity && typeof (entity as any).itemDefID === 'number';
}

// This should map to UI::EntityTracker::OtherSnapshot
export interface OtherEntityStateModel extends BaseEntityStateModel {}

export function isOther(entity: BaseEntityStateModel): entity is PlayerEntityStateModel {
  return entity && !('characterKind' in entity);
}

// This should map to UI::EntityResource
export interface EntityResource {
  name: string;
  lastDecreaseTime: number;
  current: number;
  id: string;
  max: number;
  changeRate: number;
}

export interface EntityStat {
  id: number;
  value: number;
}

export interface ProgressState {
  id: string;
  level: number;
  progress: number;
  total: number;
}

// This should map to UI::TagState
export interface TagState {
  affixes: Record<number, number>;
  count: number;
}

// This should map to UI::InteractionState
export interface InteractionState {
  name: string;
  enabled: boolean;
  disabledReason?: string;
  progress?: number;
  keybind?: Binding;
}

export interface WorldUIPositionModel {
  worldSpaceDistanceToPlayer: number;
  relativeScreenSpaceDistanceToCrosshair: number;
}

export interface WorldUIPositionMapModel {
  [id: number]: WorldUIPositionModel;
}

// This should map to UI::EntityTracker::PlayerSnapshot
export interface PlayerEntityStateModel extends BaseEntityStateModel {
  characterKind: CharacterKind;
  accountID: string;
  characterID: string;
  groupID: string;
  classID: number;
  guildCrest: string;
  guildID: string;
  guildName: string;
  // EntityID of an entity this Player is controlling, if any.
  // ie. a siege engine, vehicle, creature, etc...
  controlledEntityID?: string;
  gender: number;
  race: number;
  stats: Record<number, EntityStat>;
  progression: Record<string, ProgressState>;
  characterLevel: number;
  equipment: Record<number, Item>;
  inventory: Record<number, Item>;
  wallet: Record<number, Item>;
  accountBank: Record<number, Item>;
  isKeepAvailable: boolean;
  respawnTimestamp: number;
  idleRespawnTimestamp: number;
}

export function isEntityPlayer(entity: BaseEntityStateModel | null): entity is PlayerEntityStateModel {
  return !!entity && typeof (entity as any).characterKind === 'number';
}

export function isEntityItem(entity: BaseEntityStateModel | null): entity is ItemEntityStateModel {
  return !!entity && typeof (entity as any).itemDefID === 'number';
}

// This should map to UI::EntityTracker::BuildingSnapshot
export interface BuildingPlotEntityStateModel extends BaseEntityStateModel {
  mapSettings: BuildingPlotMapUISettings;
  attackingFactions: AttackingFactions;
  keepLordEntityID: string;
  captureProgress: number;
}

export function isEntityPlot(entity: BaseEntityStateModel | null): entity is PlayerEntityStateModel {
  return !!entity && typeof (entity as any).mapSettings === 'number';
}

export type AnyEntityStateModel =
  | BuildingPlotEntityStateModel
  | ItemEntityStateModel
  | PlayerEntityStateModel
  | OtherEntityStateModel;
