/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharacterKind } from '../types/CharacterKind';
import { GroupMemberResource } from '../../graphql/schema';
import { ObjectiveUIVisibility } from '../../../_baseGame/types/Objective';
import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { BuildingPlotMapUISettings, AttackingFactions } from '../types/BuildingPlot';
import { Faction, ObjectiveState, Vec3f } from '../../webAPI/definitions';

// This should map to UI::StatusState
export interface StatusState {
  id: number;
  duration: number;
  startTime: number;
}

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
  resources: ArrayMap<EntityResource>;
  objective: ObjectiveStateModel | null;
}

// This should map to NumericItemDefID in ItemDataEnums.h on the client side.
export enum NumericItemDefID {
  None = 0
}

// This should map to UI::EntityTracker::ItemSnapshot
export interface ItemEntityStateModel extends BaseEntityStateModel {
  itemDefID: NumericItemDefID;
  iconClass: string;
}

export interface EntityPositionMapModel {
  [entityID: string]: Vec3f;
}

export function isItem(entity: BaseEntityStateModel): entity is PlayerEntityStateModel {
  return entity && typeof (entity as any).itemDefID === 'number';
}

// This should map to UI::EntityTracker::OtherSnapshot
export interface OtherEntityStateModel extends BaseEntityStateModel {}

export function isOther(entity: BaseEntityStateModel): entity is PlayerEntityStateModel {
  return entity && !('characterKind' in entity);
}

// This should map to UI::EntityResource
export interface EntityResource extends GroupMemberResource {
  name: string;
  lastDecreaseTime: number;
}

// This should map to UI::EntityTracker::PlayerSnapshot
export interface PlayerEntityStateModel extends BaseEntityStateModel {
  characterKind: CharacterKind;
  accountID: string;
  classID: number;
  // EntityID of an entity this Player is controlling, if any.
  // ie. a siege engine, vehicle, creature, etc...
  controlledEntityID?: string;
  gender: number;
  wounds: number;
  race: number;
}

export function isPlayer(entity: BaseEntityStateModel): entity is PlayerEntityStateModel {
  return entity && typeof (entity as any).characterKind === 'number';
}

// This should map to UI::EntityTracker::BuildingSnapshot
export interface BuildingPlotEntityStateModel extends BaseEntityStateModel {
  mapSettings: BuildingPlotMapUISettings;
  attackingFactions: AttackingFactions;
  keepLordEntityID: string;
  captureProgress: number;
}

export function isPlot(entity: BaseEntityStateModel): entity is PlayerEntityStateModel {
  return entity && typeof (entity as any).mapSettings === 'number';
}

export type AnyEntityStateModel =
  | BuildingPlotEntityStateModel
  | ItemEntityStateModel
  | PlayerEntityStateModel
  | OtherEntityStateModel;
